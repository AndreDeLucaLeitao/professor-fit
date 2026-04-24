'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { criarTokenSessao } from '@/lib/auth'

export async function login(
  _estado: { erro: string },
  formData: FormData
): Promise<{ erro: string }> {
  const email = formData.get('email') as string
  const senha = formData.get('senha') as string

  if (
    email !== process.env.ADMIN_EMAIL ||
    senha !== process.env.ADMIN_PASSWORD
  ) {
    return { erro: 'E-mail ou senha incorretos.' }
  }

  const token = criarTokenSessao()
  const cookieStore = await cookies()

  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  redirect('/admin')
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
