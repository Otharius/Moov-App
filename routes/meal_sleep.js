const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');

const Users = require('../public/javascripts/users');
const users = new Users().load();

// FONCTION RAJOUTE DES CALORIES
function addCalorie (calories) {

    if (calories === "" || isNaN(parseInt(calories))) {
        return 0;
    }

    return parseInt(calories);
};

function addSleep (sleep) {
    if (sleep === "" || isNaN(parseFloat(sleep))) {
        return 0;
    };
    return parseFloat(sleep)
}


function session (req,res) {
    if (req.session.pseudo == undefined) {
        res.render('sign/login', {
            style: false,
            title: title.login, 
            error: false,
        });
    };
};

////////////////////////////
/////// ALIMENTATION ///////
////////////////////////////



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/resetCal', (req,res) => {
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.setCalories(0);
    userData.save();

    res.render('meal/main', { 
        style: true,
        title: title.meal, 
        userData: workoutClass.getData(req.session.pseudo),
    });
});



// L'AJOUT DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/addCal', (req,res) => {
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    
    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();

    res.render('meal/main', { 
        style: true,
        title: title.meal, 
        userData: userData,
    });
    
});



// LA PAGE D'ALIMENTATION 
router.get('/meal', (req,res) => {
    session(req,res);
    res.render('meal/main', { 
        style: true,
        title: title.meal, 
        userData: workoutClass.getData(req.session.pseudo),
    });
});



/////////////////////////////
////////// SOMMEIL //////////
/////////////////////////////



// PAGE DE SOMMEIL
router.get('/sleep', (req,res) => {
    session(req,res);
    res.render('sleep/main', { 
        style: true,
        title: title.sleep,
        userData: workoutClass.getData(req.session.pseudo),
    });
});



// L'AJOUT D'HEURE DE SOMMEIL
router.post('/addSleep', (req,res) => {
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    
    userData.health.setSleep(userData.health.sleep + addSleep(req.body.sleep));
    userData.save();

    res.render('sleep/main', { 
        style: true,
        title: title.sleep, 
        userData: userData,
    });
    
});



// Met à 0 le nombre d'heure de sommeil
router.post('/resetSleep', (req,res) => {
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.setSleep(0);
    userData.save();

    res.render('sleep/main', { 
        style: true,
        title: title.sleep, 
        userData: workoutClass.getData(req.session.pseudo),
    });
});

module.exports = router;