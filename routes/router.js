const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')


//rutas para las vistas

router.get('/', (req, res) => {res.render('index');});
router.get('/posventa', (req, res) => {res.render('posventa');});
router.get('/modelos', (req, res) => {res.render('modelos');});
router.get('/repuestos', (req, res) => {res.render('repuestos');});
router.get('/contratos', (req, res) => {res.render('contratos');});
router.get('/contacto', (req, res) => {res.render('contacto');});

router.get('/login', (req, res) => {
    console.log('Ruta de login accedida.');
    res.render('login',{alert:false});
});

router.get('/register', (req, res) => {
    res.render('register');
});
console.log('Rutado2 de prueba configurada.');

// rutas para los metodos del controllers

router.post('/register' , authController.register)
router.post('/login' , authController.login)
module.exports = router



