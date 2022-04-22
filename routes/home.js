const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Job = workoutClass.Job;

const Users = require('../public/javascripts/users');
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
        res.render('principal/login', {
            style: false, 
            title: title.login, 
            error: false,
        });
    };
};



// FONCTION RAJOUTE DES CALORIES
function addCalorie (calories) {
    if (calories === "" || isNaN(parseInt(calories))) {
        return 0;
    }

    return parseInt(calories);
};


// Fonction qui classe les séances finies et les séances en cours
function endWorkout (data) {
    let l = [];

    for(let i=0; i < data.workout.seances.length; i++) {
        if (data.workout.seances[i].difficulty == null  && data.workout.seances[i].done == true) {
            l.push(data.workout.seances);
        };
     };
     if (l.length > 0) {
         return l;
     };
     return null;
};



// LA PAGE D'ACCUEIL
router.get('/home', (req,res) => {
    sessionSecure(req,res);

    const userData = workoutClass.getData(req.session.pseudo);

    res.render('home/main', { 
        style: true,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
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

    res.render('home/main', { 
        style: true,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        seance: dataLenght(endWorkout(userData)),
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


    res.render('home/main', { 
        style: true,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: dataLenght(userData.workout.seances),
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
    });
});



module.exports = router;