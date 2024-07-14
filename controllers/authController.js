// Importaciones necesarias
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db'); // Ajusta la ruta según tu estructura de proyecto
const { promisify } = require('util');

// Método para registrar un usuario
exports.register = async (req, res) => {
    try {
        const { name, user, pass } = req.body;
        let passhash = await bcryptjs.hash(pass, 8);
        conexion.query('INSERT INTO user SET ?', { user: user, name: name, pass: passhash }, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// Método para iniciar sesión
exports.login = async (req, res) => {
    try {
        const user = req.body.user;
        const pass = req.body.pass;

        if (!user || !pass) {
            return res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        } else {
            conexion.query('SELECT * FROM user WHERE user = ?', [user], async (error, results) => {
                if (error) {
                    console.log(error);
                    return res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Error en el servidor",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }

                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    return res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    // Inicio de sesión OK
                    const id = results[0].id;
                    const username = results[0].name; // Asegúrate de que tienes un campo 'name' en tu tabla de usuarios
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });
                    console.log("TOKEN: " + token + " para el USUARIO : " + user);

                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRA * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };
                    res.cookie('jwt', token, cookiesOptions);

                    // Redirigir a /repuestos después del inicio de sesión exitoso
                    res.redirect('/repuestos'); // Cambiar la ruta de redirección a '/repuestos'
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error en el servidor",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
};
