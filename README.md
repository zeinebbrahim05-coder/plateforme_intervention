# Plateforme Intelligente de Gestion des Interventions Techniques

Application web de gestion des interventions techniques, mettant en relation clients, techniciens et planificateur autour d'un moteur d'affectation automatique intelligent.

## Fonctionnalités principales

### Client
- Création d'une demande d'intervention (description, adresse, priorité)
- Partage de sa position GPS
- Suivi du statut de ses tickets et interventions
- Consultation du rapport technique et évaluation de l'intervention (note + commentaire)

### Technicien
- Consultation de ses interventions assignées
- Mise à jour du statut d'une intervention
- Rédaction d'un rapport d'intervention
- Gestion de sa disponibilité et partage de sa position GPS

### Planificateur
Interface dédiée organisée en plusieurs vues :
- **Tableau de bord** — statistiques en temps réel (tickets en attente, urgents, techniciens disponibles, interventions terminées)
- **Tickets** — recherche, filtres, affectation manuelle ou automatique d'un technicien
- **Interventions** — suivi et modification de statut
- **Clients / Techniciens** — gestion complète (création, modification, suppression), y compris compétences et disponibilité des techniciens
- **Planning** — vue calendrier semaine/mois des interventions programmées, avec filtres par technicien, statut et recherche, et visualisation de la charge de travail par technicien
- **Carte** — visualisation en temps réel de la position des clients et techniciens

## Moteur d'affectation automatique

Lorsqu'une intervention est affectée automatiquement, le système calcule un score pondéré pour chaque technicien disponible, basé sur :
- La **distance** entre le client et le technicien (formule de Haversine)
- La **correspondance des compétences** entre le technicien et la description de l'intervention
- La **charge de travail actuelle** du technicien (nombre d'interventions non terminées)
- La **priorité** de l'intervention (les tickets urgents privilégient la rapidité de réponse)

Le technicien avec le meilleur score est automatiquement affecté ; sa disponibilité passe alors à `false` et redevient `true` une fois l'intervention terminée.

## Stack technique

- **Frontend** : React (Vite), React Router, Axios, React-Leaflet
- **Backend** : Node.js, Express
- **Base de données** : MySQL
- **Authentification** : JWT + bcrypt
- **Cartographie** : Leaflet / OpenStreetMap

## Installation

### Prérequis
- Node.js (v18+)
- MySQL

### Backend

```bash
cd backend
npm install
```

Crée un fichier `.env` à la racine de `backend/` :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<ton_mot_de_passe_mysql>
DB_NAME=plateforme_intervention
JWT_SECRET=<une_chaine_secrete>
PORT=3000
```

Initialise la base de données :
```bash
mysql -u root -p < bd.sql
```

Lance le serveur :
```bash
npm run dev
```

### Frontend

```bash
cd frontend/plateforme_inter
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Planificateur | admin@plateforme.com | admin123 |
| Client | ahmed@test.com | client123 |
| Technicien | karim@test.com | tech123 |

## Structure du projet

```
plateforme_intervention/
├── backend/
│   └── src/
│       ├── controllers/        # Logique métier (auth, users, tickets, interventions, techniciens)
│       ├── models/             # Accès base de données
│       ├── routes/             # Définition des endpoints API
│       ├── middleware/         # Authentification (JWT), autorisation par rôle
│       ├── utils/              # Calcul de distance (Haversine), scoring d'affectation
│       └── config/             # Connexion base de données
├── frontend/plateforme_inter/
│   └── src/
│       ├── pages/
│       │   ├── planificateur/  # Tableau de bord, Tickets, Interventions, Clients, Techniciens, Planning, Carte
│       │   ├── DashboardClient.jsx
│       │   ├── DashboardTechnicien.jsx
│       │   ├── login.jsx
│       │   └── register.jsx
│       ├── components/         # Header, Map, Sidebar, WeekGrid, MonthGrid, UserModal, StatsCards, etc.
│       ├── hooks/               # Hooks réutilisables (partage de position GPS)
│       ├── services/             # Client API (Axios)
│       └── styles/               # Feuilles de style (design system planificateur, planning, dashboards)
└── bd.sql                        # Schéma de la base de données
```

## Endpoints API principaux

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET / POST / PUT / DELETE | `/api/users` | CRUD utilisateurs |
| GET / POST | `/api/tickets` | Gestion des tickets |
| GET / POST / PUT | `/api/interventions` | Gestion des interventions |
| POST | `/api/interventions/auto-affecter/:ticketId` | Affectation automatique |
| GET | `/api/interventions/planning/semaine` \| `/mois` | Données du planning |
| GET / PUT | `/api/techniciens` | Liste des techniciens, disponibilité |

## Qualité de code

Le projet passe `eslint` sans erreur bloquante (`npm run lint` dans `frontend/plateforme_inter`).

## Auteur

Zeineb Ben Brahim
