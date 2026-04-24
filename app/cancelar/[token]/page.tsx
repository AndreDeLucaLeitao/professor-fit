import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buscarAgendamentoPorToken, cancelarAgendamento } from '@/app/actions/agendamentos'
import { formatarDataCurta, formatarHora } from '@/lib/slots'
import { Button } from '@/components/ui/button'

export default async function CancelarPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const agendamento = await buscarAgendamentoPorToken(token)

  if (!agendamento) notFound()

  const dtStr = agendamento.data_hora as string
  const diaDate = new Date(dtStr.substring(0, 10) + 'T00:00:00')
  const hora = parseInt(dtStr.substring(11, 13), 10)
  const { diaSemana, dataStr } = formatarDataCurta(diaDate)

  // Já cancelado
  if (agendamento.cancelado) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">✓</div>
          <h1 className="text-xl font-semibold">Agendamento cancelado</h1>
          <p className="text-muted-foreground text-sm">
            O horário de <strong>{diaSemana}, {dataStr}</strong> às <strong>{formatarHora(hora)}</strong> já foi cancelado e está disponível novamente.
          </p>
          <Link
            href="/"
            className="inline-block mt-2 text-sm font-medium underline underline-offset-4"
          >
            Ver agenda
          </Link>
        </div>
      </main>
    )
  }

  // Server Action inline — só é executada via POST (submit do form)
  async function confirmarCancelamento() {
    'use server'
    await cancelarAgendamento(token)
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Cancelar agendamento</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tem certeza que deseja cancelar?
          </p>
        </div>

        {/* Detalhes do agendamento */}
        <div className="rounded-lg border border-border divide-y divide-border">
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Aluno</p>
            <p className="font-medium">{agendamento.nome_aluno}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Data</p>
            <p className="font-medium">{diaSemana}, {dataStr}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Horário</p>
            <p className="font-medium">{formatarHora(hora)} – {formatarHora(hora + 1)}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Ao cancelar, o horário voltará a ficar disponível para outros alunos.
        </p>

        {/* Ações */}
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <form action={confirmarCancelamento} className="w-full sm:flex-1">
            <Button type="submit" variant="destructive" size="lg" className="w-full">
              Sim, cancelar agendamento
            </Button>
          </form>
          <Link
            href="/"
            className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted sm:w-auto"
          >
            Não, manter
          </Link>
        </div>
      </div>
    </main>
  )
}
