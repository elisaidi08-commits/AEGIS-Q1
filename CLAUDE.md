# CLAUDE.md — HITMAKINGZ v2

## Identité du Projet

HITMAKINGZ est une plateforme musicale qui transforme des artistes "bruit" en "signal" : identité claire, plan d'exécution, réseau activé, preuves visibles. C'est un projet portfolio qui prouve la maîtrise du design premium (UI/DA). L'app est semi-fonctionnelle : le Scan d'artiste et le Plan Builder marchent vraiment, le reste est simulé avec de la fake data.

## Stack Technique

- **Framework** : Next.js 14+ (App Router, TypeScript)
- **Styling** : Tailwind CSS avec design tokens custom (palette "hmz")
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **3D** : Three.js via React Three Fiber (@react-three/fiber + @react-three/drei)
- **Animations** : GSAP (scroll, timelines) + Framer Motion (page transitions, layout)
- **State** : Zustand (stores : auth, scan, plan, progress)
- **Export** : html2canvas (téléchargement des cartes en PNG)
- **Deploy** : Vercel

## Architecture

### Pages (App Router)

```
/                   → Landing (hero, piliers, méthode, preuves, réseau preview, manifeste)
/scan               → Scan d'artiste (wizard 5-6 questions → Signal Card)
/plan               → Plan Builder (wizard 3 étapes → Plan Card)
/reseau             → Signal Board (mur moodboard, filtres, collab match)
/preuves            → Case studies (dossiers classifiés, before/after)
/frequence          → Page ambient audio (visualizer, bonus)
/login              → Terminal access (auth Supabase)
/dashboard          → Espace perso (carte, progression XP, actions, badges)
```

### API Routes

```
POST /api/auth/signup       → Créer un compte (Supabase Auth)
POST /api/auth/login        → Se connecter
POST /api/auth/logout       → Se déconnecter
GET  /api/auth/me           → Profil courant + session

POST /api/scan              → Sauvegarder un scan (calcul archétype + score + actions)
GET  /api/scan              → Lister ses Signal Cards
GET  /api/scan/[id]         → Détail d'une Signal Card

GET  /api/network           → Lister les profils réseau (+ filtres query params)
GET  /api/network/[id]      → Détail d'un profil réseau

GET  /api/progress          → Récupérer sa progression (XP, level, badges, stats)
POST /api/progress/action   → Valider une action → gain XP → check level up
```

### Base de Données (Supabase / PostgreSQL — 6 tables)

```
profiles            → Identité user (auto-créé au signup via trigger)
signal_cards        → Résultats scan (archétype, signal_score JSONB, actions, card_number)
network_profiles    → Profils réseau (seed data, public)
user_progress       → XP, level (1-10), level_name, streaks, stats
user_actions        → Checklist d'actions (action_text, action_type, xp_value, completed)
user_badges         → Badges débloqués par palier
```

### Structure Composants

```
components/
├── layout/          → Topbar, Footer, GrainOverlay, VignetteOverlay, PageTransition
├── 3d/              → SceneCanvas, SignalPrism, ArchetypeObject, NoiseToSignal, ParticleField
├── cards/           → SignalCard, SignalCardLevel, PlanCard, ProfileCard, CaseCard, PillarCard
├── scan/            → ScanWizard, ScanQuestion, ScanSonore, ScanProcessing, ScanResult
├── plan/            → PlanWizard, StepDiagnostic, StepStrategie, StepActivation, PlanTimeline, PlanResult
├── progression/     → XPBar, LevelBadge, ActionChecklist, LevelUpModal, BadgeCollection, FeatureGate
├── reseau/          → SignalBoard, BoardFilters, CollabMatch, CollabModal
├── preuves/         → CaseList, CaseDossier, BeforeAfter
└── ui/              → Button, Chip, Badge, ProgressBar, RadarChart, Barcode, HoloSheen, GlitchText, ChromeSymbol, LockedOverlay
```

### Stores (Zustand)

```
useAuthStore        → User session, login/logout
useScanStore        → Réponses scan, archétype résultat, Signal Card active
usePlanStore        → Inputs plan, Plan Card résultat
useProgressStore    → XP, level, badges, actions, sync avec Supabase
```

### Lib (logique métier)

```
lib/supabase/client.ts      → Client browser Supabase
lib/supabase/server.ts       → Client server Supabase
lib/archetype-engine.ts      → Réponses scan → scoring 3 axes → archétype + Signal Score + 3 actions
lib/plan-engine.ts           → Inputs plan → Plan Card data + actions générées
lib/xp-engine.ts             → Calcul XP, check level up, unlock features/badges
lib/utils.ts                 → Helpers généraux
```

---

## Direction Artistique (DA)

### Concept Visuel

L'esthétique est un hybride entre un zine physique, une pochette d'album, et un boarding pass interactif. Chaque output (Signal Card, Plan Card) ressemble à un objet physique premium — un pass, un ticket, un badge, une carte à collectionner.

### Palette

- **Dominante** : Violet (#8b5cf6), purple (#a855f7), deep purple (#6d28d9)
- **Fond** : Noir profond (#0b0b0f), dark (#13131a), surface (#1a1a24)
- **Accents** : Cyan (#22d3ee), magenta (#ec4899), lime (#84cc16), orange (#f97316), gold (#d4a017)
- **Iridescent** : Gradients violet → magenta → cyan (pour effets holo)
- **Texte** : text (#e0e0ea), muted (#6b6b80), white (#f5f5ff)

### Typographie

- **Display** (titres, héros, noms archétypes) : Font brutalist bold condensed (Clash Display / Monument Extended)
- **Body** (texte courant) : Font clean moderne (Satoshi / General Sans)
- **Mono** (données, barcodes, labels techniques, terminal) : JetBrains Mono / Space Mono
- **Le logotype "HITMAKINGZ"** est un lettering custom cyber-stylisé, pas une font standard

### Textures & Effets

- **Grain** : Overlay SVG noise à 4% d'opacité, fixed, couvre toute la page
- **Vignette** : Radial gradient sombre sur les bords
- **Glass** : backdrop-filter blur(20px) + border violet subtil
- **Holographique** : Gradient animé 105deg (violet → magenta → cyan) sur hover
- **Chrome** : Reflets métalliques sur les symboles 3D des archétypes
- **Scanlines** : Lignes horizontales fines pour effet CRT/terminal
- **Glitch** : Micro-glitch CSS sur hover (pas agressif, subtil)

### Éléments Visuels Récurrents

- Barcodes SVG décoratifs
- Étoiles 4 branches (sparkles)
- Globes wireframe
- Stamps / labels ("ACCESS GRANTED", "CLASSIFIED", "CASE #001")
- Numéros de série style "HMZ-2026-00042"
- Bordures qui glow selon le palier
- Coins de carte avec micro-symboles (croix, points)

---

## Système d'Archétypes (7 archétypes)

Chaque archétype = une personnalité créative nommée d'après un film. Le film incarne le parcours et la tension de l'archétype.

| ID | Film | Personnalité | Couleur DA | Symbole Chrome |
|----|------|-------------|------------|----------------|
| whiplash | WHIPLASH | Le Perfectionniste Brûlant | Rouge/orange brûlé | Lame spirale (torsion) |
| lost_in_translation | LOST IN TRANSLATION | L'Artiste Incompris | Bleu nuit/cyan | Anneau brisé (orbite ouverte) |
| kids | KIDS | Le Brut Authentique | Jaune sale/lime | Étoile brute (éclaboussure) |
| drive | DRIVE | Le Stratège Silencieux | Violet/chrome | Flèche effilée (lame directionnelle) |
| moonlight | MOONLIGHT | Le Sensible en Construction | Bleu profond/iridescent | Croissant fluide (goutte) |
| akira | AKIRA | Le Visionnaire Explosif | Rouge néon/magenta | Explosion cristalline (éclats) |
| amadeus | AMADEUS | Le Prodige Sous-estimé | Or sombre/noir | Couronne inversée (clé) |

### Archetype Engine (lib/archetype-engine.ts)

Le système est hybride :

1. Chaque réponse au scan donne des points sur 3 axes : Identité (I), Structure (S), Activation (A)
2. Les scores sont normalisés sur 0-100
3. Des combinaisons spécifiques de réponses déclenchent des archétypes prioritaires
4. Sinon, le profil de score est mappé vers l'archétype le plus proche
5. 3 actions sont générées : 1 fixe (signature archétype) + 1 basée sur le score le plus bas + 1 basée sur l'objectif

### Questions du Scan

1. Style musical (rap, afro, rnb, pop, drill, alt)
2. Objectif (release, identité, booking, contenu)
3. Niveau (0-3)
4. Freins / blocages (sélection multiple parmi 10 options)
5. Scan sonore (choix entre 4 ambiances audio de 5 sec)
6. Question ouverte (phrase signature / vibe en mots)

---

## Système de Progression (10 paliers)

La Signal Card est un objet vivant qui évolue avec l'artiste. Actions complétées = XP. Chaque palier = glow up visuel + badges + features débloquées.

### Les 10 Paliers

| Palier | Nom | XP cumulé | Titre carte |
|--------|-----|-----------|-------------|
| 1 | STATIC | 0 | Fréquence détectée |
| 2 | SIGNAL | 50 | Signal émis |
| 3 | PULSE | 120 | Pulsation active |
| 4 | FREQUENCY | 220 | Fréquence stable |
| 5 | BROADCAST | 350 | Diffusion en cours |
| 6 | RESONANCE | 520 | Résonance établie |
| 7 | TRANSMISSION | 730 | Transmission ouverte |
| 8 | AMPLITUDE | 1000 | Amplitude maximale |
| 9 | ORBIT | 1350 | En orbite |
| 10 | SUPERNOVA | 1800 | Supernova |

### Glow Up Visuel (Signal Card par palier)

La carte évolue visuellement à chaque palier :

- **Palier 1** : Mate, sombre, bordure gris foncé, pas de badge
- **Palier 2** : Bordure violet subtil, 1 étoile, barcode s'illumine
- **Palier 3** : Stamp "PULSE", étoile pulse, radar score fill léger
- **Palier 4** : Double bordure (violet + cyan), logo archétype apparaît, grain holo sur fond
- **Palier 5** : Bordure gradient animé, badge "BROADCAST" doré, fond texturé
- **Palier 6** : Bordure tricolore, 2ème étoile, logo chrome, barcode iridescent, sheen hover
- **Palier 7** : Glow constant, scanline animée, coins décoratifs, radar gradient fill
- **Palier 8** : Bordure épaisse full spectrum, badge "AMPLITUDE", motif unique par archétype, holo permanent, numéro carte en or
- **Palier 9** : Double glow pulsé, 3ème étoile + anneau orbital, tilt 3D, particules
- **Palier 10** : Glow débordant, couronne/halo, badge SUPERNOVA, full holographique, étoiles connectées en constellation, barcode animé

Chaque palier ajoute des éléments visuels (étoiles, badges, bordures, logos, effets). Le symbole chrome de l'archétype évolue aussi : petit et sombre au palier 1, gros et lumineux au palier 10.

### Sources de XP

- Actions rapides : 10 XP
- Actions moyennes : 25 XP
- Actions fortes : 50 XP
- Actions épiques : 100 XP
- Compléter un Scan : 20 XP
- Compléter le Plan Builder : 30 XP
- Streak 3 jours : 15 XP
- Premier ping collab : 20 XP
- Profil complété 100% : 25 XP

### Features Débloquées

| Palier | Feature |
|--------|---------|
| 1 | Scan d'artiste + Signal Card de base |
| 2 | Plan Builder accessible |
| 3 | Réseau visible (lecture seule) |
| 4 | Ping collab débloqué |
| 5 | Collab Match (profil compatible suggéré) |
| 6 | Re-scan disponible (questions plus profondes) |
| 7 | Profil visible dans le réseau |
| 8 | Badge AMPLITUDE visible par le réseau |
| 9 | Accès page Fréquence |
| 10 | Statut SUPERNOVA — profil featured + badge légendaire |

---

## Assets 3D

### Symboles Chrome (7 archétypes)

- Produits dans Blender, exportés en PNG transparent (2 versions : normale + glow)
- Stockés dans `public/symbols/`
- Intégrés dans les Signal Cards via le composant `ChromeSymbol`
- La version glow est utilisée à partir du palier 6

### Objet Three.js Interactif (Landing)

- 1 objet principal (prisme / symbole HMZ) dans `SceneCanvas`
- Réagit au scroll (profondeur, rotation) et mouse move (tilt)
- Material : MeshStandardMaterial avec envMap chrome
- Performance : lazy load, reduced motion, simplification mobile

### Badges (10 paliers)

- Renders PNG dans `public/badges/`
- Style stamp/seal métallique, progressivement plus détaillés

---

## Conventions de Code

### TypeScript

- Strict mode activé
- Interfaces pour tous les types de données (Archetype, SignalCard, UserProgress, etc.)
- Pas de `any`, utiliser des types explicites

### Composants React

- Functional components uniquement
- Props typées avec interfaces
- Default exports pour les pages, named exports pour les composants
- Pas de logique métier dans les composants — déléguer aux stores et lib/

### Tailwind

- Utiliser les tokens `hmz-*` définis dans tailwind.config.ts
- Pas de valeurs arbitraires sauf exception justifiée
- Composants UI réutilisables dans `components/ui/`
- Les effets complexes (grain, vignette, holo) sont des classes dans `globals.css` @layer components

### Fichiers

- Nommage : PascalCase pour les composants, camelCase pour les hooks/stores/lib
- 1 composant par fichier
- Les composants qui dépassent 150 lignes doivent être découpés

### API Routes

- Toujours valider les inputs
- Toujours vérifier l'auth (sauf network qui est public)
- Retourner des erreurs JSON structurées : `{ error: string, code: string }`
- Utiliser le Supabase server client (pas le browser client)

### Git

- Commits en anglais, format : `feat: add scan wizard` / `fix: radar chart scaling` / `style: signal card glow level 5`
- Branches par phase : `phase/1-backend`, `phase/2-ui`, etc.

---

## Parcours Utilisateurs

### Visiteur froid (ne connaît pas)

Landing → Scan (30 sec) → Signal Card → CTA Plan Builder → Plan Card → Login pour sauvegarder

### Artiste chaud (veut du concret)

Landing → Plan Builder → Plan Card → Contact

### Network seeker

Landing → Réseau → Filtres → Collab Match → Contact

### Utilisateur connecté (dashboard)

Login → Dashboard (carte + XP + actions) → Valider actions → Level up → Nouvelles features débloquées

---

## Règles Importantes

1. **Mobile first** — designer pour mobile d'abord, adapter pour desktop
2. **Performance** — la 3D est lazy loaded, le grain est en CSS pas en canvas, reduced motion respecté
3. **Le Signal Card est le composant le plus important** — c'est lui qui vend le projet en portfolio
4. **Chaque page doit avoir le grain + vignette** — ils sont dans le root layout, persistent entre les pages
5. **Le système de progression est fonctionnel** — les XP, niveaux et badges sont stockés en DB et persistent
6. **Les archétypes ont chacun leur DA propre** — couleur, symbole chrome, motif de fond. Pas de design générique.
7. **Les outputs (Signal Card, Plan Card) sont téléchargeables** en PNG via html2canvas
8. **Le réseau et les preuves sont simulés** — fake data en DB mais l'UI est complète
9. **Le format visuel dominant est le boarding pass / ID card / ticket** — pas des écrans d'app classiques
10. **L'animation BRUIT → SIGNAL est le fil rouge** — grain/static qui se transforme en forme claire, présent sur la landing et comme easter egg
