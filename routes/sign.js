const express = require('express');
const Users = require('../public/javascripts/users.js');
const User = require('../public/javascripts/user');
const workoutClass = require('../public/javascripts/userData');
const router = express.Router();
const Groups = require('../public/javascripts/rights').Groups;


title = {
    "home": "Moov - Home",
    "login": "Moov - Login",
    "training": "Moov - Training",
    "meal": "Moov - Meal",
    "profiles": "Moov - Profiles",
    "sleep": "Moov - Sleep",
    "register": "Moov - Register",
};


// Fonction qui classe les séances finies et les séances en cours
function endWorkout (data) {
    let l = [];

    for(let i=0; i < data.workout.seances.length; i++) {
        if (data.workout.seances[i].difficulty === null  && data.workout.seances[i].done === true) {
            l.push(data.workout.seances);
        };
    };

    if (l.length > 0) {
        return l;
    };

    return null;
};



//FONCTION SI ON A PAS D'ENTRAINEMENT
function dataLenght (data) {
    try {
        if (data.length) {
           return true;
        };
    } catch (error) {
        return false;
    };
};



// PAGE DE CONNEXION
router.get('/login', (req,res) => { 
    res.render('sign/login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



// LA PAGE DE CREATION DE COMPTE
router.get('/register', (req,res) => {
    res.render('sign/register', { 
        style:false,
        title: title.register,
        error: false,
    });
});



// Add a new user
router.post('/register', (req,res) => {
    const users = new Users().load();
    const pseudo = req.body.pseudo.trim();
    const firstname = req.body.firstname.trim();
    const name = req.body.name.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const password2 = req.body.password2.trim();

    if  (pseudo === '' || firstname === '' || name === '' || email === '' || password === '' || password2 === '') {
        res.render('sign/register', { title: title.register, message: "Veillez renseigner tout les champs", error: true, style: false});
        return;
    };

    if (users.exist(pseudo)) {
        res.render('sign/register', { title: title.register, message: "Pseudo déjà utilisé", error: true, style: false,});
        return;
    };

    if (password != password2) {
        res.render('sign/register', { title: title.register, message: "Mots de passe différents", error: true, style:false});
        return;
    };

    const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password, true);

    users.add(user);
    users.save();

    let userData = workoutClass.getData(pseudo);
    if (userData === undefined) {
        const data = new workoutClass.UserData(pseudo);
        data.save();
        workoutClass.setData(pseudo, data);
    };

    res.render('sign/login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



// SYSTEME DE CONNEXION 
router.post('/login', (req,res) => {
    const users = new Users().load();
    const Newgroups = new Groups().load();

    const pseudo = req.body.pseudo.trim();
    const password = req.body.password.trim();

    if (pseudo === '' || password === '') {
        res.render('sign/login', { title: title.login, message: "Veillez renseigner tout les champs", error: true, style: false});
        return;
    };

    if (!users.exist(pseudo)) {
        res.render('sign/login', { title: title.login, message: "Utilisateur introuvable", error: true, style: false});
        return;
    };

    const user = users.get(pseudo);
    if (!user.checkPassword(password)) {
        res.render('sign/login', { title: title.login, message: "Mot de passe incorrect", error: true, style: false });
        return;
    };

    req.session.pseudo = pseudo;
    
    let userData = workoutClass.getData(pseudo);
    if (userData === undefined) {
        userData = new workoutClass.UserData(pseudo).load();
        workoutClass.setData(pseudo, userData);
    };
    
    res.render('home/main', {
        style: true,
        groups: Newgroups.groups,
        title: title.home,
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
    });

});



// PAGE POUR LA SELECTION DU MAIL POUR LE MOT DE PASSE
router.get('/forgot', (req,res) => {
    res.render('forgot', { 
        title: "My App - Forgot",
    });
});


// SYSTEME DE DECONNEXION
router.post('/logout', (req,res) => {
    req.session.destroy();
    res.render('sign/login', { 
        style: false,
        title: title.login, 
        error: false,
    });
});



module.exports = router;
                  