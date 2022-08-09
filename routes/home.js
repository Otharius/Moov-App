const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Job = workoutClass.Job;

const Users = require('../public/javascripts/users');
const users = new Users().load();

const Groups = require('../public/javascripts/rights').Groups;
const groups = new Groups().load();


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



//FONCTION SI ON A PAS D'ENTRAINEMENT
function groupsLenght () {
    if (groups.groups.size === 0) {
        return false;
    } else {
        return true;
    }
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

function session (req,res) {
    if (req.session.pseudo == undefined) {
        res.render('sign/login', {
            style: false,
            title: title.login, 
            error: false,
        });
    };
};

// LA PAGE D'ACCUEIL
router.get('/home', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('home/main', { 
        style: true,
        length: groupsLenght(),
        groups: groups.groups,
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
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);

    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();

    res.render('home/main', { 
        style: true,
        length: groupsLenght(),
        groups: groups.groups,
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
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.setCalories(0);
    userData.save();

    res.render('home/main', { 
        style: true,
        length: groupsLenght(),
        groups: groups.groups,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: dataLenght(userData.workout.seances),
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
    });
});



router.post('/afterWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    userData.workout.seances[req.body.rpe].difficulty = req.body.difficulty;
    userData.workout.seances[req.body.rpe].note = req.body.note;
    userData.save();
    
    res.render('home/main', { 
        style: true,
        length: groupsLenght(),
        groups: groups.groups,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: dataLenght(userData.workout.seances),
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
    });
});

module.exports = router;