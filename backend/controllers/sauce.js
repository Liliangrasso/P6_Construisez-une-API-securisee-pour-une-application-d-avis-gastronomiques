/*** IMPORTATIONS ****/
const Sauce = require('../model/Sauce');
const fs = require('fs');

/*** Logique métier des sauces ****/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    const sauce = new Sauce({
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        heat: req.body.heat,
        like: req.body.like,
        dislike: req.body.dislike,
        mainPepper: req.body.mainPepper,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        userId: req.body.userId
    });
    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce modifié!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

/*** Logique métier du systeme Like / Dislike ****/

exports.like = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                /*** Dislike ***/
                case -1:
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes++;
                    break;
                /*** Like ***/
                case 1:
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes++;
                    break;
                /*** Changement d'avis ***/
                // 1. Annulation du vote pour la sauce
                // 2. On cherche l'id dans les tableaux liked et disliked
                // 3. Suppression de l'id dans le tableau concerné
                // 4. Puis -1 dans le compteur correspondant
                default:
                    let index = sauce.usersLiked.indexOf(req.body.userId);
                    if (index >= 0) {
                        sauce.usersLiked.splice(index);
                        sauce.likes--;
                    } else {
                        index = sauce.usersDisliked.indexOf(req.body.userId);
                        if (index >= 0) {
                            sauce.usersDisliked.splice(index);
                            sauce.dislikes--;
                        }
                    }
            }
            /*** Mise à jour des likes/dislikes ***/
            Sauce.updateOne({ _id: req.params.id }, {
                _id: req.params.id,
                likes: sauce.likes,
                dislikes: sauce.dislikes,
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked
            })
                .then(() => res.status(200).json({ message: "Sauce modifiée." }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};