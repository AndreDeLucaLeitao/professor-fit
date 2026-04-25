# Tarefas do Projeto — Professor Fit

> Legenda: `[ ]` pendente · `[x]` concluído · `[~]` em andamento

---

## Fase 1 — Setup inicial
- [x] Criar projeto Next.js 15 com TypeScript (instalado v16.2.4 — latest)
- [x] Configurar Tailwind CSS (v4)
- [x] Instalar e configurar shadcn/ui (Radix + Nova preset)
- [x] Criar repositório no GitHub
- [x] Instalar `@supabase/supabase-js` e criar `lib/supabase.ts` (client) e `lib/supabase-server.ts` (server)
- [x] Configurar projeto no Supabase
- [x] Criar tabela `agendamentos` no Supabase
- [x] Configurar variáveis de ambiente (`.env.local`)
- [x] Deploy inicial na Vercel (projeto vazio)

## Fase 2 — Agendamento público (aluno)
- [x] Página inicial com apresentação do professor
- [x] Componente de calendário semanal (seg–sex)
- [x] Lógica de geração dos slots (7h–20h, 1h cada)
- [x] Buscar slots ocupados do Supabase e bloquear na UI
- [x] Formulário de agendamento (nome + telefone)
- [x] Validação dos campos do formulário
- [x] Gerar `cancel_token` único ao agendar
- [x] Salvar agendamento no Supabase
- [x] Página de confirmação com link de cancelamento
- [x] Página de cancelamento (`/cancelar/[token]`)
- [x] Lógica de cancelamento (marcar como cancelado + liberar slot)

## Fase 3 — Painel Admin
- [x] Auth customizada (sem NextAuth — single admin via env vars + HMAC session cookie)
- [x] Criar credenciais do admin no `.env`
- [x] Página de login do admin (`/admin/login`)
- [x] Proteger todas as rotas `/admin/*` (proxy.ts + layout server-side)
- [x] Página principal do admin: agenda semanal
- [x] Visualizar agendamentos com nome e WhatsApp do aluno
- [x] Criar agendamento manualmente pelo admin
- [x] Editar agendamento existente
- [x] Excluir/cancelar agendamento

## Fase 4 — Qualidade e finalização
- [x] Responsividade mobile em todas as páginas
- [x] Tratamento de erros (slot já ocupado, token inválido, etc.)
- [x] Loading states nas ações assíncronas
- [x] Revisão visual geral
- [ ] Testes manuais do fluxo completo
- [ ] Configurar domínio personalizado na Vercel (se houver)

## Feature extra — Bloqueio de horários
- [x] Admin pode bloquear slot livre pelo cadeado na grade
- [x] Admin pode desbloquear clicando no slot bloqueado
- [x] Slot bloqueado aparece como "Ocupado" para alunos
- [x] Atualizações otimistas (sem afetar outras células)

## Fase 5 — Futuro (não implementar agora)
- [ ] Integração com Google Calendar
- [ ] Notificações automáticas via WhatsApp
- [ ] Lembretes de aula por e-mail ou SMS
