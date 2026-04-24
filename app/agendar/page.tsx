import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import FormularioAgendamento from '@/components/FormularioAgendamento'
import { formatarHora, formatarDataCurta, HORA_INICIO, HORA_FIM } from '@/lib/slots'

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; hora?: string }>
}) {
  const { data, hora: horaStr } = await searchParams
  const hora = horaStr ? parseInt(horaStr, 10) : NaN

  const dataValida = data && /^\d{4}-\d{2}-\d{2}$/.test(data)
  const horaValida = !isNaN(hora) && hora >= HORA_INICIO && hora <= HORA_FIM

  if (!dataValida || !horaValida) redirect('/')

  // Verifica se o slot está disponível
  const supabase = createServerClient()
  const dataHora = `${data}T${String(hora).padStart(2, '0')}:00:00`

  const { data: existente } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('data_hora', dataHora)
    .eq('cancelado', false)
    .maybeSingle()

  const diaDate = new Date(data + 'T00:00:00')
  const { diaSemana, dataStr } = formatarDataCurta(diaDate)
  const labelDia = `${diaSemana}, ${dataStr}`
  const labelHora = `${formatarHora(hora)} – ${formatarHora(hora + 1)}`

  if (existente) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">😔</div>
          <h1 className="text-xl font-semibold">Horário indisponível</h1>
          <p className="text-muted-foreground">
            O horário de <strong>{labelDia}</strong> às <strong>{labelHora}</strong> já foi reservado.
          </p>
          <Link
            href="/"
            className="inline-block mt-2 text-sm font-medium underline underline-offset-4"
          >
            Ver outros horários disponíveis
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para a agenda
          </Link>
          <h1 className="text-2xl font-bold mt-4">Confirmar agendamento</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Preencha seus dados para reservar o horário.
          </p>
        </div>

        <FormularioAgendamento
          data={data!}
          hora={hora}
          labelDia={labelDia}
          labelHora={labelHora}
        />
      </div>
    </main>
  )
}
