import { Suspense } from 'react'
import CalendarioSemanal from '@/components/CalendarioSemanal'
import { buscarSlotsOcupados } from '@/app/actions/agendamentos'
import { getSegundaFeira, getDiasSemana, formatarData } from '@/lib/slots'

async function CalendarioComDados() {
  const segunda = getSegundaFeira(new Date())
  const sexta = getDiasSemana(segunda)[4]
  const slotsOcupados = await buscarSlotsOcupados(
    formatarData(segunda),
    formatarData(sexta)
  )

  return (
    <CalendarioSemanal
      slotsOcupadosIniciais={slotsOcupados}
      segundaInicial={formatarData(segunda)}
    />
  )
}

function CalendarioSkeleton() {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="size-8 rounded-lg bg-muted animate-pulse" />
        <div className="h-8 w-36 rounded bg-muted animate-pulse" />
        <div className="size-8 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="h-[480px] rounded-lg border border-border bg-muted/20 animate-pulse" />
    </div>
  )
}

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-background py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-medium text-emerald-700 mb-3 uppercase tracking-widest">
            Educação Física Personalizada
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
            Agende sua aula particular
          </h1>
          <p className="text-lg text-muted-foreground mb-1">
            Escolha o horário que preferir diretamente pela agenda.
          </p>
          <p className="text-sm text-muted-foreground">
            Segunda a sexta · 7h às 20h · Aulas de 1 hora
          </p>
        </div>
      </section>

      {/* Calendário */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Horários disponíveis</h2>
          <Suspense fallback={<CalendarioSkeleton />}>
            <CalendarioComDados />
          </Suspense>
        </div>
      </section>
    </main>
  )
}
