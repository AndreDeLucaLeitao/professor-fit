import FormLogin from '@/components/admin/FormLogin'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acesso exclusivo para o professor
          </p>
        </div>
        <FormLogin />
      </div>
    </main>
  )
}
