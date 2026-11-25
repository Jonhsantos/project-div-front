# AGENTS.md — DIV Front-end

## Contexto e stack

Interface web do DIV para gestão de despesas de viagens profissionais. Preserve React com JavaScript/JSX, Vite, Tailwind CSS 4, Oxlint, Inter e Material Symbols. Backend: https://github.com/Jonhsantos/project-div-back.

- `src/App.jsx`: composição e autenticação.
- `src/components/`: componentes compartilhados.
- `src/features/auth/`, `trips/` e `expenses/`: funcionalidades por domínio.
- `src/services/api.js`: cliente HTTP compartilhado.
- `src/assets/` e `public/`: recursos visuais.

## Fluxo obrigatório

1. Leia README, AGENTS e arquivos relevantes; inspecione o estado do Git e preserve alterações do usuário.
2. Consulte os frames pertinentes do `dev.pen` antes de alterar interfaces.
3. Trabalhe em etapas pequenas e coerentes, sem expandir o escopo por conta própria.
4. Reutilize componentes e serviços; preserve contratos com o backend.
5. Valide a implementação e informe alterações, testes, resultados e pendências reais.

## Design oficial — prioridade obrigatória

- `dev.pen` é a fonte de verdade visual. Use Pencil para inspecionar frames, componentes e propriedades.
- Preserve `div-logo-oficial.png` e sua referência no design; não redesenhe a marca.
- Reproduza cores, tipografia, ícones, espaçamentos, dimensões, estados e hierarquia visual. Não substitua o design por layouts genéricos.
- Use Tailwind CSS na estilização nova, preservando CSS existente quando necessário. Não faça migrações amplas sem justificativa.
- Adote componentes reutilizáveis, código limpo e separação entre apresentação, estado e chamadas HTTP.
- Garanta responsividade desde 320 px, incluindo tablet e desktop; evite overflow horizontal.
- Use HTML semântico, labels, foco visível, contraste adequado e navegação por teclado.
- Preserve transições fluidas entre telas, feedback de interações e carregamento; respeite `prefers-reduced-motion`.
- Se Pencil ou um frame estiver indisponível, informe a limitação e preserve a interface existente; não alegue fidelidade sem verificação.

## Integração e regras de negócio

- Centralize chamadas em `src/services/api.js` e módulos de API por feature. Use `VITE_API_URL` sem fixar URLs de produção.
- Respeite contratos reais do FastAPI; não invente endpoints nem simule sucesso em produção.
- Preserve autenticação, tratamento de sessão expirada e estados de carregamento, erro, vazio e sucesso.
- Exiba ações conforme perfil `LIDER` ou `TECNICO`, propriedade e estados de viagem e despesa. A autorização definitiva é do backend.
- Preserve ingresso por código, comprovante obrigatório no cadastro, conferência, correção, exclusão autorizada, encerramento e exportação PDF.
- Despesas conferidas não são editáveis; somente líder responsável pode excluí-las. Viagens encerradas são somente leitura.
- Valide formulários, previna submissões duplicadas e confirme ações destrutivas.
- Preserve precisão monetária com utilitários existentes; formate em BRL.
- Não exponha tokens em logs nem coloque segredos em variáveis VITE.
- Não adicione bibliotecas nem migre para TypeScript sem justificativa e autorização.

## Verificação obrigatória

```bash
npm ci
npm run lint
npm test
npm run build
```

Execute `npm run dev` para validação visual. Compare telas com `dev.pen` em diferentes larguras e teste jornadas dos dois perfis com a API quando disponível. Adicione testes para alterações relevantes. Não declare verificações que não foram executadas.

## Git e comunicação

Use commits semânticos quando solicitado: feat, fix, refactor, docs, test, style, chore. Não faça push ou deploy sem autorização. Informe arquivos alterados, decisões, verificações e limitações ao concluir cada etapa.
