# React + Vite

## Organização do frontend DIV

- `src/App.jsx`: composição inicial e estado de autenticação.
- `src/features/auth/`: estilos e chamadas de autenticação.
- `src/features/trips/`: telas, componentes, estilos e chamadas de viagens.
- `src/features/expenses/`: componentes e chamadas de despesas.
- `src/services/api.js`: cliente HTTP compartilhado.
- `src/assets/`: arquivos estáticos do frontend.
- `dev.pen` e `div-logo-oficial.png`: design oficial e imagem referenciada pelo arquivo de design; mantidos na raiz.

Para executar, copie `.env.example` para `.env`, configure `VITE_API_URL` e rode `npm install` seguido de `npm run dev`. O backend precisa estar disponível no endereço configurado.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
