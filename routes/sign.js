const express = require('express');
const router = express.Router();
const Users = require('../public/javascripts/users.js');
const fs = require('fs');
const users = new Users().load();
const User = require('/dev/oss2021/public/javascripts/user');
// Login handle

router.get('/login', (req,res) => {
    res.render('login');
})

router.get('/register', (req,res) => {
    res.render('register');
})

// Workout handle

router.get('/workout', (req,res) => {
    res.render('workout')
})

// Register handle

router.post('/register', (req,res) => {
    const pseudo = req.body.pseudo;
    const firstname = req.body.firstname;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    //const data = JSON.parse(Data)
    const exist = users.exist(req.body.pseudo);

    if (exist) {
        res.send('Pseudo déjà utilisé');
    } else {
        if (password === password2) {
            const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password);
            users.add(user);
            users.save();
            res.render('login');
        }
    }
})



router.post('/login', (req,res,next) => {
    const pseudo = req.body.pseudo;
    const password = req.body.password;

    if (!users.exist(pseudo)) {
        res.send("Vous n'existez pas");
        return;
    }

    const user = users.get(pseudo);
    if (!user.checkPassword(password)) {
        res.send("Mauvais mot de passe pour "  + pseudo);
        return;
    }

    res.render('accueil');

})

// Logout

router.get('/logout', (req,res) => {
})

module.exports = router


