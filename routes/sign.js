const express = require('express');
const Users = require('../public/javascripts/users.js');
const User = require('../public/javascripts/user');
const workoutClass = require('../public/javascripts/userData');
const router = express.Router();
const users = new Users().load();

title = {
    "home": "My App - Home",
    "login": "My App - Login",
    "training": "My App - Training",
    "meal": "My App - Meal",
    "profiles": "My App - Profiles",
    "sleep": "My App - Sleep",
    "register": "My App - Register",
};

function oldOrNew (data) {
    try {
        if (data.length) {
           return true;
        };
    } catch  (error) {
        return false;
    };
};


// PAGE DE CONNEXION
router.get('/login', (req,res) => { 
    res.render('login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



// LA PAGE DE CREATION DE COMPTE
router.get('/register', (req,res) => {
    res.render('register', { 
        style:false,
        title: title.register,
        error: false,
    });
});



// AJOUTE UN NOUVEL UTILISATEUR
router.post('/register', (req,res) => {

    const pseudo = req.body.pseudo;
    const firstname = req.body.firstname;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    if  (pseudo === '' || firstname === '' || name === '' || email === '' || password === '' || password2 === '') {
        res.render('register', { title: title.register, message: "Veillez renseigner tout les champs", error: true, style: false});
        return;
    };

    if (users.exist(pseudo)) {
        res.render('register', { title: title.register, message: "Pseudo déjà utilisé", error: true, style: false,});
        return;
    };

    if (password != password2) {
        res.render('register', { title: title.register, message: "Mots de passe différents", error: true, style:false});
        return;
    };

    const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password, true);

    users.add(user);
    users.save(user.pseudo);

    let userData = workoutClass.getData(pseudo);
    if (userData === undefined) {
        console.log('Creation des données de ' + user.pseudo);
        const data = new workoutClass.UserData(pseudo);
        data.save();
        workoutClass.setData(pseudo, data);
    }



    res.render('login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



// SYSTEME DE CONNEXION 
router.post('/login', (req,res) => {

    const pseudo = req.body.pseudo;
    const password = req.body.password;

    

    if (pseudo === '' || password === '') {
        res.render('login', { title: title.login, message: "Veillez renseigner tout les champs", error: true, style: false});
        return;
    };

    if (!users.exist(pseudo)) {
        res.render('login', { title: title.login, message: "Utilisateur introuvable", error: true, style: false});
        return;
    };

    const user = users.get(pseudo);
    if (!user.checkPassword(password)) {
        res.render('login', { title: title.login, message: "Mot de passe incorrect", error: true, style: false });
        return;
    };

    req.session.pseudo = pseudo;
    console.log(user.pseudo + " vient de se connecter");
    
    let userData = workoutClass.getData(pseudo);
    if (userData === undefined) {
        console.log('Chargement des données de ' + user.pseudo);
        userData = new workoutClass.UserData(pseudo).load();
        workoutClass.setData(pseudo, userData);
    };

    res.render('home', { 
        style: true,
        title: title.home,
        user: users.get(pseudo),
        old: oldOrNew(userData.workout.seances),
        userData: workoutClass.getData(req.session.pseudo),
    });

});



// PAGE POUR LA SELECTION DU MAIL POUR LE MOT DE PASSE
router.get('/forgot', (req,res) => {
    res.render('forgot', { 
        title: "My App - Forgot",
    });
});



// SYSTEME D'ENVOI D'UN MAIL SI OUBLIE DU MOT DE PASSE
router.post('/sendMail', (req,res) => {
    });




// SYSTEME DE DECONNEXION
router.post('/logout', (req,res) => {
    console.log(req.session.pseudo + ' vient de se déconnecter.');
    req.session.destroy();
    res.render('login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



// SYSTEME DE CHANGEMENT DE MOT DE PASSE
router.post('/changePassword', (req,res) => {

    const oldPassword = req.body.old;
    const newPassword = req.body.new;
    const newPassword2 = req.body.new2;
    const pseudo = req.session.pseudo;
    const user = users.get(pseudo);

    if (user === undefined) {
        res.render('Profiles', { title: "Profiles", error: true, message: 'Aucun utilisateur pour le pseudo [' + pseudo + ']', user: user, style: true,});
        return;
    };

    if (newPassword === '' || newPassword2 === '') {
        res.render('Profiles', { title: "Profiles", error: true, message: "Veillez renseigner tout les champs", user: user, style: true,});
        return;
    };

    if (!user.checkPassword(oldPassword)) {
        res.render('Profiles', { title: "Profiles", error: true, message: "Mauvais mot de passe pour " + pseudo, user: user, style: true,});
        return;
    };

    if (oldPassword === newPassword) {
        res.render('Profiles', { title: "Profiles", error: true, message: "Le mot de passe doit être différent de l'ancien", user: user, style: true,});
        return;
    };

    if (newPassword != newPassword2) {
        res.render('Profiles', { title: "Profiles", error: true, message: "Confirmation de mot de passse incorrect", user: user, style: true,});
        return;
    };

    user.withPassword(newPassword, true);
    users.save();
    res.render('profiles', { 
        title: "Profiles",
        style: true,
        error: false,
        user: user,
    });
});

module.exports = router;
                  