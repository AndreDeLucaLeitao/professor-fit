'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { criarAgendamento } from '@/app/actions/agendamentos'
import { Button } from '@/components/ui/button'

interface Props {
  data: string  // YYYY-MM-DD
  hora: number
  labelDia: string   // ex: "Sex, 24/04"
  labelHora: string  // ex: "15:00 – 16:00"
}

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function FormularioAgendamento({ data, hora, labelDia, labelHora }: Props) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleTelefone(e: React.ChangeEvent<HTMLInputElement>) {
    setTelefone(formatarTelefone(e.target.value))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    const nomeTrimmed = nome.trim()
    const digitos = telefone.replace(/\D/g, '')

    if (nomeTrimmed.length < 3) {
      setErro('Informe seu nome completo.')
      return
    }
    if (digitos.length < 10 || digitos.length > 11) {
      setErro('Informe um número de WhatsApp válido com DDD (ex: (11) 91234-5678).')
      return
    }

    startTransition(async () => {
      const resultado = await criarAgendamento(data, hora, nomeTrimmed, telefone)
      if (resultado.sucesso) {
        router.push(`/confirmacao/${resultado.token}`)
      } else {
        setErro(resultado.erro)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info do slot */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">
          Horário selecionado
        </p>
        <p className="font-semibold text-foreground">{labelDia}</p>
        <p className="text-muted-foreground text-sm">{labelHora}</p>
      </div>

      {/* Campos */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="nome" className="text-sm font-medium">
            Nome completo
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            disabled={isPending}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="telefone" className="text-sm font-medium">
            WhatsApp <span className="text-muted-foreground font-normal">(com DDD)</span>
          </label>
          <input
            id="telefone"
            type="tel"
            value={telefone}
            onChange={handleTelefone}
            placeholder="(11) 91234-5678"
            autoComplete="tel"
            inputMode="numeric"
            disabled={isPending}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring disabled:opacity-50"
          />
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <p className="text-sm text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
          {erro}
        </p>
      )}

      {/* Ações */}
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:flex-1"
          size="lg"
        >
          {isPending ? 'Confirmando…' : 'Confirmar agendamento'}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => router.back()}
          className="w-full sm:w-auto"
          size="lg"
        >
          Voltar
        </Button>
      </div>
    </form>
  )
}
