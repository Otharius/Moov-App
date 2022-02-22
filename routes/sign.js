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
    res.render('principal/register', { 
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


 
    res.render('principal/login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



// LA PAGE DE CONNEXION
router.get('/login', (req,res) => { 
    res.render('principal/login', {
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
    
    let userData = workoutClass.getData(pseudo);
    if (userData === undefined) {
        userData = new workoutClass.UserData(pseudo).load();
        workoutClass.setData(pseudo, userData);
    };

    res.render('principal/home', { 
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
    req.session.destroy();
    res.render('principal/login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



module.exports = router;
                  