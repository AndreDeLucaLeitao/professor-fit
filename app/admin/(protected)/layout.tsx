import { requireAdmin } from '@/lib/auth'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Segunda camada de verificação (a primeira é o proxy.ts)
  await requireAdmin()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-sm">Cerboni — Admin</span>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            Sair
          </Button>
        </form>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
