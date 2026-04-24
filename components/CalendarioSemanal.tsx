'use client'

import { Fragment, useState, useTransition } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getDiasSemana,
  getHorarios,
  getSegundaFeira,
  formatarData,
  formatarDataCurta,
  formatarHora,
  formatarRangeSemana,
  chaveSlot,
} from '@/lib/slots'
import { buscarSlotsOcupados } from '@/app/actions/agendamentos'

interface Props {
  slotsOcupadosIniciais: string[]
  segundaInicial: string // YYYY-MM-DD
}

export default function CalendarioSemanal({
  slotsOcupadosIniciais,
  segundaInicial,
}: Props) {
  const [segunda, setSegunda] = useState<Date>(
    () => new Date(segundaInicial + 'T00:00:00')
  )
  const [slotsOcupados, setSlotsOcupados] = useState<Set<string>>(
    () => new Set(slotsOcupadosIniciais)
  )
  const [isPending, startTransition] = useTransition()

  const dias = getDiasSemana(segunda)
  const horarios = getHorarios()
  const agora = new Date()
  const hoje = formatarData(agora)
  const segundaAtual = formatarData(getSegundaFeira(new Date()))
  const ehSemanaAtual = formatarData(segunda) === segundaAtual
  const sexta = dias[4]

  function navegar(delta: number) {
    const novaSegunda = new Date(segunda)
    novaSegunda.setDate(segunda.getDate() + delta * 7)

    if (formatarData(novaSegunda) < segundaAtual) return

    setSegunda(novaSegunda)

    const novaSexta = getDiasSemana(novaSegunda)[4]
    startTransition(async () => {
      const slots = await buscarSlotsOcupados(
        formatarData(novaSegunda),
        formatarData(novaSexta)
      )
      setSlotsOcupados(new Set(slots))
    })
  }

  const rangeLabel = formatarRangeSemana(segunda, sexta)
  const offsetSemanas = Math.round(
    (segunda.getTime() - new Date(segundaAtual + 'T00:00:00').getTime()) /
    (7 * 24 * 60 * 60 * 1000)
  )
  const labelSemana =
    offsetSemanas === 0
      ? 'Esta semana'
      : offsetSemanas === 1
      ? 'Próxima semana'
      : `Semana de ${rangeLabel}`

  return (
    <div className="w-full">
      {/* Navegação */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navegar(-1)}
          disabled={ehSemanaAtual || isPending}
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
          disabled={isPending}
          aria-label="Próxima semana"
        >
          <ChevronRight />
        </Button>
      </div>

      {/* Grade */}
      <div
        className={`overflow-x-auto rounded-lg border border-border transition-opacity duration-200 ${
          isPending ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <div className="grid grid-cols-[3.5rem_repeat(5,minmax(5.5rem,1fr))] min-w-[380px]">
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
                <p
                  className={`text-sm font-bold leading-tight ${
                    ehHoje ? 'text-primary' : ''
                  }`}
                >
                  {dataStr}
                </p>
              </div>
            )
          })}

          {/* Linhas de slots */}
          {horarios.map((hora) => (
            <Fragment key={hora}>
              {/* Label da hora */}
              <div className="border-b border-r border-border bg-muted/40 flex items-center justify-center">
                <span className="text-[0.6rem] font-medium text-muted-foreground">
                  {formatarHora(hora)}
                </span>
              </div>

              {/* Células dos dias */}
              {dias.map((dia, i) => {
                const chave = chaveSlot(dia, hora)
                const ocupado = slotsOcupados.has(chave)
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
                    {!passado && (
                      ocupado ? (
                        <button
                          disabled
                          className="w-full h-full rounded text-[0.65rem] font-semibold bg-muted text-muted-foreground cursor-not-allowed"
                        >
                          Ocupado
                        </button>
                      ) : (
                        <Link
                          href={`/agendar?data=${formatarData(dia)}&hora=${hora}`}
                          className="flex w-full h-full items-center justify-center rounded text-[0.65rem] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70 hover:border-emerald-300 transition-colors"
                        >
                          Livre
                        </Link>
                      )
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-emerald-100 border border-emerald-300" />
          Disponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded bg-muted border border-border" />
          Ocupado
        </span>
      </div>
    </div>
  )
}
