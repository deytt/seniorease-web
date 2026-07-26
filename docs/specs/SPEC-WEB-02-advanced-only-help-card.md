# SPEC-WEB-02 — Card "Precisa de Ajuda?" oculto em Modo Básico

**Prioridade:** 🔴 Crítico  
**Estimativa:** 10 minutos  
**Status:** Pendente  
**Responsável:** _a definir_

---

## Problema

O ADR-025 (2026-07-25) formalizou o contrato de paridade Modo Básico/Avançado entre Web e Mobile.
O Mobile oculta o `_HelpCard` em Modo Básico (SPEC-02, 2026-07-25).
O Web renderiza o `ProfileHelpCard` sem qualquer restrição de modo:

```tsx
// src/presentation/components/profile/profileScreen.tsx — linha 261
<div data-tour="profile-help">
  <ProfileHelpCard />
</div>
```

O Modo Básico é destinado a idosos que precisam de uma interface simplificada.
Exibir um card extra de suporte neste modo vai contra o princípio de redução de complexidade visual.

**Tabela de paridade (systemPatterns.md):**

| Elemento | Mobile | Web | Status |
|----------|--------|-----|--------|
| Card "Precisa de Ajuda?" (Settings/Profile) | Oculto | Visível | ❌ Divergente |

---

## Solução

### Arquivo: `src/presentation/components/profile/profileScreen.tsx`

Adicionar a classe `advanced-only` no wrapper do `ProfileHelpCard`.
O CSS em `globals.css` já trata esta classe: `html[data-interface-mode="basic"] .advanced-only { display: none; }`.

**Antes (linha ~261):**
```tsx
<div data-tour="profile-help">
  <ProfileHelpCard />
</div>
```

**Depois:**
```tsx
<div data-tour="profile-help" className="advanced-only">
  <ProfileHelpCard />
</div>
```

> **Nota:** O atributo `data-tour` é preservado. O tour de perfil referencia este elemento;
> em Modo Básico o passo correspondente não será visível, o que é o comportamento esperado
> (o tour em Modo Básico é oferecido na 1ª visita e pode omitir passos de elementos ocultos).

---

## Critérios de Aceitação

- [ ] Em Modo Básico (`data-interface-mode="basic"` no `<html>`), o card "Precisa de Ajuda?" **não aparece** na tela `/profile`
- [ ] Em Modo Avançado (padrão), o card continua visível normalmente
- [ ] A mudança de modo em `/accessibility` aplica-se em tempo real ao perfil (sem recarregar a página) — porque o `PreferencesProvider` aplica o atributo no `<html>` globalmente
- [ ] ESLint e TypeScript sem erros
- [ ] Atualizar coluna "Status paridade" em `memory-bank/systemPatterns.md`: linha do "Card Precisa de Ajuda?" de ❌ para ✅

---

## Referência

- `memory-bank/activeContext.md` — seção "ADR-025 — Paridade Modo Básico/Avançado", item do card de ajuda
- `memory-bank/progress.md` — `[ ] [ADR-025] Adequar o Web...` + sub-item sobre Card Precisa de Ajuda
- `memory-bank/systemPatterns.md` — tabela "Modo Básico vs. Modo Avançado"
- Mobile: `features/profile/presentation/screens/settings_screen.dart` — `_HelpCard` com `if (!isBasic)` (SPEC-02)
