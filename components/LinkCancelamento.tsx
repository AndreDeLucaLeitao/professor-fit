'use client'

import { useState, useEffect } from 'react'

interface Props {
  token: string
}

export default function LinkCancelamento({ token }: Props) {
  const [urlCompleta, setUrlCompleta] = useState(`/cancelar/${token}`)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    setUrlCompleta(`${window.location.origin}/cancelar/${token}`)
  }, [token])

  async function copiar() {
    await navigator.clipboard.writeText(urlCompleta)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-mono break-all text-amber-900 bg-amber-100/60 rounded px-2 py-1.5">
        {urlCompleta}
      </p>
      <button
        onClick={copiar}
        className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
      >
        {copiado ? '✓ Copiado!' : 'Copiar link'}
      </button>
    </div>
  )
}
