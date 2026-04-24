# Regras de Desenvolvimento

## Antes de começar qualquer tarefa
1. Leia o CONTEXT.md para entender o projeto completo
2. Nunca tome decisões arquiteturais sem consultar o CONTEXT.md
3. Se algo não estiver documentado, pergunte antes de assumir

## Código
- Sempre usar TypeScript estrito (sem `any`)
- Componentes pequenos e com responsabilidade única
- Separar lógica de negócio dos componentes de UI
- Usar Server Components por padrão, Client Components só quando necessário (`useState`, `useEffect`, eventos)

## Banco de dados
- Todas as queries passam pelo Supabase client
- Nunca expor dados sensíveis no client-side
- Validar dados no servidor antes de gravar

## Segurança
- O painel admin deve ser protegido por autenticação em todas as rotas
- O token de cancelamento deve ser gerado com `crypto.randomUUID()` ou similar
- Nunca retornar o `cancel_token` em listagens públicas

## Estilo
- Usar Tailwind CSS para estilização
- Componentes de UI via shadcn/ui sempre que possível
- Design responsivo (mobile first)
- Cores e identidade visual: definir depois com o cliente

## Commits (se usar git)
- Mensagens em português
- Formato: `tipo: descrição curta`
- Tipos: `feat`, `fix`, `docs`, `style`, `refactor`
