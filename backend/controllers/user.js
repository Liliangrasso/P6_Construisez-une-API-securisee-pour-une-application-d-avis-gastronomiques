/*** IMPORTATIONS ****/
const bcrypt = require('bcrypt')
const User = require('../model/User')
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    /*** Hachage du mail et du mot de passe ***/
    bcrypt.hash(req.body.email, 10)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: hash,
                password: hash
            })
            /*** Sauvegarde de l'email et du mot de passe utilisateur ***/
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créer'}))
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({error}))
}

exports.login = (req, res, next) => {
    /*** Recherche de l'utilisateur ***/
    User.findOne({ user: req.body.user })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            /*** Comparaison des hash pour le mot de passe ***/
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    /*** Envoie de l'id utilisateur et du token de session ***/
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
