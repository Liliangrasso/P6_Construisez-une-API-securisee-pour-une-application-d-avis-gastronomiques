/*** IMPORTATIONS ****/
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const SauceCtrl = require('../controllers/sauce');

/*** Routes ****/
router.get('/', auth, SauceCtrl.getAllSauce);
router.post('/', auth, multer, SauceCtrl.createSauce);
router.get('/:id', auth, SauceCtrl.getOneSauce);
router.put('/:id', auth, SauceCtrl.modifySauce);
router.delete('/:id', auth, SauceCtrl.deleteSauce);
router.post('/:id/like', auth, SauceCtrl.like);
module.exports = router;