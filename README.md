# Creadif Content AI

Outil interne gratuit et ouvert pour créer du contenu professionnel sur les réseaux sociaux. Réservé à l'usage des collaborateurs de l'entreprise — toutes les fonctionnalités sont accessibles sans frais.

## Stack

- Next.js 15, React, TypeScript
- TailwindCSS, shadcn/ui
- Supabase (Auth + Database)
- OpenAI API

## Installation

```bash
npm install
cp .env.example .env.local
# Remplir les variables d'environnement
npm run dev
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Aller dans **Project Settings → API** et copier :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. Coller ces 3 valeurs dans `.env.local`
4. Aller dans **SQL Editor** et exécuter tout le contenu de `supabase/schema.sql`
5. **Important — dans Authentication → Providers → Email**, décocher
   "Confirm email" si tu veux que les comptes créés par l'admin soient
   utilisables immédiatement (sinon l'utilisateur doit cliquer un lien
   reçu par email avant de pouvoir se connecter).

## Gestion des accès (pas d'inscription libre)

L'inscription publique (`/register`) est désactivée. Seul un compte
administrateur peut créer les accès des autres collaborateurs, depuis
`/admin`.

**Pour créer le tout premier compte admin (toi) :**

1. Va sur `/register`... non — crée d'abord ton compte directement dans
   Supabase : **Authentication → Users → Add user** (email + mot de passe),
   coche "Auto Confirm User".
2. Dans **SQL Editor**, exécute (en remplaçant l'email) :
   ```sql
   UPDATE user_settings SET is_admin = TRUE
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ton.email@creadif.com');
   ```
   (Si la ligne `user_settings` n'existe pas encore, connecte-toi une
   première fois sur `/login` — la ligne sera créée automatiquement à
   l'onboarding — puis relance la requête ci-dessus.)
3. Connecte-toi sur `/login`. Un lien **"Admin"** apparaît en bas de la
   barre latérale, menant vers `/admin`, où tu peux créer les comptes de
   tes collègues (nom, email, mot de passe temporaire).

## Variables d'environnement

Voir `.env.local` pour la liste complète et leur origine (Supabase
Project Settings → API).

## Structure

```
app/          # Pages et routes Next.js
components/   # Composants réutilisables
hooks/        # Hooks React personnalisés
services/     # Services (OpenAI, Supabase)
lib/          # Utilitaires et configuration
types/        # Types TypeScript
```
