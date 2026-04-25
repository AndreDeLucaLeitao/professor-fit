import { Suspense } from 'react'
import CalendarioSemanal from '@/components/CalendarioSemanal'
import SiteHeader from '@/components/SiteHeader'
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
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-amber-50/60 to-background py-12 sm:py-20 px-4 text-center border-b border-border">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-red-900 uppercase tracking-widest mb-6">
              Educação Física Personalizada
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 text-foreground">
              Agende sua aula<br className="hidden sm:block" /> particular
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Escolha o horário que preferir diretamente pela agenda.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Segunda a sexta · 7h às 20h · Aulas de 1 hora
            </p>
          </div>
        </section>

        {/* Calendário */}
        <section className="py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Horários disponíveis</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Selecione um slot livre para confirmar sua aula
              </p>
            </div>
            <Suspense fallback={<CalendarioSkeleton />}>
              <CalendarioComDados />
            </Suspense>
          </div>
        </section>
      </main>
    </>
  )
}
