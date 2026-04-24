'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [montado, setMontado] = useState(false)

  // Evita flash de conteúdo errado no SSR
  useEffect(() => setMontado(true), [])

  if (!montado) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      className="fixed bottom-4 right-4 z-50 flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted transition-colors"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
