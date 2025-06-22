# Formulaire IvoirTech - Panelistes

Application de gestion des panelistes pour le Ministère de la Transition Numérique et de la Digitalisation.

## Structure du projet

- `frontend/` : Application React (gérée par Vite)
- `backend/` : Serveur Node.js avec SQLite

## Prérequis

- Node.js v18+
- npm v9+

## Installation

### Frontend

```bash
cd ivoirtech-form
npm install
```

### Backend 

```bash
cd ivoirtech-form/backend
npm install
```

## Lancement

### En développement

1. Démarrer le backend :
```bash
cd ivoirtech-form/backend
npm run server
```

2. Démarrer le frontend (dans un autre terminal) :
```bash
cd ivoirtech-form
npm run dev
```

### En production

1. Build du frontend :
```bash
cd ivoirtech-form
npm run build
```

2. Démarrer le backend :
```bash
cd ivoirtech-form/backend
npm start
```

## Accès

- Frontend : http://http://localhost/:5173
- Backend : http://http://localhost/:3001
- Admin : http://http://localhost/:5173/admin

## Variables d'environnement

Créer un fichier `.env` à la racine avec :

```ini
# Frontend
VITE_API_URL=http://http://localhost/:3001

# Backend
PORT=3001
DATABASE_FILE=./database.db
```

## Documentation API

Le backend expose les endpoints suivants :

- `POST /api/check-email` : Vérifie si un email existe déjà
- `POST /api/submit-form` : Soumet un nouveau formulaire
