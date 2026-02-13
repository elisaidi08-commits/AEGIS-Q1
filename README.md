# Aegis Bank API

API REST pour **Aegis Bank**, une neobanque fictive ciblant les 16-25 ans (Gen Z).

## Stack technique

- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de donnees** : SQLite via better-sqlite3
- **Auth** : JWT (jsonwebtoken) + bcryptjs
- **Documentation** : Swagger UI (swagger-jsdoc + swagger-ui-express)
- **Validation** : express-validator

## Installation

```bash
# Installer les dependances
npm install

# Creer le fichier .env (si pas present)
echo "PORT=3000\nJWT_SECRET=aegis-bank-secret-key-2026\nJWT_EXPIRES_IN=7d" > .env

# Lancer le seed (donnees fictives)
npm run seed

# Lancer le serveur en dev
npm run dev
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur en developpement (nodemon) |
| `npm start` | Serveur en production |
| `npm run seed` | Injecter les donnees fictives |

## Documentation API

Swagger UI disponible sur : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Endpoints

### Auth (`/api/auth`)
| Methode | Route | Description |
|---|---|---|
| POST | `/register` | Inscription |
| POST | `/login` | Connexion (retourne JWT) |
| POST | `/refresh` | Rafraichir le token |
| POST | `/forgot-password` | Reset mot de passe (fictif) |
| POST | `/logout` | Deconnexion |

### Users (`/api/users`)
| Methode | Route | Description |
|---|---|---|
| GET | `/me` | Profil utilisateur |
| PUT | `/me` | Modifier profil |
| PUT | `/me/password` | Changer mot de passe |
| DELETE | `/me` | Supprimer compte |

### Accounts (`/api/accounts`)
| Methode | Route | Description |
|---|---|---|
| GET | `/` | Details du compte |
| GET | `/summary` | Resume mensuel |

### Transactions (`/api/transactions`)
| Methode | Route | Description |
|---|---|---|
| GET | `/` | Liste paginee + filtres |
| GET | `/:id` | Detail d'une transaction |
| POST | `/transfer` | Nouveau virement |
| POST | `/request` | Demander de l'argent |
| GET | `/stats` | Statistiques |

### Cards (`/api/cards`)
| Methode | Route | Description |
|---|---|---|
| GET | `/` | Liste des cartes |
| POST | `/` | Creer carte virtuelle |
| PUT | `/:id` | Modifier parametres |
| PUT | `/:id/freeze` | Geler/degeler |
| PUT | `/:id/block` | Bloquer definitivement |

### Savings (`/api/savings`)
| Methode | Route | Description |
|---|---|---|
| GET | `/` | Objectifs d'epargne |
| POST | `/` | Creer un objectif |
| PUT | `/:id` | Modifier un objectif |
| POST | `/:id/deposit` | Deposer |
| POST | `/:id/withdraw` | Retirer |
| DELETE | `/:id` | Supprimer |

### Referrals (`/api/referrals`)
| Methode | Route | Description |
|---|---|---|
| GET | `/` | Mes parrainages |
| POST | `/invite` | Envoyer invitation |

### Notifications (`/api/notifications`)
| Methode | Route | Description |
|---|---|---|
| GET | `/` | Liste des notifications |
| PUT | `/:id/read` | Marquer comme lue |
| PUT | `/read-all` | Tout marquer comme lu |

## Tester l'API

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"eli@aegisbank.io","password":"demo1234"}'

# Utiliser le token retourne
curl http://localhost:3000/api/accounts \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

## Utilisateur de demo

- **Email** : eli@aegisbank.io
- **Mot de passe** : demo1234

## Frontend

Le frontend (HTML/CSS) est dans le dossier `AEGIS BANK/`.
Demo Netlify : https://leafy-cocada-121f1f.netlify.app/
