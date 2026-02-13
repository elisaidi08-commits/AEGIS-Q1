# CLAUDE.md — Aegis Bank API

## Projet
Aegis Bank est une néobanque fictive ciblant les 16-25 ans (Gen Z).
Ce repo contient le backend API REST uniquement.
Le frontend est développé séparément avec Google Antigravity.

## Stack
- Node.js 18+ / Express.js
- SQLite via better-sqlite3
- JWT pour l'authentification
- Swagger UI pour la documentation API (/api-docs)
- express-validator pour la validation

## Conventions
- Réponses API : { success: true/false, data: {...}, error: {...} }
- Montants stockés en centimes (INTEGER), retournés en euros (REAL)
- Tous les endpoints protégés nécessitent le header : Authorization: Bearer <token>
- Documentation Swagger en anglais, données seed en français
- IBAN et numéros de carte toujours fictifs

## Scripts
- npm run dev → serveur en développement (nodemon)
- npm start → serveur en production
- npm run seed → injecter les données fictives

## Structure
src/server.js = point d'entrée
src/config/ = database + swagger
src/middleware/ = auth, validation, erreurs
src/routes/ = définition des routes
src/controllers/ = logique métier
src/seed/ = données fictives

## Utilisateur de démo
- Email : eli@aegisbank.io
- Mot de passe : demo1234
