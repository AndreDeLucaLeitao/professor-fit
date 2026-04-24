# Contexto do Projeto — Professor Fit

## O que é esse projeto
Site de agendamento de aulas particulares de educação física para um professor autônomo. O objetivo é permitir que alunos marquem horários sem precisar entrar em contato direto com o professor, substituindo o fluxo atual via Instagram.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Banco de dados:** Supabase (PostgreSQL)
- **Autenticação admin:** NextAuth.js v5 (só o professor tem login)
- **Hospedagem:** Vercel

## Regras de negócio

### Grade de horários
- Disponível de segunda a sexta
- Horário: 7h às 20h
- Duração de cada aula: 1 hora
- Slots gerados automaticamente (7h, 8h, 9h... até 19h)
- Slots ocupados não aparecem como disponíveis

### Agendamento (aluno)
- Não requer cadastro nem login
- Campos obrigatórios: nome completo e telefone (WhatsApp)
- Ao confirmar, o slot é bloqueado imediatamente
- Um link único de cancelamento é gerado e exibido na tela de confirmação
- Formato do link: `/cancelar/[token-unico]`

### Cancelamento (aluno)
- Feito exclusivamente via link único gerado no agendamento
- Ao cancelar, o slot volta a ficar disponível
- Não há autenticação — o token único é a "chave" de acesso

### Painel Admin
- Acesso via login com e-mail e senha (só o professor)
- Funcionalidades:
  - Visualizar agenda semanal completa
  - Ver nome e WhatsApp de cada aluno agendado
  - Criar agendamentos manualmente
  - Editar agendamentos existentes
  - Excluir/cancelar agendamentos

## Estrutura do banco (Supabase)

### Tabela: `agendamentos`
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| data_hora | timestamp | Data e hora da aula |
| nome_aluno | text | Nome completo do aluno |
| telefone | text | WhatsApp do aluno |
| cancel_token | text | Token único para cancelamento |
| cancelado | boolean | Se foi cancelado (default: false) |
| created_at | timestamp | Data de criação |

## Fora do escopo (por enquanto)
- Sistema de pagamento
- Login para alunos
- Integração com Google Calendar (planejado para o futuro)
- Notificações automáticas por WhatsApp/e-mail

## Futuro (não implementar agora)
- Integração com Google Calendar do professor
- Notificações automáticas de lembrete

## Convenções de código
- Componentes em PascalCase
- Arquivos de página: `page.tsx`
- Arquivos de componente: `NomeComponente.tsx`
- Variáveis e funções em camelCase
- Comentários em português
