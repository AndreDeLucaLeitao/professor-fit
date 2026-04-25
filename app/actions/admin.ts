'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'

export type AgendamentoAdmin = {
  id: string
  data_hora: string
  nome_aluno: string
  telefone: string
}

// Retorna todos os agendamentos ativos da semana para o painel admin
export async function buscarAgendamentosAdmin(
  segunda: string,
  sexta: string
): Promise<AgendamentoAdmin[]> {
  await requireAdmin()

  const supabase = createServerClient()

  const { data } = await supabase
    .from('agendamentos')
    .select('id, data_hora, nome_aluno, telefone')
    .gte('data_hora', `${segunda}T07:00:00`)
    .lte('data_hora', `${sexta}T19:00:00`)
    .eq('cancelado', false)
    .order('data_hora')

  return data ?? []
}

export async function criarAgendamentoAdmin(
  _estado: { erro: string },
  formData: FormData
): Promise<{ erro: string }> {
  await requireAdmin()

  const data = formData.get('data') as string
  const hora = parseInt(formData.get('hora') as string, 10)
  const nome_aluno = (formData.get('nome_aluno') as string).trim()
  const telefone = (formData.get('telefone') as string).trim()

  if (!nome_aluno || nome_aluno.length < 3) return { erro: 'Nome inválido.' }
  if (!telefone || telefone.replace(/\D/g, '').length < 10) return { erro: 'Telefone inválido.' }

  const supabase = createServerClient()
  const dataHora = `${data}T${String(hora).padStart(2, '0')}:00:00`

  const { data: existente } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('data_hora', dataHora)
    .eq('cancelado', false)
    .maybeSingle()

  if (existente) return { erro: 'Horário já ocupado.' }

  const { error } = await supabase.from('agendamentos').insert({
    data_hora: dataHora,
    nome_aluno,
    telefone,
    cancel_token: crypto.randomUUID(),
    cancelado: false,
  })

  if (error) return { erro: 'Erro ao criar agendamento.' }

  redirect('/admin')
}

export async function editarAgendamento(
  _estado: { erro: string },
  formData: FormData
): Promise<{ erro: string }> {
  await requireAdmin()

  const id = formData.get('id') as string
  const nome_aluno = (formData.get('nome_aluno') as string).trim()
  const telefone = (formData.get('telefone') as string).trim()

  if (!nome_aluno || nome_aluno.length < 3) return { erro: 'Nome inválido.' }
  if (!telefone || telefone.replace(/\D/g, '').length < 10) return { erro: 'Telefone inválido.' }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('agendamentos')
    .update({ nome_aluno, telefone })
    .eq('id', id)

  if (error) return { erro: 'Erro ao atualizar agendamento.' }

  redirect('/admin')
}

export async function excluirAgendamento(id: string): Promise<void> {
  await requireAdmin()

  const supabase = createServerClient()
  await supabase
    .from('agendamentos')
    .update({ cancelado: true })
    .eq('id', id)

  redirect('/admin')
}

export async function bloquearSlot(
  data: string,
  hora: number
): Promise<{ erro?: string }> {
  await requireAdmin()

  const supabase = createServerClient()
  const dataHora = `${data}T${String(hora).padStart(2, '0')}:00:00`

  const { data: existente } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('data_hora', dataHora)
    .eq('cancelado', false)
    .maybeSingle()

  if (existente) return { erro: 'Horário já ocupado.' }

  const { error } = await supabase.from('agendamentos').insert({
    data_hora: dataHora,
    nome_aluno: '(Bloqueado)',
    telefone: '',
    cancel_token: crypto.randomUUID(),
    cancelado: false,
  })

  if (error) return { erro: 'Erro ao bloquear horário.' }
  return {}
}

export async function desbloquearSlot(id: string): Promise<void> {
  await requireAdmin()

  const supabase = createServerClient()
  // Segurança: só cancela registros com telefone vazio (bloqueios, não agendamentos reais)
  await supabase
    .from('agendamentos')
    .update({ cancelado: true })
    .eq('id', id)
    .eq('telefone', '')
}
