import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buscarAgendamentoPorToken } from '@/app/actions/agendamentos'
import { formatarDataCurta, formatarHora } from '@/lib/slots'
import LinkCancelamento from '@/components/LinkCancelamento'
import SiteHeader from '@/components/SiteHeader'

export default async function ConfirmacaoPage({
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

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-md mx-auto space-y-8">
          {/* Cabeçalho de sucesso */}
          <div className="text-center space-y-4">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <svg className="size-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Agendamento confirmado!</h1>
              <p className="text-muted-foreground text-sm mt-2">
                Seu horário está reservado. Até lá!
              </p>
            </div>
          </div>

          {/* Detalhes */}
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

          {/* Link de cancelamento */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10 px-5 py-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-1">
                Guarde este link de cancelamento
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500">
                Se precisar cancelar, use o link abaixo. Não existe outra forma de cancelar.
              </p>
            </div>
            <LinkCancelamento token={token} />
          </div>

          <Link
            href="/"
            className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar para a agenda
          </Link>
        </div>
      </main>
    </>
  )
}
