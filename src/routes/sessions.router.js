const express = require('express');
const router = express.Router();
const { userModel } = require('../models/user.model');

//Renderizar vista de registro
router.get("/register", (req, res) => {
    try {
        res.render("register.handlebars")
    } catch (error) {
        res.status(500).send("Error de presentación.")
    }
})

//Renderizar vista de login
router.get("/", (req, res) => {
    try {
        res.render("login.handlebars")
    } catch (error) {
        res.status(500).send("Error de presentación.")
    }
})

//Renderizar vista del perfil una vez logeado
router.get('/profile', (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/');
        }

        let { first_name, last_name, email, age, role } = req.session.user;

        res.render('profile.handlebars', {
            first_name, last_name, email, age, role
        });

    } catch (error) {
        res.status(500).send("Error de presentación.")
    }
});


//Destruir session
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/')
        } else {
            res.send("Error al intentar salir.")
        }
    })
})


//Registrar usuario
router.post("/register", async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send('Faltan datos.');
        }

        let user = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        })

        //Rol de admin según consigna del desafío
        if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
            user.role = "admin"
            await userModel.updateOne({ _id: user._id }, user);
        }

        res.redirect("/")

    } catch (error) {
        res.status(500).send("Error de registro.")
    }
})


//Logearse
router.post('/', async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ status: "error", error: "valores incorrectos" })

        let user = await userModel.findOne({ email: email })

        if (!user) return res.status(400).send({ status: "error", error: "usuario no encontrado" })

        if (password != user.password) {
            return res.status(400).send("Contraseña incorrecta.")
        }

        req.session.user = user

        res.redirect("/profile")

    } catch (error) {
        res.status(500).send("Error de login.")
    }
});

module.exports = router;