import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SECRET = process.env.ADMIN_SESSION_SECRET!

// Cria um token assinado com HMAC-SHA256
export function criarTokenSessao(): string {
  const payload = `admin:${Date.now()}`
  const hmac = createHmac('sha256', SECRET)
  hmac.update(payload)
  return `${Buffer.from(payload).toString('base64')}.${hmac.digest('hex')}`
}

// Verifica a assinatura do token (uso constante de tempo para evitar timing attacks)
export function verificarTokenSessao(token: string): boolean {
  try {
    const [payloadB64, assinatura] = token.split('.')
    if (!payloadB64 || !assinatura) return false

    const payload = Buffer.from(payloadB64, 'base64').toString('utf8')
    const hmac = createHmac('sha256', SECRET)
    hmac.update(payload)
    const esperado = hmac.digest('hex')

    return timingSafeEqual(Buffer.from(assinatura, 'hex'), Buffer.from(esperado, 'hex'))
  } catch {
    return false
  }
}

// Verifica sessão admin e redireciona para login se inválida
export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value

  if (!token || !verificarTokenSessao(token)) {
    redirect('/admin/login')
  }
}
