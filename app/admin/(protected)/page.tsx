import { Suspense } from 'react'
import Link from 'next/link'
import { buscarAgendamentosAdmin } from '@/app/actions/admin'
import CalendarioAdmin from '@/components/admin/CalendarioAdmin'
import { getSegundaFeira, getDiasSemana, formatarData } from '@/lib/slots'
import { Button } from '@/components/ui/button'

async function CalendarioAdminComDados() {
  const segunda = getSegundaFeira(new Date())
  const sexta = getDiasSemana(segunda)[4]
  const agendamentos = await buscarAgendamentosAdmin(
    formatarData(segunda),
    formatarData(sexta)
  )

  return (
    <CalendarioAdmin
      agendamentosIniciais={agendamentos}
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

export default function AdminPage() {
  return (
    <main className="px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Agenda da semana</h1>
          <Link href="/admin/novo">
            <Button size="sm">+ Novo agendamento</Button>
          </Link>
        </div>

        <Suspense fallback={<CalendarioSkeleton />}>
          <CalendarioAdminComDados />
        </Suspense>
      </div>
    </main>
  )
}
