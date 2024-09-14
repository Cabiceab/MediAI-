const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const Joi = require('joi');

const router = express.Router();

const schema = Joi.object({
    nombre: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

router.post('/register', async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { nombre, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).send('Error registrando usuario');
        }
        res.status(200).send('Usuario registrado con éxito');
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).send('Error en la base de datos');

        if (results.length > 0) {
            const user = results[0];
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (isValidPassword) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.status(200).json({ token });
            } else {
                res.status(401).send('Contraseña incorrecta');
            }
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});

module.exports = router;
