const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
console.log('Iniciando la configuración del servidor...');

// Seteamos el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('Motor de plantillas configurado.');

// Seteamos la carpeta public para archivos estáticos
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
console.log('Middlewares configurados.');

// Seteamos las variables de entorno
dotenv.config({ path: './env/.env' });
console.log('Variables de entorno configuradas.');

// Seteamos las cookies
app.use(cookieParser());
console.log('Parser de cookies configurado.');

// Llamar al enrutador
app.use('/', require('./routes/router'));
console.log('Enrutador configurado.');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
