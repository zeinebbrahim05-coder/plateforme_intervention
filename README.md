# Plateforme Intelligente de Gestion des Interventions Techniques

Application web de gestion des interventions techniques, mettant en relation clients, techniciens et planificateur autour d'un moteur d'affectation automatique intelligent.

## Fonctionnalités principales

- **Client** : création de demande d'intervention (avec géolocalisation), suivi du statut, historique, évaluation du service
- **Technicien** : consultation de ses interventions, mise à jour du statut, rédaction de rapports, gestion de sa disponibilité et de sa position
- **Planificateur** : gestion des utilisateurs (clients/techniciens), affectation manuelle ou automatique des interventions, carte interactive en temps réel, suivi de l'avancement, consultation des rapports

## Moteur d'affectation automatique

Lorsqu'une intervention est affectée automatiquement, le système calcule un score pondéré pour chaque technicien disponible, basé sur :
- La distance entre le client et le technicien (formule de Haversine)
- La correspondance entre les compétences du technicien et la description de l'intervention
- La charge de travail actuelle du technicien (nombre d'interventions en cours)
- La priorité de l'intervention (les tickets urgents privilégient la rapidité de réponse)

Le technicien avec le meilleur score est automatiquement affecté.

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
cd frontend
npm install
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| Planificateur | admin@plateforme.com | admin123 |
| Client | ahmed@test.com | client123 |
| Client | sami@test.com | sami123 |
| Technicien | karim@test.com | tech123 |
| Technicien | amine@test.com | amine123 |

## Structure du projet

```
plateforme_intervention/
├── backend/
│   └── src/
│       ├── controllers/    # Logique métier (auth, users, tickets, interventions)
│       ├── models/         # Accès base de données
│       ├── routes/         # Définition des endpoints API
│       ├── middleware/     # Authentification (JWT), autorisation par rôle
│       ├── utils/          # Calcul de distance, scoring d'affectation
│       └── config/         # Connexion base de données
├── frontend/
│   └── src/
│       ├── pages/          # Dashboards (Client, Technicien, Planificateur), Login, Register
│       ├── components/     # Header, Map, UserTable, UserModal, StatsCards, etc.
│       ├── hooks/          # Hooks réutilisables (partage de position GPS)
│       └── services/       # Client API (Axios)
└── bd.sql                  # Schéma de la base de données
```

## Améliorations possibles

- Planification avec date/horaire prévu pour chaque intervention
- Rapport technique structuré (champs séparés : type, matériel utilisé, durée, etc.)
- Notifications en temps réel pour le client
