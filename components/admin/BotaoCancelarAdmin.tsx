'use client'

import { useState, useTransition } from 'react'
import { excluirAgendamento } from '@/app/actions/admin'

interface Props {
  id: string
}

export default function BotaoCancelarAdmin({ id }: Props) {
  const [confirmando, setConfirmando] = useState(false)
  const [isPending, startTransition] = useTransition()

  function cancelar() {
    startTransition(async () => {
      await excluirAgendamento(id)
    })
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="text-sm font-medium text-destructive hover:text-destructive/80 underline underline-offset-4 transition-colors"
      >
        Cancelar este agendamento
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Tem certeza? Esta ação não pode ser desfeita.</p>
      <div className="flex gap-3">
        <button
          onClick={cancelar}
          disabled={isPending}
          className="text-sm font-semibold text-destructive hover:text-destructive/80 underline underline-offset-4 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Cancelando…' : 'Sim, cancelar'}
        </button>
        <button
          onClick={() => setConfirmando(false)}
          disabled={isPending}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Não, manter
        </button>
      </div>
    </div>
  )
}
