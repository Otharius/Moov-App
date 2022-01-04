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
        res.redirect('/login', {
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



// LA PAGE D'ACCUEIL
router.get('/home', (req,res) => {
    sessionSecure(req,res);

    const userData = workoutClass.getData(req.session.pseudo);

    res.render('principal/home', { 
        style: true,
        title: title.home, 
        user: users.get(req.session.pseudo),
        userData: userData,
        old: dataLenght(userData.workout.seances),
    });
});



// AJOUT DES CALORIES SUR LA PAGE D'ACCUEIL
router.post('/homeAddCal', (req,res) => {
    sessionSecure(req,res);

    const userData =  workoutClass.getData(req.session.pseudo);

    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();

    res.render('principal/home', { 
        style: true,
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: dataLenght(userData.workout.seances),
        user: users.get(req.session.pseudo)
     });
});



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ACCUEIL
router.post('/homeResetCal', (req,res) => {
    sessionSecure(req,res);

    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.setCalories(0);
    userData.save();

    res.render('principal/home', { 
        style: true,
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: dataLenght(userData.workout.seances),
        user: users.get(req.session.pseudo)
    });
});



module.exports = router;