# babyBirth — AGENT.md

> Instructions spécifiques pour les **agents IA** (Claude Code, Cursor, Copilot, etc.)
> travaillant sur ce projet. Complète `CLAUDE.md` — lire les deux.

---

## Contexte du projet

Site web familial autour d'une naissance avec deux fonctionnalités :

1. **Liste de naissance** — produits réservables (1 produit = 1 utilisateur max)
2. **Pronostics** — jeu de devinettes sur le bébé (questions ouvertes + QCM)

Auth sans mot de passe : prénom + nom uniquement. Session en localStorage (Jotai).

---

## Avant de commencer une tâche

1. Lire `CLAUDE.md` (stack, conventions, schéma DB, structure)
2. Vérifier que `.env.local` existe — **ne jamais le créer ni modifier**
3. Lire les fichiers concernés par la tâche avant de les modifier
4. Vérifier si un hook ou une query Supabase existe déjà avant d'en créer un nouveau

---

## Règles absolues — Ne jamais faire

| Interdit | Raison |
|---|---|
| `npm install` / `yarn add` / `pnpm add` | Bun uniquement : `bun add` |
| Créer `.eslintrc`, `.prettierrc` | Biome gère lint + format |
| Ajouter `react-hook-form`, `Redux`, `Zustand`, `SWR` | Stack déjà fixé |
| Modifier `src/components/ui/**` | Géré exclusivement par shadcn CLI |
| `fetch()` côté client | Axios + TanStack Query à la place |
| `"use client"` inutile | Server Components par défaut |
| Requête Supabase hors de `src/lib/supabase/queries.ts` | Centralisation obligatoire |
| Clé service Supabase côté client | Sécurité |
| Commit `.env.local` ou secrets | Ne jamais faire |

---

## Règles absolues — Toujours faire

- Utiliser `@/` pour tous les imports internes (jamais `../../`)
- Exécuter `bun lint:fix` après toute modification de code
- Ajouter les nouvelles requêtes Supabase dans `src/lib/supabase/queries.ts`
- Ajouter les nouveaux hooks dans `src/hooks/use-*.ts`
- Invalider les query keys dans `onSuccess` des mutations TanStack Query
- Utiliser `atomWithStorage` pour tout state persisté (pas `localStorage` direct)

---

## Flux de données — rappel

```
Page (Client Component)
  └── Hook TanStack Query (src/hooks/)
        └── Fonction Supabase (src/lib/supabase/queries.ts)
              └── createClient() (src/lib/supabase/client.ts)
```

Pour les mutations qui modifient l'état global (ex: connexion) :
```
Hook useMutation
  └── Fonction query
  └── onSuccess → setAtom (Jotai) + router.push()
```

---

## Auth — comment ça marche

```ts
// src/store/auth.ts
export const userAtom = atomWithStorage<User | null>("babybirth_user", null);
```

- `null` = non connecté → redirigé vers `/`
- `User` = connecté → accès à `/(app)/**`
- Le guard est dans `src/app/(app)/layout.tsx` (useEffect + mounted check)
- Login = `useLogin()` dans `src/hooks/use-user.ts`

---

## Commandes utiles

```bash
bun dev                          # Dev avec Turbopack
bun lint:fix                     # Fix lint Biome
bun type-check                   # Check TypeScript
bunx shadcn@latest add button    # Ajouter un composant shadcn
```

---

## Patterns à réutiliser

### Hook TanStack Query
```ts
// src/hooks/use-mon-hook.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import { maFonctionQuery } from "@/lib/supabase/queries";

export const monQueryKey = ["ma-cle"];

export function useMonHook() {
  return useQuery({
    queryKey: monQueryKey,
    queryFn: maFonctionQuery,
  });
}
```

### Mutation avec invalidation
```ts
const mutation = useMutation({
  mutationFn: (data: MonType) => maFonctionMutation(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: monQueryKey });
  },
});
```

### TanStack Form
```tsx
const form = useForm({
  defaultValues: { champ: "" },
  onSubmit: async ({ value }) => { /* ... */ },
});

// Dans le JSX :
<form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
  <form.Field name="champ">
    {(field) => (
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    )}
  </form.Field>
</form>
```

### Atom Jotai persisté
```ts
import { atomWithStorage } from "jotai/utils";
export const monAtom = atomWithStorage<MaValeur>("cle-localStorage", valeurDefaut);
```

### Requête Supabase avec join
```ts
// Dans src/lib/supabase/queries.ts
export async function getMesItems(): Promise<MonType[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ma_table")
    .select("*, autre_table(*)")
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as MonType[];
}
```

---

## Design — couleurs

Le thème est **beige / blanc / brun**. Les variables CSS sont dans `src/app/globals.css`.

| Usage | Variable | Valeur approx. |
|---|---|---|
| Fond page | `--background` | Crème clair |
| Cartes | `--card` | Blanc |
| Bouton principal | `--primary` | Brun chaud |
| Texte | `--foreground` | Brun foncé |
| Bordures | `--border` | Beige moyen |
| Texte secondaire | `--muted-foreground` | Brun moyen |

Ne pas modifier la palette sans l'accord du propriétaire du projet.

---

## Checklist avant de terminer une tâche

- [ ] `bun type-check` — 0 erreur TypeScript
- [ ] `bun lint` — 0 erreur Biome bloquante
- [ ] Aucun secret, clé API ou credential dans le code
- [ ] Nouvelles requêtes Supabase dans `queries.ts`
- [ ] Nouveaux hooks dans `src/hooks/`
- [ ] Imports avec `@/` (pas de `../../`)
- [ ] `"use client"` seulement là où c'est nécessaire
