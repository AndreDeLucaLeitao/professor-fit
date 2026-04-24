import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buscarAgendamentoPorToken } from '@/app/actions/agendamentos'
import { formatarDataCurta, formatarHora } from '@/lib/slots'
import LinkCancelamento from '@/components/LinkCancelamento'

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
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        {/* Cabeçalho de sucesso */}
        <div className="text-center space-y-3">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold">Agendamento confirmado!</h1>
          <p className="text-muted-foreground text-sm">
            Seu horário está reservado. Até lá!
          </p>
        </div>

        {/* Detalhes */}
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

        {/* Link de cancelamento */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">
              ⚠️ Guarde este link de cancelamento
            </p>
            <p className="text-xs text-amber-700">
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
  )
}
