const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Job = workoutClass.Job;

const Users = require('../public/javascripts/users');
const User = require('../public/javascripts/user');
const users = new Users().load();



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



// FONCTION POUR LA SECURISATION DES SESSIONS
function sessionSecure (req, res) {
    if (req.session.pseudo === undefined) {
        res.redirect('login', {
            style: false, 
            title: title.login, 
            error: false,
        });
    };
};



// FONCTION RAJOUTE DES CALORIES
function addCalorie (calories) {
    if (calories === "") {
        return 0;
    }; 
    return parseInt(calories);
};



// PASSER ADMIN
router.post('/passAdmin', (req,res) => {
    const pseudo = req.session.pseudo;
    const user = users.get(pseudo)
    user.boost = true;
    const p = new User(user.pseudo, user.name, user.firstname, user.boost);
    users.add(p);
    users.save();

    res.render('profiles', { 
        style: true,
        title: title.profiles, 
        error: false,
        user: users.get(req.session.pseudo),
    });
})



 // PAGE DE PROFILE
 router.get('/profiles', (req,res) => {
    sessionSecure(req,res);

    res.render('profiles', { 
        style: true,
        title: title.profiles, 
        error: false,
        user: users.get(req.session.pseudo),
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