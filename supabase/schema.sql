-- ============================================================
-- babyBirth — Schéma Supabase
-- À exécuter dans l'éditeur SQL de Supabase (projet vierge)
-- ============================================================

-- Utilisateurs (auth sans mot de passe)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (first_name, last_name)
);

-- Produits de la liste de naissance
-- claimed_by_user_id : NULL = disponible, renseigné = réservé
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  link TEXT,
  claimed_by_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions du jeu de pronostics
CREATE TABLE IF NOT EXISTS pronostic_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('open', 'multiple_choice')),
  options JSONB,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Réponses des utilisateurs aux pronostics
CREATE TABLE IF NOT EXISTS pronostic_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES pronostic_questions (id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

-- ============================================================
-- Row Level Security (accès public — site de jeu familial)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronostic_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronostic_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_users" ON users FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "public_products" ON products FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "public_pronostic_questions" ON pronostic_questions FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "public_pronostic_answers" ON pronostic_answers FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- Données — Liste de naissance
-- (Mettre à jour image_url et link directement dans Supabase)
-- ============================================================

INSERT INTO products (title, image_url, link) VALUES
  ('Poussette promenade', NULL, NULL),
  ('Siège auto groupe 0+', NULL, NULL),
  ('Lit bébé à barreaux', NULL, NULL),
  ('Matelas pour lit bébé', NULL, NULL),
  ('Baignoire bébé', NULL, NULL),
  ('Transat bébé', NULL, NULL),
  ('Tapis d''éveil', NULL, NULL),
  ('Baby phone vidéo', NULL, NULL),
  ('Sac à langer', NULL, NULL),
  ('Porte-bébé ergonomique', NULL, NULL),
  ('Gigoteuse 0–6 mois', NULL, NULL),
  ('Coffret naissance', NULL, NULL);

-- ============================================================
-- Données — Questions pronostics
-- ============================================================

INSERT INTO pronostic_questions (question, type, options, order_index) VALUES
  ('Quel sera le sexe du bébé ?', 'multiple_choice', '["Fille 👧", "Garçon 👦"]', 1),
  ('Quelle sera sa date de naissance ?', 'open', NULL, 2),
  ('Quelle sera son heure de naissance ?', 'open', NULL, 3),
  ('Quel sera son prénom ?', 'open', NULL, 4),
  ('Quel sera son poids à la naissance (en grammes) ?', 'open', NULL, 5),
  ('Quelle sera sa taille à la naissance (en cm) ?', 'open', NULL, 6),
  ('De quelle couleur seront ses yeux ?', 'multiple_choice', '["Bleu", "Vert", "Marron", "Noisette", "Noir"]', 7),
  ('De quelle couleur seront ses cheveux ?', 'multiple_choice', '["Blond", "Châtain", "Brun", "Roux", "Noir", "Chauve 😂"]', 8),
  ('Comment se déroulera l''accouchement ?', 'multiple_choice', '["Naturellement", "Avec péridurale", "Césarienne programmée", "Césarienne d''urgence"]', 9),
  ('Un mot ou un message pour le bébé 💕', 'open', NULL, 10);
