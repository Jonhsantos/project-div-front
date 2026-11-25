<p align="center"><img src="div-logo-oficial.png" alt="DIV" width="160"></p>

# DIV — Front-end

Aplicação web para gerenciamento de despesas e comprovantes de viagens profissionais, desenvolvida como Projeto Integrador do curso de Tecnologia em Sistemas para Internet do Senac.

## Sobre

O DIV organiza a prestação de contas de equipes em viagens profissionais, centralizando despesas, comprovantes e conferências em uma interface web.

## Funcionalidades

- Cadastro e autenticação.
- Criação, listagem e detalhamento de viagens.
- Ingresso de técnicos por código de acesso.
- Registro, edição e exclusão de despesas conforme permissões.
- Envio e consulta de comprovantes.
- Conferência e solicitação de correção de despesas pelo líder.
- Resumo de valores, encerramento de viagens e exportação PDF.
- Interface baseada no design oficial do projeto.

## Tecnologias

React 19, JavaScript (JSX), Vite 8, Tailwind CSS 4, Oxlint, Inter, Material Symbols e Node.js Test Runner.

## Estrutura

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── assets/
├── components/       # Componentes compartilhados
├── features/
│   ├── auth/         # Autenticação e termos
│   ├── trips/        # Viagens
│   └── expenses/     # Despesas
└── services/
    └── api.js        # Cliente HTTP
public/
dev.pen              # Design oficial
div-logo-oficial.png # Logo oficial
package.json
.env.example
```

## Execução local

Pré-requisitos: Git, Node.js compatível com Vite 8 e npm. O backend deve estar disponível.

```bash
git clone https://github.com/Jonhsantos/project-div-front.git
cd project-div-front
npm ci
```

Copie `.env.example` para `.env` e configure:

```dotenv
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Acesse http://localhost:5173 (ou o endereço indicado pelo Vite).

## Scripts

| Comando | Finalidade |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run lint` | Análise estática com Oxlint |
| `npm test` | Testes dos utilitários de moeda e nomes de arquivos |
| `npm run build` | Build de produção |
| `npm run preview` | Prévia local do build |

## Perfis de acesso

**Líder:** cria viagens, acompanha participantes e despesas, confere registros, encerra viagens e exporta relatórios.

**Técnico (trabalhador):** ingressa por código, registra despesas e comprovantes, acompanha os próprios gastos e corrige registros quando necessário.

As permissões são validadas definitivamente pelo backend. Ocultar botões no frontend não substitui autorização na API.

## Design e experiência

O arquivo `dev.pen`, mantido na raiz, é a referência oficial de interface. Utilize Pencil para consultar os frames. Preserve a identidade visual e o arquivo `div-logo-oficial.png`. A evolução da interface deve priorizar responsividade, acessibilidade, componentização e transições fluidas.

## Deploy (Vercel)

- Framework: Vite.
- Instalação: `npm ci`.
- Build: `npm run build`.
- Diretório de saída: `dist`.
- Variável de ambiente: `VITE_API_URL` apontando para a API HTTPS publicada.

Configure a origem do frontend no `CORS_ORIGINS` do backend. Após alterar variáveis VITE, gere um novo build. Nunca coloque segredos em variáveis VITE, pois são incorporadas ao código entregue ao navegador.

## Repositório relacionado

[DIV Back-end](https://github.com/Jonhsantos/project-div-back)

## Autor

Jonathan da Silva Santos — Tecnologia em Sistemas para Internet, Senac.
