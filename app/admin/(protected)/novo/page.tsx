import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import FormNovoAgendamento from '@/components/admin/FormNovoAgendamento'
import SeletorSlot from '@/components/admin/SeletorSlot'
import { formatarHora, formatarDataCurta, HORA_INICIO, HORA_FIM } from '@/lib/slots'

export default async function NovoAgendamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string; hora?: string }>
}) {
  const { data, hora: horaStr } = await searchParams
  const hora = horaStr ? parseInt(horaStr, 10) : NaN

  const dataValida = !!(data && /^\d{4}-\d{2}-\d{2}$/.test(data))
  const horaValida = !isNaN(hora) && hora >= HORA_INICIO && hora <= HORA_FIM
  const slotPreSelecionado = dataValida && horaValida

  const voltar = (
    <Link
      href="/admin"
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      ← Voltar para a agenda
    </Link>
  )

  // Sem slot pré-selecionado — mostra seletor de data e hora
  if (!slotPreSelecionado) {
    return (
      <main className="px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            {voltar}
            <h1 className="text-xl font-bold mt-4">Novo agendamento</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha a data e o horário.
            </p>
          </div>
          <SeletorSlot />
        </div>
      </main>
    )
  }

  // Slot selecionado — verifica disponibilidade e mostra formulário
  const supabase = createServerClient()
  const dataHora = `${data}T${String(hora).padStart(2, '0')}:00:00`

  const { data: existente } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('data_hora', dataHora)
    .eq('cancelado', false)
    .maybeSingle()

  const diaDate = new Date(data! + 'T00:00:00')
  const { diaSemana, dataStr } = formatarDataCurta(diaDate)
  const labelDia = `${diaSemana}, ${dataStr}`
  const labelHora = `${formatarHora(hora)} – ${formatarHora(hora + 1)}`

  if (existente) {
    return (
      <main className="px-4 py-8 max-w-md mx-auto space-y-4">
        <p className="text-destructive font-medium">Horário já ocupado.</p>
        {voltar}
      </main>
    )
  }

  return (
    <main className="px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          {voltar}
          <h1 className="text-xl font-bold mt-4">Novo agendamento</h1>
        </div>
        <FormNovoAgendamento
          data={data!}
          hora={hora}
          labelDia={labelDia}
          labelHora={labelHora}
        />
      </div>
    </main>
  )
}
