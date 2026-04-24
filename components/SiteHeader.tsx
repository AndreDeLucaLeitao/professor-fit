import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center">
        <Link href="/" className="font-bold text-3xl tracking-tight text-foreground">
          Cerboni
        </Link>
      </div>
    </header>
  )
}
