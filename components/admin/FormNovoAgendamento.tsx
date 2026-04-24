'use client'

import { useActionState } from 'react'
import { criarAgendamentoAdmin } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

interface Props {
  data: string
  hora: number
  labelDia: string
  labelHora: string
}

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const estadoInicial = { erro: '' }

export default function FormNovoAgendamento({ data, hora, labelDia, labelHora }: Props) {
  const [estado, formAction, isPending] = useActionState(criarAgendamentoAdmin, estadoInicial)

  return (
    <form action={formAction} className="space-y-6">
      {/* Campos ocultos */}
      <input type="hidden" name="data" value={data} />
      <input type="hidden" name="hora" value={hora} />

      {/* Info do slot */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-0.5">Horário</p>
        <p className="font-semibold">{labelDia}</p>
        <p className="text-sm text-muted-foreground">{labelHora}</p>
      </div>

      {/* Campos */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="nome_aluno" className="text-sm font-medium">Nome completo</label>
          <input
            id="nome_aluno"
            name="nome_aluno"
            type="text"
            required
            disabled={isPending}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="telefone" className="text-sm font-medium">
            WhatsApp <span className="text-muted-foreground font-normal">(com DDD)</span>
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="numeric"
            required
            disabled={isPending}
            onChange={(e) => { e.target.value = formatarTelefone(e.target.value) }}
            placeholder="(11) 91234-5678"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
          />
        </div>
      </div>

      {estado.erro && (
        <p className="text-sm text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          {estado.erro}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full" size="lg">
        {isPending ? 'Salvando…' : 'Confirmar agendamento'}
      </Button>
    </form>
  )
}
