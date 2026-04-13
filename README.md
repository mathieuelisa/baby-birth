# 🍼 babyBirth

Site web familial autour d'une naissance, avec deux fonctionnalités principales : une **liste de naissance** et un **jeu de pronostics**.

---

## Fonctionnalités

### 🎁 Liste de naissance
- Affiche une liste de produits (cadeaux) pré-remplie en base de données
- Chaque produit peut être **réservé par un seul utilisateur**
- Un produit réservé apparaît **barré** avec le nom du réservant
- Le réservant peut **annuler** sa propre réservation

### 🔮 Pronostics
- ~10 questions sur le futur bébé (date, poids, prénom, sexe…)
- Mix de questions **à réponse libre** et **à choix multiples**
- Les réponses sont sauvegardées et **modifiables** à tout moment

### 🔐 Authentification
- **Sans mot de passe** — identification par prénom + nom uniquement
- Création automatique du compte si l'utilisateur n'existe pas encore
- Session persistée dans le `localStorage` via Jotai

---

## Stack technique

| Rôle | Outil                                                    |
|---|----------------------------------------------------------|
| Framework | Next.js 16 (App Router)                                  |
| Runtime / Package manager | **Bun**                                                  |
| Language | TypeScript strict                                        |
| Styling | Tailwind CSS v4 + shadcn/ui (`new-york`, base `neutral`) |
| État global | **Jotai** (`atomWithStorage`)                            |
| État serveur / cache | **TanStack Query v5**                                    |
| Formulaires | **TanStack Form v1**                                     |
| Client HTTP | **Axios**                                                |
| Backend / Auth / DB | **Supabase** (`@supabase/ssr`)                           |
| Lint / Format | **Biome**                                                |

---

## Mise en route

### 1. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Renseigner les variables suivantes dans `.env.local` :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon publique Supabase |

### 2. Initialiser la base de données

Dans **Supabase > SQL Editor**, coller et exécuter le contenu de `supabase/schema.sql`.

### 3. Ajouter les produits

Dans **Supabase > Table Editor > products**, renseigner les images et liens de chaque produit.

### 4. Lancer le projet

```bash
bun install
bun dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

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

## Structure du projet

```
src/
├── types/index.ts              ← Types TypeScript globaux
├── store/
│   └── auth.ts                 ← userAtom (session localStorage)
├── lib/
│   ├── utils.ts                ← cn() utilitaire
│   ├── axios.ts                ← Instance Axios configurée
│   └── supabase/
│       ├── client.ts           ← createClient() navigateur
│       ├── server.ts           ← createClient() serveur (RSC)
│       └── queries.ts          ← Toutes les requêtes Supabase
├── hooks/
│   ├── use-user.ts             ← useLogin()
│   ├── use-products.ts         ← useProducts(), useClaimProduct()…
│   └── use-pronostics.ts       ← usePronosticQuestions(), useUpsertAnswers()…
├── components/
│   └── ui/                     ← Composants shadcn (CLI uniquement)
└── app/
    ├── layout.tsx              ← Layout racine + Providers
    ├── providers.tsx           ← QueryClientProvider + JotaiProvider
    ├── page.tsx                ← Page de login
    └── (app)/
        ├── layout.tsx          ← Guard auth + Header
        ├── home/page.tsx       ← Accueil (choix de section)
        ├── liste-naissance/
        │   └── page.tsx        ← Grille de produits
        └── pronostics/
            └── page.tsx        ← Formulaire de pronostics
```

---

## Schéma de base de données

```
users               — id, first_name, last_name, created_at
products            — id, title, image_url, link, created_at
product_claims      — id, product_id (UNIQUE), user_id, claimed_at
pronostic_questions — id, question, type (open|multiple_choice), options (jsonb), order_index
pronostic_answers   — id, user_id, question_id, answer, created_at, updated_at
                      UNIQUE(user_id, question_id)
```

---

## Design

Palette **neutre et chaude** : beige, blanc, brun. Les variables CSS sont définies dans `src/styles/`.

---

> Pour les conventions de code et les règles de contribution, voir [`CLAUDE.md`](./CLAUDE.md) et [`AGENT.md`](./AGENT.md).
