const express = require('express');
const Users = require('../public/javascripts/users.js');
const User = require('../public/javascripts/user');

const router = express.Router();
const users = new Users().load();

// Login handle

router.get('/login', (req,res) => {
    res.render('login');
})

router.get('/register', (req,res) => {
    res.render('register');
})


// Register handle

router.post('/register', (req,res) => {

    const pseudo = req.body.pseudo;
    const firstname = req.body.firstname;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    if  (pseudo === '' || firstname === '' || name === '' || email === '' || password === '' || password2 === '') {
        res.send('Veillez renseigner tout les champs');
        return;
    }

    if (users.exist(pseudo)) {
        res.send('Pseudo déjà utilisé');
        return;
    }

    if (password != password2) {
        res.send('Mots de passe differents');
        return;
    }

    const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password);
    users.add(user);
    users.save();
    res.render('login');

})

router.post('/login', (req,res,next) => {

    const pseudo = req.body.pseudo;
    const password = req.body.password;

    if (pseudo === '' || password === '') {
        res.send('Veillez renseigner tout les champs');
        return;
    }

    if (!users.exist(pseudo)) {
        res.send("Vous n'existez pas");
        return;
    }

    const user = users.get(pseudo);
    if (!user.checkPassword(password)) {
        res.send("Mauvais mot de passe pour "  + pseudo);
        return;
    }

    res.render('home');

})

// Logout

router.get('/logout', (req,res) => {
})

module.exports = router


