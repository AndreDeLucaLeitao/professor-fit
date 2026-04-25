import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-5">
          <p className="text-6xl font-extrabold text-muted-foreground/30">404</p>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Página não encontrada</h1>
            <p className="text-muted-foreground text-sm mt-2">
              O link pode ter expirado ou o endereço está incorreto.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block text-sm font-semibold text-primary underline underline-offset-4"
          >
            Voltar para a agenda
          </Link>
        </div>
      </main>
    </>
  )
}
