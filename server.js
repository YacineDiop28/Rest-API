// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
// importer le modèle User
const { User } = require('./models/user');

// Configurer dotenv pour utiliser les variables d'environnement

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {})
.then(() => {
    console.log('Connecté à MongoDB');
})
.catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
});

// Middleware
app.use(express.json());



//  retourner tous les utilisateurs
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});
// ajouter un utilisateur
app.post('/new-user', async (req, res) => {
    const { name, email, age } = req.body;
    const user = new User({ name, email, age });
    await user.save();
    res.json(user);
});
//  ÉDITER UN UTILISATEUR PAR ID
app.put('/users/:id', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email, age }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});
// SUPPRIMER UN UTILISATEUR PAR ID
app.delete('/users/:id', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
}
);
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});