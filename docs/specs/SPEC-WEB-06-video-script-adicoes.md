# SPEC-WEB-06 — Adições ao `video-script.md`

**Prioridade:** 🟡 Médio (impacto direto na nota — vídeo é 1 dos 2 entregáveis obrigatórios)  
**Estimativa:** 20 minutos  
**Status:** Pendente  
**Responsável:** David (narrador do vídeo)

---

## Problema

O `video-script.md` está bem estruturado, mas carece de alguns pontos que os avaliadores esperam
ouvir explicitamente, com base no PDF do Hackathon e nas fases anteriores:

1. **Não menciona a progressão das fases** — o Hackathon é a culminação de 4 Tech Challenges; uma frase de contexto fortalece a narrativa de aprendizado
2. **Não demonstra "confirmação de ações críticas"** — requisito textual do Hackathon que deve ser mostrado no vídeo
3. **Não destaca paridade Firebase** — mudar preferência no mobile e ver refletir na web é um diferencial poderoso, ainda não roteirizado
4. **Não menciona o Storybook** — diferencial de qualidade que só o vídeo pode mostrar de forma impactante
5. **Bloco de encerramento sem slide de links** — avaliadores devem conseguir acessar os recursos sem pausar

---

## Adições sugeridas ao `video-script.md`

### Adição 1 — Contexto das fases (inserir no Bloco 1 ou início do Bloco 3)

```markdown
#### Contexto das Fases da Pós-Graduação

Em cada fase aplicamos uma camada de conhecimento que foi somada ao Hackathon:
- **Fase 1** — Next.js, Design System e Storybook
- **Fase 2** — Arquitetura modular, TypeScript e deploy em cloud (Vercel)
- **Fase 3** — Mobile com Flutter, Firebase e autenticação
- **Fase 4** — Clean Architecture, performance e segurança

O Hackathon reuniu todos esses aprendizados num produto real para um público real.
```

**Frase para narração:**
> *"Cada fase da pós nos deu uma ferramenta. O Hackathon foi o momento de usá-las todas juntas."*

---

### Adição 2 — Demonstrar "confirmação de ações críticas" (inserir no Bloco 4 ou 5)

O Hackathon cita textualmente *"confirmação adicional antes de ações críticas"* como requisito do Módulo 1.

```markdown
#### Passo extra — Demo de confirmação de exclusão

Ao excluir uma tarefa (ou fazer logout), mostrar explicitamente o modal de confirmação:

> "O nosso utilizador tem medo de cometer erros irreversíveis — por isso, qualquer ação
> destrutiva exige uma confirmação explícita. Não existe 'ops, apaguei sem querer' no SeniorEase."
```

**Frase para narração:**
> *"Confirmação antes de qualquer ação crítica — porque para o nosso utilizador, um erro é uma fonte de ansiedade, não apenas um inconveniente."*

---

### Adição 3 — Paridade Firebase cross-platform (inserir no Bloco 5 ou 6)

```markdown
#### Passo de paridade — Preferências sincronizadas

Após mostrar o Modo Escuro ou o tamanho de fonte no mobile:
1. Abrir a web (Vercel) numa segunda aba
2. Mostrar que as mesmas preferências já estão aplicadas — sem recarregar, sem configurar de novo

> "Porque a base Firebase é compartilhada — o que o utilizador configura no celular,
> aparece automaticamente no computador."
```

**Frase para narração:**
> *"Uma base, duas plataformas — zero duplicação de infraestrutura."*

---

### Adição 4 — Storybook no diferencial de CI/CD (atualizar diferencial 9 / Bloco 9)

No trecho existente sobre CI/CD, adicionar após a menção de testes:

```markdown
- O Design System web está documentado no **Storybook** (19 stories) — cada componente com
  todos os estados, variantes e tokens. Durante o desenvolvimento, qualquer dev (ou agente IA)
  podia ver os componentes disponíveis sem precisar abrir a aplicação.
```

**Frase para narração:**
> *"O Storybook não é só documentação — é um catálogo vivo que garantiu consistência visual
> entre os componentes ao longo de meses de desenvolvimento paralelo."*

---

### Adição 5 — Slide de encerramento com links (Bloco 7)

```markdown
#### Slide de encerramento

Exibir na tela (sobreposição ou print-screen) durante os últimos 30 segundos:

| Recurso | Link |
|---------|------|
| App Web | https://seniorease-web.vercel.app |
| Repositório Web | https://github.com/deytt/seniorease-web |
| Repositório Mobile | https://github.com/deytt/seniorease-mobile |
| Figma / Design System | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase |

> Facilita a vida do avaliador — não precisa pausar, copiar, procurar.
```

---

## Checklist de atualização do `video-script.md`

- [ ] Inserir "Contexto das fases" no Bloco 1 ou 3 com a frase de narração
- [ ] Inserir passo de "confirmação de exclusão" no roteiro detalhado do Bloco 4 (mobile) e/ou Bloco 5 (web)
- [ ] Inserir passo de "paridade Firebase" no Bloco 5 ou 6
- [ ] Atualizar o diferencial 9 (CI/CD) com menção ao Storybook
- [ ] Adicionar slide de encerramento com links no Bloco 7
- [ ] Adicionar a nova frase-chave sobre confirmação de ações às "Frases e Argumentos-Chave"
- [ ] Adicionar a nova frase-chave sobre Storybook às "Frases e Argumentos-Chave"
- [ ] Revisar duração total — as adições não devem ultrapassar o limite de **15 min**; ajustar outros blocos se necessário

---

## Referência

- `memory-bank/video-script.md` — arquivo a atualizar
- Hackathon PDF — *"confirmação adicional antes de ações críticas"* (Módulo 1, requisito explícito)
- Hackathon PDF — *"vídeo explicativo explicando cada decisão e feature"*
- Fase 1 PDF — Storybook como entregável obrigatório
