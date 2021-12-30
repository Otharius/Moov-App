const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');

const Users = require('../public/javascripts/users');
const User = require('../public/javascripts/user');
const users = new Users().load();





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




////////////////////////////
/////// ALIMENTATION ///////
////////////////////////////



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/resetCal', (req,res) => {
    sessionSecure(req,res);

    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.setCalories(0);
    userData.save();

    res.render('meal', { 
        style: true,
        title: title.meal, 
        userData: workoutClass.getData(req.session.pseudo),
    });
});



// L'AJOUT DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/addCal', (req,res) => {
    sessionSecure(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    

    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();

    res.render('meal', { 
        style: true,
        title: title.meal, 
        userData: userData,
    });
    
});



// LA PAGE D'ALIMENTATION 
router.get('/meal', (req,res) => {
    sessionSecure(req, res);

    res.render('meal', { 
        style: true,
        title: title.meal, 
        userData: workoutClass.getData(req.session.pseudo),
    });
});



// L'AJOUT DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/addCal', (req,res) => {
    sessionSecure(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);
    

    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();

    res.render('meal', { 
        style: true,
        title: title.meal, 
        userData: userData,
    });
    
});





/////////////////////////////
////////// SOMMEIL //////////
/////////////////////////////



// PAGE DE SOMMEIL
router.get('/sleep', (req,res) => {
    sessionSecure(req,res);
    res.render('sleep', { 
        style: true,
        title: title.sleep,
        userData: workoutClass.getData(req.session.pseudo),
    });
});





module.exports = router;