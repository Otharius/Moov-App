const express = require('express');
const Users = require('../public/javascripts/users.js');
const User = require('../public/javascripts/user');
const Sessions = require('../public/javascripts/sessions.js');
const Account = require('../public/javascripts/account');
const Accounts = require('../public/javascripts/accouts');
const test = require('../public/javascripts/workout');
const Workouts = require('../public/javascripts/workouts');

const Event = test.Event;
const Seance = test.Seance;
const Preview = test.Preview;
const Jobs = test.Jobs;

const router = express.Router();
const users = new Users().load();
const sessions = new Sessions();
const accounts = new Accounts().load();

// Login handle


router.get('/login', (req,res) => {
    if (req.session === undefined) {
        console.log('Session introuvable dans le login')
    } else {
        console.log('Session trouvable dans login')
    }
    res.render('login', { title: "Login", error: false})
})

router.get('/register', (req,res) => {
    res.render('register', { title: "Register", error: false});
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
        res.render('register', { title: "Register", message: "Veillez renseigner tout les champs", error: true})
        return;
    }

    if (users.exist(pseudo)) {
        res.render('register', { title: "Register", message: "Pseudo déjà utilisé", error: true})
        return;
    }

    if (password != password2) {
        res.render('register', { title: "Register", message: "Mots de passe différents", error: true})
        return;
    }

    const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password, true);
    const account = new Account(pseudo, 0, 0);
    const workout = new Jobs("Ajourd'hui", 0, false, 'no', 2, 'no', 'pompe', 5, 10, 1);
    const workouts = new Workouts().load(pseudo, false);

    users.add(user);
    users.save(user.pseudo);
    accounts.add(account);
    accounts.save();
    workouts.add(workout);
    workouts.save(pseudo);

    res.render('login', { title: "Login", error: false});
})

router.post('/login', (req,res) => {

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
        res.render('login', { title: "Login", message: "Mauvais mot de passe incorrect", error: true });
        return;
    }


    sessions.login(user);
    console.log(user.pseudo + " vient de se connecter");
    const data = require('../data/account.json');
    res.render('home', { title: "Home", calorie: data.calorie } );
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
    res.render('home', { title: "Home"})
})

router.post('/changePassword', (req,res) => {

    const oldPassword = req.body.old;
    const newPassword = req.body.new;
    const newPassword2 = req.body.new2;
    const pseudo = req.body.pseudo;
    const user = users.get(pseudo);

    if (user === undefined) {
        res.render('Profiles', { title: "Profiles", error: true, message: 'Aucun utilisateur pour le pseudo [' + pseudo + ']'})
        return;
    }

    if (newPassword === '' || newPassword2 === '') {
        res.render('Profiles', { title: "Profiles", error: true, message: "Veillez renseigner tout les champs"})
        return;
    }

    if (!user.checkPassword(oldPassword)) {
        res.render('Profiles', { title: "Profiles", error: true, message: "Mauvais mot de passe pour " + pseudo})
        return;
    }

    if (oldPassword === newPassword) {
        res.render('Profiles', { title: "Profiles", error: true, message: "Le mot de passe doit être différent de l'ancien"})
        return;
    }

    if (newPassword != newPassword2) {
        res.render('Profiles', { title: "Profiles", error: true, message: "Confirmation de mot de passse incorrect"})
        return;
    }

    user.withPassword(newPassword, true);
    users.save();
    res.render('profiles', { title: "Profiles", error: false})
})

module.exports = router