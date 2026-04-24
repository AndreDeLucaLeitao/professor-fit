'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { HORA_INICIO, HORA_FIM, formatarHora } from '@/lib/slots'

function hoje(): string {
  const d = new Date()
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export default function SeletorSlot() {
  const [data, setData] = useState(hoje())
  const [hora, setHora] = useState(String(HORA_INICIO))
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/admin/novo?data=${data}&hora=${hora}`)
  }

  const horarios = Array.from(
    { length: HORA_FIM - HORA_INICIO + 1 },
    (_, i) => HORA_INICIO + i
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="data" className="text-sm font-medium">Data</label>
        <input
          id="data"
          type="date"
          value={data}
          min={hoje()}
          onChange={(e) => setData(e.target.value)}
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="hora" className="text-sm font-medium">Horário</label>
        <select
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
        >
          {horarios.map((h) => (
            <option key={h} value={h}>
              {formatarHora(h)} – {formatarHora(h + 1)}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" size="lg">
        Continuar
      </Button>
    </form>
  )
}
