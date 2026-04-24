'use client'

import { useActionState } from 'react'
import { editarAgendamento } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

interface Props {
  id: string
  nomeAtual: string
  telefoneAtual: string
}

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

const estadoInicial = { erro: '' }

export default function FormEditarAgendamento({ id, nomeAtual, telefoneAtual }: Props) {
  const [estado, formAction, isPending] = useActionState(editarAgendamento, estadoInicial)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={id} />

      <div className="space-y-1.5">
        <label htmlFor="nome_aluno" className="text-sm font-medium">Nome completo</label>
        <input
          id="nome_aluno"
          name="nome_aluno"
          type="text"
          defaultValue={nomeAtual}
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
          defaultValue={telefoneAtual}
          required
          disabled={isPending}
          onChange={(e) => { e.target.value = formatarTelefone(e.target.value) }}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
        />
      </div>

      {estado.erro && (
        <p className="text-sm text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          {estado.erro}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1" size="lg">
          {isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  )
}
