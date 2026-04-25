'use client'

import { Fragment, useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AgendamentoAdmin } from '@/app/actions/admin'
import { buscarAgendamentosAdmin, bloquearSlot, desbloquearSlot } from '@/app/actions/admin'
import {
  getDiasSemana,
  getHorarios,
  getSegundaFeira,
  formatarData,
  formatarDataCurta,
  formatarHora,
  formatarRangeSemana,
} from '@/lib/slots'

interface Props {
  agendamentosIniciais: AgendamentoAdmin[]
  segundaInicial: string
}

function chaveAgendamento(dataHora: string): string {
  return `${dataHora.substring(0, 10)} ${dataHora.substring(11, 13)}`
}

export default function CalendarioAdmin({ agendamentosIniciais, segundaInicial }: Props) {
  const [segunda, setSegunda] = useState<Date>(
    () => new Date(segundaInicial + 'T00:00:00')
  )
  const [agendamentos, setAgendamentos] = useState<AgendamentoAdmin[]>(agendamentosIniciais)
  // Transição exclusiva para navegação de semana — controla o opacity da grade
  const [isNavPending, startNavTransition] = useTransition()

  const dias = getDiasSemana(segunda)
  const horarios = getHorarios()
  const agora = new Date()
  const hoje = formatarData(agora)
  const segundaAtual = formatarData(getSegundaFeira(new Date()))
  const ehSemanaAtual = formatarData(segunda) === segundaAtual
  const sexta = dias[4]

  const mapaAgendamentos = new Map<string, AgendamentoAdmin>()
  for (const ag of agendamentos) {
    mapaAgendamentos.set(chaveAgendamento(ag.data_hora), ag)
  }

  function navegar(delta: number) {
    const novaSegunda = new Date(segunda)
    novaSegunda.setDate(segunda.getDate() + delta * 7)

    if (formatarData(novaSegunda) < segundaAtual) return

    setSegunda(novaSegunda)
    const novaSexta = getDiasSemana(novaSegunda)[4]

    startNavTransition(async () => {
      const dados = await buscarAgendamentosAdmin(
        formatarData(novaSegunda),
        formatarData(novaSexta)
      )
      setAgendamentos(dados)
    })
  }

  async function bloquear(dia: Date, hora: number) {
    const dataHoraStr = `${formatarData(dia)}T${String(hora).padStart(2, '0')}:00:00`
    const tempId = `temp-${dataHoraStr}`

    // Atualização otimista: apenas esta célula muda imediatamente
    setAgendamentos(prev => [
      ...prev,
      { id: tempId, data_hora: dataHoraStr, nome_aluno: '(Bloqueado)', telefone: '' },
    ])

    const result = await bloquearSlot(formatarData(dia), hora)

    if (result.erro) {
      // Rollback: remove o registro temporário
      setAgendamentos(prev => prev.filter(a => a.id !== tempId))
    } else {
      // Substitui o ID temporário pelo ID real do banco
      const sxt = getDiasSemana(segunda)[4]
      const dados = await buscarAgendamentosAdmin(formatarData(segunda), formatarData(sxt))
      setAgendamentos(dados)
    }
  }

  async function desbloquear(id: string) {
    // Atualização otimista: apenas esta célula volta a livre imediatamente
    setAgendamentos(prev => prev.filter(a => a.id !== id))
    await desbloquearSlot(id)
  }

  const rangeLabel = formatarRangeSemana(segunda, sexta)
  const offsetSemanas = Math.round(
    (segunda.getTime() - new Date(segundaAtual + 'T00:00:00').getTime()) /
      (7 * 24 * 60 * 60 * 1000)
  )
  const labelSemana =
    offsetSemanas === 0 ? 'Esta semana' : offsetSemanas === 1 ? 'Próxima semana' : `Semana de ${rangeLabel}`

  return (
    <div className="w-full">
      {/* Navegação */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navegar(-1)}
          disabled={ehSemanaAtual || isNavPending}
          aria-label="Semana anterior"
        >
          <ChevronLeft />
        </Button>

        <div className="text-center">
          <p className="font-semibold text-sm">{labelSemana}</p>
          <p className="text-xs text-muted-foreground">{rangeLabel}</p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => navegar(1)}
          disabled={isNavPending}
          aria-label="Próxima semana"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Grade — opacidade reduzida apenas durante troca de semana */}
      <div
        className={`overflow-x-auto rounded-lg border border-border transition-opacity duration-200 ${
          isNavPending ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <div className="grid grid-cols-[3.5rem_repeat(5,minmax(7rem,1fr))] min-w-[440px]">
          {/* Cabeçalho */}
          <div className="border-b border-r border-border bg-muted/40 p-2" />
          {dias.map((dia, i) => {
            const { diaSemana, dataStr } = formatarDataCurta(dia)
            const ehHoje = formatarData(dia) === hoje
            return (
              <div
                key={i}
                className={`border-b border-r last:border-r-0 border-border px-1 py-2 text-center ${
                  ehHoje ? 'bg-primary/10' : 'bg-muted/40'
                }`}
              >
                <p
                  className={`text-[0.6rem] font-semibold uppercase tracking-widest ${
                    ehHoje ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {diaSemana}
                </p>
                <p className={`text-sm font-bold leading-tight ${ehHoje ? 'text-primary' : ''}`}>
                  {dataStr}
                </p>
              </div>
            )
          })}

          {/* Linhas de slots */}
          {horarios.map((hora) => (
            <Fragment key={hora}>
              <div className="border-b border-r border-border bg-muted/40 flex items-center justify-center">
                <span className="text-[0.6rem] font-medium text-muted-foreground">
                  {formatarHora(hora)}
                </span>
              </div>

              {dias.map((dia, i) => {
                const chave = `${formatarData(dia)} ${String(hora).padStart(2, '0')}`
                const agendamento = mapaAgendamentos.get(chave)
                const slotInicio = new Date(dia)
                slotInicio.setHours(hora, 0, 0, 0)
                const passado = slotInicio < agora
                const ehHoje = formatarData(dia) === hoje

                return (
                  <div
                    key={`${hora}-${i}`}
                    className={`border-b border-r last:border-r-0 border-border p-1 h-11 ${
                      ehHoje ? 'bg-primary/5' : ''
                    }`}
                  >
                    {agendamento ? (
                      agendamento.telefone === '' ? (
                        <button
                          onClick={() => desbloquear(agendamento.id)}
                          title="Clique para desbloquear"
                          className="flex w-full h-full items-center justify-center rounded text-[0.65rem] font-semibold bg-zinc-100 text-zinc-400 hover:bg-amber-50 hover:text-amber-600 border border-zinc-200 hover:border-amber-200 transition-colors"
                        >
                          <Lock className="size-3 shrink-0" />
                        </button>
                      ) : (
                        <Link
                          href={`/admin/agendamento/${agendamento.id}`}
                          className="flex w-full h-full items-center justify-center rounded text-[0.65rem] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 hover:border-blue-300 transition-colors px-1 overflow-hidden"
                          title={`${agendamento.nome_aluno} — ${agendamento.telefone}`}
                        >
                          <span className="truncate">{agendamento.nome_aluno.split(' ')[0]}</span>
                        </Link>
                      )
                    ) : !passado ? (
                      <div className="flex h-full gap-px">
                        <Link
                          href={`/admin/novo?data=${formatarData(dia)}&hora=${hora}`}
                          className="flex flex-1 items-center justify-center rounded-l text-[0.65rem] font-semibold text-muted-foreground/50 hover:bg-muted hover:text-muted-foreground border border-transparent hover:border-border transition-colors"
                        >
                          +
                        </Link>
                        <button
                          onClick={() => bloquear(dia, hora)}
                          title="Bloquear horário"
                          className="flex w-6 items-center justify-center rounded-r text-muted-foreground/25 hover:bg-zinc-100 hover:text-zinc-500 border border-transparent hover:border-zinc-200 transition-colors"
                        >
                          <Lock className="size-2.5" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-blue-100 border border-blue-300" />
          Agendado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-zinc-100 border border-zinc-300" />
          Bloqueado (clique para desbloquear)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-background border border-border" />
          Livre (+&thinsp;agendar · 🔒&thinsp;bloquear)
        </span>
      </div>
    </div>
  )
}
