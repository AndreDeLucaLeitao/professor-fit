# Tarefas do Projeto — Professor Fit

> Legenda: `[ ]` pendente · `[x]` concluído · `[~]` em andamento

---

## Fase 1 — Setup inicial
- [x] Criar projeto Next.js 15 com TypeScript (instalado v16.2.4 — latest)
- [x] Configurar Tailwind CSS (v4)
- [x] Instalar e configurar shadcn/ui (Radix + Nova preset)
- [ ] Criar repositório no GitHub
- [ ] Configurar projeto no Supabase
- [ ] Criar tabela `agendamentos` no Supabase
- [ ] Configurar variáveis de ambiente (`.env.local`) — template em `.env.local.example`
- [ ] Deploy inicial na Vercel (projeto vazio)

## Fase 2 — Agendamento público (aluno)
- [ ] Página inicial com apresentação do professor
- [ ] Componente de calendário semanal (seg–sex)
- [ ] Lógica de geração dos slots (7h–20h, 1h cada)
- [ ] Buscar slots ocupados do Supabase e bloquear na UI
- [ ] Formulário de agendamento (nome + telefone)
- [ ] Validação dos campos do formulário
- [ ] Gerar `cancel_token` único ao agendar
- [ ] Salvar agendamento no Supabase
- [ ] Página de confirmação com link de cancelamento
- [ ] Página de cancelamento (`/cancelar/[token]`)
- [ ] Lógica de cancelamento (marcar como cancelado + liberar slot)

## Fase 3 — Painel Admin
- [ ] Configurar NextAuth.js v5
- [ ] Criar credenciais do admin no Supabase ou `.env`
- [ ] Página de login do admin (`/admin/login`)
- [ ] Proteger todas as rotas `/admin/*`
- [ ] Página principal do admin: agenda semanal
- [ ] Visualizar agendamentos com nome e WhatsApp do aluno
- [ ] Criar agendamento manualmente pelo admin
- [ ] Editar agendamento existente
- [ ] Excluir/cancelar agendamento

## Fase 4 — Qualidade e finalização
- [ ] Responsividade mobile em todas as páginas
- [ ] Tratamento de erros (slot já ocupado, token inválido, etc.)
- [ ] Loading states nas ações assíncronas
- [ ] Revisão visual geral
- [ ] Testes manuais do fluxo completo
- [ ] Configurar domínio personalizado na Vercel (se houver)

## Fase 5 — Futuro (não implementar agora)
- [ ] Integração com Google Calendar
- [ ] Notificações automáticas via WhatsApp
- [ ] Lembretes de aula por e-mail ou SMS
