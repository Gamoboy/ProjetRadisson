# Radisson Hotel - Gestion de Matériel

Application web moderne pour la gestion des fiches de matériel et des processus de restitution pour l'Hôtel Radisson.

## Fonctionnalités principales

### ✅ Optimisations réalisées
- **Structure optimisée** : Suppression des fichiers inutiles et conservation uniquement des éléments essentiels
- **Design moderne** : Interface épurée avec animations et effets visuels
- **Signatures manuelles** : Support complet des signatures à la souris et au tactile
- **Application standalone** : Frontend autonome avec connexion API MongoDB
- **Performance améliorée** : Utilisation de Vite au lieu de Create React App

### 🎨 Nouveau design moderne
- **Palette de couleurs** : Bleu profond et touches d'or
- **Typographie** : Police Inter pour une meilleure lisibilité
- **Animations** : Effets de survol, transitions fluides
- **Responsive design** : Adaptation mobile et tablette
- **Glass morphism** : Effets de transparence et flou

### ✍️ Signatures manuelles
- **Canvas interactif** : Support souris et tactile
- **Haute résolution** : Optimisé pour les écrans Retina
- **Téléchargement** : Possibilité de télécharger les signatures
- **Validation** : Vérification de la présence des signatures

## Structure du projet

```
radisson-app/
├── src/
│   ├── components/          # Composants React
│   │   ├── EmployeeForm.jsx
│   │   ├── EmployeeFlow.jsx
│   │   ├── MaterialManagement.jsx
│   │   ├── RestitutionProcess.jsx
│   │   ├── EmployeeRestitutionPage.jsx
│   │   ├── Layout.jsx
│   │   └── SignatureCanvas.jsx
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── .env
```

## Installation et démarrage

### Prérequis
- Node.js 18+
- npm ou yarn
- MongoDB (pour le backend)

### Installation

1. **Cloner le projet**
```bash
cd radisson-app
npm install
```

2. **Configuration**
Remplir le fichier `.env` avec vos paramètres :
```env
VITE_API_URL=http://localhost:8000/api
MONGO_URL=mongodb://localhost:27017/radisson_hotel
```

3. **Démarrage**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Backend API

L'application nécessite un backend API. Voici les endpoints requis :

### Employés
- `GET /api/employees` - Liste des employés
- `GET /api/employees/:id` - Détails d'un employé
- `POST /api/employees` - Créer un employé
- `PUT /api/employees/:id` - Mettre à jour un employé
- `DELETE /api/employees/:id` - Supprimer un employé

### Matériel
- `GET /api/materials` - Liste du matériel
- `POST /api/materials` - Créer un matériel
- `PUT /api/materials/:id` - Mettre à jour un matériel
- `DELETE /api/materials/:id` - Supprimer un matériel

### Statistiques
- `GET /api/stats` - Statistiques du tableau de bord

### Signatures
- `POST /api/signatures` - Sauvegarder une signature
- `GET /api/signatures/:id` - Récupérer une signature

## Utilisation

### 1. Tableau de bord
- Vue d'ensemble des statistiques
- Recherche rapide d'employés
- Activité récente

### 2. Gestion des employés
- Création de fiches employés
- Modification des informations
- Attribution de matériel
- **Signatures manuelles** obligatoires

### 3. Gestion du matériel
- Ajout de nouveaux équipements
- Attribution aux employés
- Suivi de l'état du matériel

### 4. Processus de restitution
- Interface employé simplifiée
- Sélection du matériel à restituer
- **Double signature** (employé + responsable)
- Génération de documents PDF

## Technologies utilisées

### Frontend
- **React 18** avec hooks
- **Vite** pour le bundling et le dev server
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Lucide React** pour les icônes
- **Axios** pour les requêtes API

### Backend (à implémenter)
- **FastAPI** ou **Node.js/Express**
- **MongoDB** pour la base de données
- **Motor** pour l'async MongoDB (Python)

## Améliorations futures

### Phase 1 : Optimisation
- ✅ Suppression des fichiers inutiles
- ✅ Refonte du design
- ✅ Signatures manuelles
- ✅ Conversion en standalone

### Phase 2 : Fonctionnalités avancées
- [ ] Génération de PDF avec signatures
- [ ] Export des données (CSV, Excel)
- [ ] Notifications email automatiques
- [ ] Historique complet des restitutions
- [ ] Tableau de bord analytique

### Phase 3 : Sécurité et performance
- [ ] Authentification JWT
- [ ] Gestion des rôles et permissions
- [ ] Chiffrement des signatures
- [ ] Cache et optimisation des requêtes
- [ ] Tests unitaires et d'intégration

## Support et maintenance

### Bonnes pratiques
- Sauvegardes régulières de la base de données
- Mise à jour des dépendances
- Monitoring des performances
- Tests avant déploiement

### Dépannage
- Vérifier la connexion MongoDB
- Valider la configuration CORS
- Vérifier les permissions de fichiers
- Consulter les logs d'erreur

## Licence

Projet interne Radisson Hotel - Tous droits réservés.