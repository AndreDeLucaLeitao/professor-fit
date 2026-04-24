import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function hexParaBytes(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes.buffer as ArrayBuffer
}

async function verificarSessao(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !token) return false

  try {
    const [payloadB64, assinaturaHex] = token.split('.')
    if (!payloadB64 || !assinaturaHex) return false

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const payload = atob(payloadB64)
    return await crypto.subtle.verify(
      'HMAC',
      key,
      hexParaBytes(assinaturaHex),
      encoder.encode(payload)
    )
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value ?? ''
  const valido = await verificarSessao(token)

  if (!valido) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Protege /admin/* exceto /admin/login
  matcher: ['/admin/((?!login$|login/).*)'],
}
