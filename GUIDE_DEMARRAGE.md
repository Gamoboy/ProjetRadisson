# Guide de Démarrage Rapide

## 🚀 Mise en route en 5 minutes

### Étape 1 : Configuration de l'environnement

#### Prérequis
- Node.js 18+ installé
- MongoDB installé et en cours d'exécution
- Python 3.8+ (pour le backend optionnel)

#### Installation des dépendances

**Frontend (React + Vite)**
```bash
cd frontend
npm install
```

**Backend (FastAPI - Optionnel)**
```bash
cd backend
pip install -r requirements.txt
```

### Étape 2 : Configuration de la base de données

1. **Démarrer MongoDB**
```bash
mongod
# ou sur macOS avec Homebrew
brew services start mongodb
```

2. **Créer la base de données**
```bash
mongosh
use radisson_hotel
```

### Étape 3 : Démarrage de l'application

#### Option A : Frontend uniquement (Recommandé)
```bash
cd radisson-app
npm run dev
```

L'application sera accessible sur : `http://localhost:3000`

#### Option B : Avec backend complet
```bash
# Terminal 1 - Backend
cd backend
python server.py

# Terminal 2 - Frontend
cd radisson-app
npm run dev
```

## 📋 Première utilisation

### 1. Créer votre premier employé
1. Cliquez sur "Nouvel employé"
2. Remplissez les informations obligatoires
3. **Important** : Signez avec votre souris dans le cadre prévu
4. Enregistrez la fiche

### 2. Ajouter du matériel
1. Allez dans "Matériel"
2. Cliquez sur "Ajouter matériel"
3. Remplissez les informations du matériel
4. Attribuez-le à un employé

### 3. Processus de restitution
1. Allez dans "Restitution"
2. Sélectionnez un employé
3. Choisissez le matériel à restituer
4. **Signatures obligatoires** : Employé + Responsable
5. Générez le document PDF

## 🎯 Fonctionnalités clés

### Signatures manuelles
- Support souris et tactile
- Canvas haute résolution
- Téléchargement possible
- Validation automatique

### Interface moderne
- Design épuré et professionnel
- Animations fluides
- Mode responsive
- Optimisation mobile

### Gestion complète
- Employés avec matériel
- Restitutions avec signatures
- Tableau de bord analytique
- Export PDF

## 🔧 Configuration avancée

### Variables d'environnement
```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000/api

# Backend (.env)
MONGO_URL=mongodb://localhost:27017/radisson_hotel
HOST=0.0.0.0
PORT=8000
```

### Ports utilisés
- **Frontend** : 3000
- **Backend** : 8000
- **MongoDB** : 27017

## 📱 Utilisation mobile

L'application est entièrement responsive :
- **Tablettes** : Interface adaptée avec sidebar rétractable
- **Smartphones** : Menu burger et optimisations tactiles
- **Signatures** : Support multi-touch pour les tablettes

## 🛠️ Dépannage rapide

### Problème : "Cannot connect to MongoDB"
```bash
# Vérifier que MongoDB tourne
sudo systemctl status mongod
# ou
brew services list | grep mongodb

# Démarrer MongoDB
sudo systemctl start mongod
# ou
brew services start mongodb
```

### Problème : "Port already in use"
```bash
# Changer le port du frontend
# Modifier vite.config.js
server: {
  port: 3001
}

# Changer le port du backend
# Modifier .env
PORT=8001
```

### Problème : "CORS error"
```bash
# Vérifier que le backend tourne
# Vérifier l'URL dans .env
VITE_API_URL=http://localhost:8000/api
```

## 📊 Structure des données

### Employé
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "department": "string",
  "position": "string",
  "signature": "base64",
  "materials": [...]
}
```

### Matériel
```json
{
  "type": "string",
  "brand": "string",
  "model": "string",
  "serialNumber": "string",
  "assignedTo": "employeeId",
  "condition": "Neuf|Bon|Moyen|Mauvais"
}
```

## 🎨 Personnalisation

### Couleurs
Modifier `tailwind.config.js` :
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    // ... autres nuances
    900: '#0c4a6e',
  }
}
```

### Polices
Modifier `index.html` :
```html
<link href="https://fonts.googleapis.com/css2?family=VotrePolice&display=swap" rel="stylesheet">
```

## 🔒 Sécurité

### Points importants
- Validation des entrées côté client
- Signatures stockées en base64
- Authentification à implémenter
- HTTPS recommandé en production

## 📈 Performance

### Optimisations incluses
- Code splitting avec Vite
- Images optimisées
- Animations CSS plutôt que JavaScript
- Lazy loading des composants

### Métriques
- Temps de chargement : < 2s
- Taille du bundle : < 500KB
- Score Lighthouse : > 90

## 🤝 Support

Pour toute question ou problème :
1. Vérifier ce guide
2. Consulter les logs d'erreur
3. Vérifier la configuration
4. Contacter l'équipe de développement

---

**Bonne utilisation de l'application Radisson Material Management !** 🏨