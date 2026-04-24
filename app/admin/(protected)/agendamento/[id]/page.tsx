import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import FormEditarAgendamento from '@/components/admin/FormEditarAgendamento'
import BotaoCancelarAdmin from '@/components/admin/BotaoCancelarAdmin'
import { formatarDataCurta, formatarHora } from '@/lib/slots'

async function buscarAgendamento(id: string) {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('agendamentos')
    .select('id, data_hora, nome_aluno, telefone, cancelado')
    .eq('id', id)
    .maybeSingle()
  return data
}

export default async function EditarAgendamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const agendamento = await buscarAgendamento(id)

  if (!agendamento || agendamento.cancelado) notFound()

  const dtStr = agendamento.data_hora as string
  const diaDate = new Date(dtStr.substring(0, 10) + 'T00:00:00')
  const hora = parseInt(dtStr.substring(11, 13), 10)
  const { diaSemana, dataStr } = formatarDataCurta(diaDate)

  return (
    <main className="px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para a agenda
          </Link>
          <h1 className="text-xl font-bold mt-4">Editar agendamento</h1>
        </div>

        {/* Info do slot */}
        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs text-muted-foreground mb-0.5">Horário</p>
          <p className="font-semibold">{diaSemana}, {dataStr}</p>
          <p className="text-sm text-muted-foreground">{formatarHora(hora)} – {formatarHora(hora + 1)}</p>
        </div>

        <FormEditarAgendamento
          id={agendamento.id}
          nomeAtual={agendamento.nome_aluno}
          telefoneAtual={agendamento.telefone}
        />

        {/* Excluir */}
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-3">Zona de perigo</p>
          <BotaoCancelarAdmin id={agendamento.id} />
        </div>
      </div>
    </main>
  )
}
