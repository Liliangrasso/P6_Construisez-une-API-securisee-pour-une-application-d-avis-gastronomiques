/*** IMPORTATIONS ****/
const jwt = require('jsonwebtoken');

/*** Auth ****/
module.exports = (req, res, next) => {
    try {
        /*** Extraction du token dans le header ***/
        const token = req.headers.authorization.split(' ')[1];
        /*** On decode le token ***/
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        /*** Extraction de l'id utilisateur depuis le token ***/
        const userId = decodedToken.userId;
        /*** Comparaison des id ***/
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};