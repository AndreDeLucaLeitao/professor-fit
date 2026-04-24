'use server'

import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'

// Retorna lista de chaves de slots ocupados no formato "YYYY-MM-DD HH"
export async function buscarSlotsOcupados(
  segunda: string, // YYYY-MM-DD
  sexta: string    // YYYY-MM-DD
): Promise<string[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('agendamentos')
    .select('data_hora')
    .gte('data_hora', `${segunda}T07:00:00`)
    .lte('data_hora', `${sexta}T19:00:00`)
    .eq('cancelado', false)

  if (error || !data) return []

  // Extrai "YYYY-MM-DD HH" da string "YYYY-MM-DDTHH:MM:SS" sem conversão de timezone
  return data.map((row) => {
    const str = row.data_hora as string
    return `${str.substring(0, 10)} ${str.substring(11, 13)}`
  })
}

export type ResultadoAgendamento =
  | { sucesso: true; token: string }
  | { sucesso: false; erro: string }

// Salva novo agendamento e retorna o cancel_token
export async function criarAgendamento(
  data: string,  // YYYY-MM-DD
  hora: number,
  nome_aluno: string,
  telefone: string
): Promise<ResultadoAgendamento> {
  const supabase = createServerClient()

  const dataHora = `${data}T${String(hora).padStart(2, '0')}:00:00`

  // Verifica se o slot ainda está disponível
  const { data: existente } = await supabase
    .from('agendamentos')
    .select('id')
    .eq('data_hora', dataHora)
    .eq('cancelado', false)
    .maybeSingle()

  if (existente) {
    return {
      sucesso: false,
      erro: 'Este horário acabou de ser reservado. Por favor, escolha outro.',
    }
  }

  const cancel_token = crypto.randomUUID()

  const { error } = await supabase.from('agendamentos').insert({
    data_hora: dataHora,
    nome_aluno: nome_aluno.trim(),
    telefone: telefone.trim(),
    cancel_token,
    cancelado: false,
  })

  if (error) {
    return { sucesso: false, erro: 'Erro ao salvar o agendamento. Tente novamente.' }
  }

  return { sucesso: true, token: cancel_token }
}

export type DadosAgendamento = {
  data_hora: string
  nome_aluno: string
  cancelado: boolean
} | null

// Busca um agendamento pelo token (sem expor telefone)
export async function buscarAgendamentoPorToken(
  token: string
): Promise<DadosAgendamento> {
  const supabase = createServerClient()

  const { data } = await supabase
    .from('agendamentos')
    .select('data_hora, nome_aluno, cancelado')
    .eq('cancel_token', token)
    .maybeSingle()

  return data ?? null
}

// Marca agendamento como cancelado
export async function cancelarAgendamento(token: string): Promise<void> {
  const supabase = createServerClient()

  await supabase
    .from('agendamentos')
    .update({ cancelado: true })
    .eq('cancel_token', token)
    .eq('cancelado', false)

  redirect(`/cancelar/${token}`)
}
