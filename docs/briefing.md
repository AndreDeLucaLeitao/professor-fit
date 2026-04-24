# Briefing do Cliente

## Contexto
Professor autônomo de educação física que oferece aulas particulares. Hoje os agendamentos são feitos manualmente via mensagem no Instagram, o que gera espera para o aluno e trabalho manual para o professor.

## Objetivo
Criar um site onde o aluno possa agendar uma aula sem precisar esperar resposta do professor. O professor usa o site como sua agenda digital.

## Fluxo atual (antes do site)
1. Aluno manda mensagem no Instagram
2. Professor responde e confirma o horário manualmente
3. Professor anota na agenda pessoal

## Fluxo desejado (com o site)
1. Aluno acessa o site
2. Vê os horários disponíveis
3. Escolhe o horário, informa nome e WhatsApp
4. Horário é bloqueado automaticamente
5. Aluno recebe link de cancelamento
6. Professor acessa o painel admin para ver a agenda

## Decisões tomadas
- Sem sistema de pagamento
- Sem login para alunos
- Cancelamento via link único (token) — mais seguro que validar por telefone
- Grade fixa: seg–sex, 7h–20h, slots de 1h
- Admin com login próprio (só o professor)
- Stack: Next.js + TypeScript + Tailwind + Supabase + Vercel

## Próximos passos futuros (fora do escopo atual)
- Integração com Google Calendar do professor
- Notificações automáticas por WhatsApp
