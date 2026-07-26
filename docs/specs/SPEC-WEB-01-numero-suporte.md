# SPEC-WEB-01 — Número de Suporte `1-800-SENIOR` → `0800 600 0300`

**Prioridade:** 🔴 Crítico  
**Estimativa:** 15 minutos  
**Status:** Concluído (2026-07-26)  
**Responsável:** David

---

## Problema

O Mobile substituiu `1-800-SENIOR` por `0800 600 0300` (formato brasileiro) em 25/07/2026.
A plataforma Web ainda exibe o número em inglês em dois lugares:

| Arquivo | Linha | Conteúdo atual |
|---------|-------|----------------|
| `src/presentation/components/profile/profileHelpCard.tsx` | 19 e 23 | `href="tel:18007366467"` / texto `1-800-SENIOR` |
| `src/app/(auth)/login/page.tsx` | 13 e 16 | `href="tel:1-800-736467"` / texto `1-800-SENIOR` |

**Impacto:**
- Conteúdo em inglês num produto em português para idosos — quebra a imagem do produto.
- Divergência de conteúdo entre Mobile e Web (avaliadores que testam as duas plataformas vão notar).
- O número `1-800-SENIOR` não é um número brasileiro válido — o link `tel:` funciona de forma incorreta no Brasil.

---

## Solução

### 1. `profileHelpCard.tsx`

**Antes:**
```tsx
<a
  href="tel:18007366467"
  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-primary-foreground px-4 py-2 text-base font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
>
  <Phone className="size-4" aria-hidden />
  1-800-SENIOR
</a>
```

**Depois:**
```tsx
<a
  href="tel:08006000300"
  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-[14px] bg-primary-foreground px-4 py-2 text-base font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
>
  <Phone className="size-4" aria-hidden />
  0800 600 0300
</a>
```

### 2. `src/app/(auth)/login/page.tsx`

**Antes:**
```tsx
footer={
  <>
    Precisa de ajuda? Ligue para{" "}
    <a
      href="tel:1-800-736467"
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      1-800-SENIOR
    </a>
  </>
}
```

**Depois:**
```tsx
footer={
  <>
    Precisa de ajuda? Ligue para{" "}
    <a
      href="tel:08006000300"
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      0800 600 0300
    </a>
  </>
}
```

---

## Critérios de Aceitação

- [x] `profileHelpCard.tsx` exibe `0800 600 0300` com `href="tel:08006000300"`
- [x] `login/page.tsx` exibe `0800 600 0300` com `href="tel:08006000300"`
- [x] Nenhuma outra ocorrência de `1-800-SENIOR` no código-fonte (`rg "1-800-SENIOR" src/`)
- [x] ESLint e TypeScript sem erros após a mudança

> Extra: `profileTourSteps.ts` também atualizado (texto do tour do card de ajuda).

---

## Referência

- Mobile — `settings_screen.dart` e `login_screen.dart` (corrigidos em 2026-07-25)
- `memory-bank/activeContext.md` — seção "Pendências Web a corrigir" item 1
- `memory-bank/progress.md` linha: `[ ] **Número de suporte Web** — substituir...`
