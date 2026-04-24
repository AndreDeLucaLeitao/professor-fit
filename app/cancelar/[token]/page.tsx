import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buscarAgendamentoPorToken, cancelarAgendamento } from '@/app/actions/agendamentos'
import { formatarDataCurta, formatarHora } from '@/lib/slots'
import { Button } from '@/components/ui/button'
import SiteHeader from '@/components/SiteHeader'

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

  if (agendamento.cancelado) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-muted mx-auto">
              <svg className="size-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Agendamento cancelado</h1>
              <p className="text-muted-foreground text-sm mt-2">
                O horário de <strong>{diaSemana}, {dataStr}</strong> às <strong>{formatarHora(hora)}</strong> já foi cancelado e está disponível novamente.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block text-sm font-semibold text-primary underline underline-offset-4"
            >
              Ver agenda
            </Link>
          </div>
        </main>
      </>
    )
  }

  async function confirmarCancelamento() {
    'use server'
    await cancelarAgendamento(token)
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">Cancelar agendamento</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Tem certeza que deseja cancelar?
            </p>
          </div>

          {/* Detalhes do agendamento */}
          <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
            <div className="px-5 py-3.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Aluno</p>
              <p className="font-semibold">{agendamento.nome_aluno}</p>
            </div>
            <div className="px-5 py-3.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Data</p>
              <p className="font-semibold">{diaSemana}, {dataStr}</p>
            </div>
            <div className="px-5 py-3.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Horário</p>
              <p className="font-semibold">{formatarHora(hora)} – {formatarHora(hora + 1)}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Ao cancelar, o horário voltará a ficar disponível para outros alunos.
          </p>

          {/* Ações */}
          <div className="flex flex-col gap-3 sm:flex-row-reverse">
            <form action={confirmarCancelamento} className="w-full sm:flex-1">
              <Button type="submit" variant="destructive" size="lg" className="w-full">
                Sim, cancelar agendamento
              </Button>
            </form>
            <Link
              href="/"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-muted sm:w-auto"
            >
              Não, manter
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
