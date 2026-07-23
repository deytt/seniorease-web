# SeniorEase Web

Aplicação web do **SeniorEase** — plataforma de acessibilidade e organização de tarefas/lembretes para pessoas idosas (Hackathon FIAP Inclusive).

Stack: **Next.js 16** (App Router) · TypeScript · Tailwind · Firebase · Zustand · Storybook · Vitest.

Arquitetura: Clean Architecture em `src/domain`, `src/infrastructure` e `src/presentation`.

Documentação compartilhada com o mobile: submódulo [`memory-bank/`](./memory-bank).

---

## Pré-requisitos

- Node.js 20+ (recomendado)
- Conta no projeto Firebase `seniorease-backend`
- Acesso ao repositório do memory-bank (submódulo)

---

## Setup

```bash
# Clonar com submódulo
git clone --recurse-submodules <url-do-repositorio>
cd seniorease-web

# Se já clonou sem submódulo:
git submodule update --init --recursive

# Dependências
npm install

# Variáveis de ambiente
cp .env.example .env.local
# Preencha .env.local com as chaves do Firebase (nunca commitar .env.local)
```

### Branch de trabalho

O fluxo do time usa **`develop`** como integração e **`master`** para deploy (Vercel).

```bash
git checkout develop
git pull origin develop
```

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Webpack) |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest (unitários) |
| `npm run storybook` | Storybook em http://localhost:6006 |

---

## Variáveis de ambiente

Veja `.env.example`. Todas as chaves públicas do Firebase usam o prefixo `NEXT_PUBLIC_`.

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web SDK |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Projeto |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage (foto de perfil) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App Web |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Push Web (FCM) — obrigatória para registrar token |

O Service Worker de messaging (`public/firebase-messaging-sw.js`) recebe a config via query string montada em runtime a partir dessas variáveis.

---

## Dados de demonstração

O dashboard **não** grava tarefas/lembretes de exemplo automaticamente.

Com a lista vazia, use o botão **“Carregar exemplos”** no dashboard para popular dados de demo no Firestore (ação explícita do usuário).

---

## Estrutura (visão rápida)

```
src/
  domain/           # Entidades e casos de uso
  infrastructure/   # Firebase, repositórios
  presentation/     # UI, hooks, providers, tours
  app/              # Rotas Next.js (App Router)
memory-bank/        # Submódulo: brief, schema, progresso
```

---

## Memory Bank

Antes de implementar features, leia os arquivos em `memory-bank/` (project brief, padrões, schema Firebase, progresso). Após mudanças de schema/rules, atualize o submódulo e faça bump do pin neste repositório.
