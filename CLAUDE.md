# babyBirth — CLAUDE.md

> Ce fichier est la source de vérité pour toute IA (Claude, Cursor, Copilot…) travaillant sur ce projet.
> Lire **entièrement** avant de toucher au code.

---

## Concept du projet

babyBirth est un site web familial/entre amis autour d'une naissance, composé de **deux sections** :

### 1. Liste de naissance
- Affiche une liste de produits (cadeaux) pré-remplie en base de données
- Chaque produit a : un titre, une image, un lien vers le produit
- Un produit ne peut être **réservé que par un seul utilisateur**
- Un produit réservé est affiché **barré** avec le nom du réservant
- Le réservant peut annuler sa propre réservation (mais personne d'autre)

### 2. Pronostics (jeu de devinettes)
- ~10 questions sur le futur bébé (date, poids, prénom, sexe, etc.)
- Mix de questions **à réponse libre** et **à choix multiples**
- Les réponses sont sauvegardées et modifiables (upsert)

### Authentification
- **Pas de mot de passe.** L'utilisateur s'identifie uniquement avec son **prénom + nom**
- Si l'utilisateur n'existe pas → création automatique en base
- Si il existe → connexion directe
- La session est persistée dans le **localStorage** via Jotai `atomWithStorage`

### Design
- Palette **neutre et chaude** : beige, blanc, brun
- CSS variables shadcn remappées sur ce thème (voir `src/app/globals.css`)

---

## Stack technique

| Rôle | Outil |
|---|---|
| Framework | Next.js 15 (App Router) |
| Runtime / Package manager | **Bun** (jamais npm/yarn/pnpm) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v3 + shadcn/ui (style `new-york`, base `neutral`) |
| État global | **Jotai** (`atomWithStorage` pour la session) |
| État serveur / cache | **TanStack Query v5** |
| Formulaires | **TanStack Form v1** |
| Client HTTP | **Axios** via instance `@/lib/axios` |
| Backend / Auth / DB | **Supabase** (`@supabase/ssr`) |
| Lint / Format | **Biome** (pas ESLint, pas Prettier) |

---

## Schéma de base de données

Fichier de référence : `supabase/schema.sql` — à exécuter dans l'éditeur SQL Supabase.

```
users               — id, first_name, last_name, created_at
                      UNIQUE(first_name, last_name)

products            — id, title, image_url, link, created_at
                      (pré-seedé, modifiable dans Supabase)

product_claims      — id, product_id (UNIQUE), user_id, claimed_at
                      → un seul claim par produit

pronostic_questions — id, question, type (open|multiple_choice),
                      options (jsonb, null si open), order_index

pronostic_answers   — id, user_id, question_id, answer, created_at, updated_at
                      UNIQUE(user_id, question_id)
                      → upsert sur ce couple
```

RLS : toutes les tables ont des politiques permissives pour `anon` (site public de jeu familial).

---

## Structure des fichiers

```
src/
├── types/index.ts              ← Types TS (User, Product, ProductClaim,
│                                  PronosticQuestion, PronosticAnswer)
├── store/
│   └── auth.ts                 ← userAtom (atomWithStorage → localStorage)
├── lib/
│   ├── utils.ts                ← cn() (clsx + tailwind-merge)
│   ├── axios.ts                ← Instance Axios configurée
│   └── supabase/
│       ├── client.ts           ← createClient() côté navigateur
│       ├── server.ts           ← createClient() côté serveur (RSC)
│       └── queries.ts          ← Toutes les requêtes Supabase
├── hooks/
│   ├── use-user.ts             ← useLogin() → findOrCreateUser
│   ├── use-products.ts         ← useProducts(), useClaimProduct(), useUnclaimProduct()
│   └── use-pronostics.ts       ← usePronosticQuestions(), useUserAnswers(), useUpsertAnswers()
├── components/
│   └── ui/                     ← Composants shadcn (générés via CLI uniquement)
└── app/
    ├── globals.css             ← Variables CSS beige/brun + Tailwind
    ├── layout.tsx              ← Layout racine + Providers
    ├── providers.tsx           ← QueryClientProvider + JotaiProvider
    ├── page.tsx                ← Page de login (TanStack Form)
    └── (app)/
        ├── layout.tsx          ← Guard auth (redirect si pas de user) + Header
        ├── home/page.tsx       ← Choix entre Liste de naissance / Pronostics
        ├── liste-naissance/
        │   └── page.tsx        ← Grille de produits avec réservation
        └── pronostics/
            └── page.tsx        ← Formulaire de pronostics (TanStack Form + Query)
```

---

## Commandes

```bash
bun dev          # Serveur de développement (Turbopack)
bun build        # Build production
bun start        # Serveur production
bun lint         # Vérification Biome
bun lint:fix     # Correction automatique Biome
bun format       # Formatage Biome
bun type-check   # Vérification TypeScript
```

---

## Conventions de code

### Imports
- Toujours utiliser l'alias `@/` — jamais de `../../`
- Biome trie les imports automatiquement (`organizeImports: enabled`)

### Composants
- **Server Component par défaut** — `"use client"` seulement si nécessaire
- `"use client"` requis pour : hooks React, events, state, TanStack Query/Form, Jotai
- Fichiers en `kebab-case`, composants en `PascalCase`

### Supabase
- **Navigateur** : `import { createClient } from "@/lib/supabase/client"`
- **Serveur (RSC / Route Handler)** : `import { createClient } from "@/lib/supabase/server"`
- Toutes les requêtes centralisées dans `src/lib/supabase/queries.ts`
- Ne jamais utiliser la clé service côté client

### TanStack Query
- Query keys exportées depuis les fichiers de hooks
- Hooks nommés `use-*.ts` dans `src/hooks/`
- Invalider le bon `queryKey` dans `onSuccess` des mutations

### TanStack Form
- `useForm` de `@tanstack/react-form`
- Pattern `form.Field` avec render prop pour chaque champ

### Jotai
- Atoms dans `src/store/`, un fichier par domaine
- Session : `userAtom` dans `src/store/auth.ts` (atomWithStorage)
- `useAtomValue` pour lecture seule, `useSetAtom` pour écriture seule, `useAtom` pour les deux

### Axios
- Utiliser l'instance `api` de `@/lib/axios` (pas `axios` directement)
- Réservé aux appels vers des APIs externes si nécessaire
- Pour Supabase : utiliser le client Supabase directement (pas Axios)

### shadcn/ui
- Ajouter : `bunx shadcn@latest add <component>`
- Ne **jamais** modifier `src/components/ui/` manuellement

---

## Formatage (Biome)
- Indentation : 2 espaces
- Guillemets : doubles
- Virgule finale : toujours (`trailingCommas: "all"`)
- Longueur de ligne : 100 caractères
- Semicolons : toujours

---

## Variables d'environnement

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon publique Supabase |
| `NEXT_PUBLIC_API_URL` | URL API si backend séparé (optionnel) |

---

## Mise en route (nouveau développeur)

```bash
# 1. Variables d'env
cp .env.local.example .env.local
# Remplir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Initialiser la base de données
# → Aller dans Supabase > SQL Editor > coller supabase/schema.sql > Run

# 3. Ajouter images et liens aux produits
# → Supabase > Table Editor > products > éditer chaque ligne

# 4. Lancer le projet
bun install
bun dev
```
