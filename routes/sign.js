const express = require('express');
const Users = require('../public/javascripts/users.js');
const User = require('../public/javascripts/user');
const Sessions = require('../public/javascripts/sessions.js');
const session = require('express-session');

const router = express.Router();
const users = new Users().load();
const sessions = new Sessions();

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

    const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password, true);

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

    sessions.login(user);


    // const session = sessions.getSession(user)
    // console.log(session.user.pseudo + " vient de se connecter.");
    // req.session.test = 'test'

    res.render('home');
    // , {test: req.session.test}

})

// Logout

router.get('/logout', (req,res) => {
})

router.post('/logout', (req,res) => {

    console.log(req.body.logoutPseudo + ' vient de se déconnecter.')
    res.render('login')
})

// Profiles handle
 
router.get('/home', (req,res) => {
    res.render('home')
})

router.post('/changePassword', (req,res) => {

    const oldPassword = req.body.old;
    const newPassword = req.body.new;
    const newPassword2 = req.body.new2;
    const pseudo = req.body.pseudo;
    const user = users.get(pseudo);
    

    if (user === undefined) {
        res.send('Aucun utilisateur pour le pseudo [' + pseudo + ']');
        return;
    }

    if (newPassword === '' || newPassword2 === '') {
        res.send('Veillez renseigner tout les champs');
        return;
    }

    if (!user.checkPassword(oldPassword)) {
        res.send("Mauvais mot de passe pour "  + pseudo);
        return;
    }

    if (oldPassword === newPassword) {
        res.send('Le mot de passe doit être différent');
        return;
    }

    if (newPassword != newPassword2) {
        res.send('Confirmation de mot de passe incorrect');
        return;
    }

    user.withPassword(newPassword, true);
    users.save();

    res.send('bon')
})

module.exports = router