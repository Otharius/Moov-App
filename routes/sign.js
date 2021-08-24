const express = require('express');
const Users = require('../public/javascripts/users.js');
const User = require('../public/javascripts/user');
const Sessions = require('../public/javascripts/sessions.js');

const router = express.Router();
const users = new Users().load();
const sessions = new Sessions();
// Login handle

router.get('/login', (req,res) => {
    console.log(req.session)
    if (req.session === undefined) {
        console.log('Session introuvable dans le login')
    } else {
        console.log('Session trouvable dans login')
    }
    res.render('login', { title: "Login", error: false})
})

router.get('/register', (req,res) => {
    res.render('register', { title: "Register"});
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
    console.log(req.session)
    res.render('login', { title: "Login"});
})

router.post('/login', (req,res,next) => {

    //const sess = req.session;
    const pseudo = req.body.pseudo;
    const password = req.body.password;

    if (pseudo === '' || password === '') {
        res.render('login', { title: "Login", message: "Veillez renseigner tout les champs", error: true})
        return;
    }

    if (!users.exist(pseudo)) {
        res.render('login', { title: "Login", message: "Utilisateur introuvable", error: true})
        return;
    }

    const user = users.get(pseudo);
    if (!user.checkPassword(password)) {
        res.render('login', { title: "Login", message: "Mauvais mot de passe incorrect", error: true});
        return;
    }

    sessions.login(user);
    // const session = sessions.getSession(user)
    // console.log(session.user.pseudo + " vient de se connecter.");

    res.render('home', { title: "Home"} );
})

// Logout

router.get('/logout', (req,res) => {
})

router.post('/logout', (req,res) => {

    console.log(req.body.logoutPseudo + ' vient de se déconnecter.')
    res.render('login', { title: "Login", error: false})
})

// Profiles handle
 
router.get('/home', (req,res) => {
    console.log('yes')
    res.render('home', { title: "Home"})
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
    res.render('profiles')
})

module.exports = router