const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middlewares/auth');

router.get('/', (req, res) => res.render('login'));
router.post('/logado', userController.login);
router.get('/logado', ensureAuthenticated, (req, res) => userController.login(req, res));
router.get('/registro', (req, res) => res.render('registro'));
router.post('/registro', userController.register);
router.get('/logout', userController.logout);
router.get('/dashboard', ensureAuthenticated, userController.dashboard);
router.get('/chat', ensureAuthenticated, (req, res) => res.render('chat'));
router.get('/criarAtividade', ensureAuthenticated, (req, res) => res.render('criacao'));
router.post('/criarAtividade', userController.criarAtividade);


router.delete('/delete/:id', ensureAuthenticated, userController.deletarAtividade);


router.get('/listarAtividades', ensureAuthenticated, userController.listarAtividades);

router.get('/editarAtividade/:id', ensureAuthenticated, userController.editarAtividade);

router.post('/editarAtividade/:id', ensureAuthenticated, userController.atualizarAtividade);

module.exports = router;
