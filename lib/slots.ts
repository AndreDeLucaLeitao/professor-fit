export const HORA_INICIO = 7
export const HORA_FIM = 19 // último slot: 19h–20h

// Retorna a segunda-feira da semana que contém a data
export function getSegundaFeira(data: Date): Date {
  const d = new Date(data)
  d.setHours(0, 0, 0, 0)
  const dia = d.getDay()
  const diff = dia === 0 ? -6 : 1 - dia
  d.setDate(d.getDate() + diff)
  return d
}

// Retorna as 5 datas (seg–sex) da semana
export function getDiasSemana(segunda: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(segunda)
    d.setDate(d.getDate() + i)
    return d
  })
}

// Retorna os horários de início de cada slot (7h a 19h = 13 slots)
export function getHorarios(): number[] {
  return Array.from(
    { length: HORA_FIM - HORA_INICIO + 1 },
    (_, i) => HORA_INICIO + i
  )
}

// Formata data usando getters locais para evitar problema de timezone: "YYYY-MM-DD"
export function formatarData(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

// Chave única para um slot: "YYYY-MM-DD HH"
export function chaveSlot(data: Date, hora: number): string {
  return `${formatarData(data)} ${String(hora).padStart(2, '0')}`
}

// Formata hora para exibição: "07:00"
export function formatarHora(hora: number): string {
  return `${String(hora).padStart(2, '0')}:00`
}

// Retorna info de exibição de uma data
export function formatarDataCurta(data: Date): { diaSemana: string; dataStr: string } {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return {
    diaSemana: diasSemana[data.getDay()],
    dataStr: `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`,
  }
}

// Formata o range da semana para exibição: "20 a 24/04" ou "28/04 a 02/05"
export function formatarRangeSemana(segunda: Date, sexta: Date): string {
  const mesInicio = String(segunda.getMonth() + 1).padStart(2, '0')
  const mesFim = String(sexta.getMonth() + 1).padStart(2, '0')
  if (mesInicio === mesFim) {
    return `${segunda.getDate()} a ${sexta.getDate()}/${mesFim}`
  }
  return `${segunda.getDate()}/${mesInicio} a ${sexta.getDate()}/${mesFim}`
}
