const express = require('express');
const router = express.Router();
const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Job = workoutClass.Job;
const Workout = workoutClass.Workout;
const UserData = workoutClass.UserData;
const Users = require('../public/javascripts/users');
const User = require('../public/javascripts/user');
const exMuscu =  require('../data/musculationExercice.json').exercice;

const users = new Users().load();
const usersData = new Map();



//FONCTION SI ON A PAS D'ENTRAINEMENT
function oldOrNew (data) {
    try {
        if (data.length) {
           return true;
        };
    } catch  (error) {
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
function addCalorie (user, ajoutCalorie) {
    if (ajoutCalorie === "") {
        return false;
    }; 

    user.calorie = user.calorie + parseInt(ajoutCalorie);

    const account = new Account(user.pseudo, user.calorie, user.sleep);
    accounts.add(account);
    accounts.save();

    return user.calorie;
};



// FONCTION REMISE A 0 DES CALORIES
function resetCalorie (user) {
    const account = new Account(user.pseudo, 0, user.sleep);
    accounts.add(account);
    accounts.save();
    return 0;
}



// LA PAGE DE CONNEXION
router.get('/login', (req,res) => { 
    res.render('login', {
        style: false, 
        title: title.login, 
        error: false,
    });
});



// LA PAGE D'ENTRAINEMENT
router.get('/training', (req,res) => {
    console.log(req.session.pseudo);
    sessionSecure(req, res);
    const data = require('../data/' + req.session.pseudo + '.json').seances;

    res.render('training', { 
        style: true,
        title: title.training,
        data: data,
        old: oldOrNew(data),
        exMuscu: require('../data/musculationExercice.json').exercice,
    });
});



// LA PAGE D'ALIMENTATION 
router.get('/meal', (req,res) => {
    sessionSecure(req, res);

    res.render('meal', { 
        style: true,
        title: title.meal, 
        calorie: accounts.get(req.session.pseudo).calorie,
    });
});



// L'AJOUT DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/addCal', (req,res) => {
    sessionSecure(req,res);
    const pseudo = req.session.pseudo;
    const userData = usersData.get(pseudo);
    userData.health.setCalorie(req.body.cal);
    res.render('meal', { 
        style: true,
        title: title.meal, 
        calorie: userData.health.calories 
    });
    
});



// AJOUT DES CALORIES SUR LA PAGE D'ACCUEIL
router.post('/homeAddCal', (req,res) => {
    sessionSecure(req,res);

    let user = accounts.get(req.session.pseudo);
    const data =  require('../data/' + user.pseudo + '.json').seances;
    const event = addCalorie(user, req.body.cal);

    res.render('home', { 
        style: true,
        title: title.home, 
        calorie: event === false ? user.calorie : event, 
        admin: users.get(pseudo).boost,
        data: data,
        old: oldOrNew(data),
     });
});



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ACCUEIL
router.post('/homeResetCal', (req,res) => {
    sessionSecure(req,res);

    const pseudo = req.session.pseudo;
    const user = accounts.get(pseudo);
    const data =  require('../data/' + pseudo + '.json').seances;

    res.render('home', { 
        style: true,
        title: title.home, 
        calorie: resetCalorie(user),
        admin: users.get(pseudo).boost,
        data: data,
        old: oldOrNew(data),
    });
});



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ALIMENTATION
router.post('/resetCal', (req,res) => {
    sessionSecure(req,res);

    const user = accounts.get(req.session.pseudo);

    res.render('meal', { 
        style: true,
        title: title.meal, 
        calorie: resetCalorie(user),
    });
});



// PAGE DE SOMMEIL
router.get('/sleep', (req,res) => {
    console.log(req.session.pseudo);
    sessionSecure(req,res);
    res.render('sleep', { 
        style: true,
        title: title.sleep,
    });
});



 // PAGE DE PROFILE
router.get('/profiles', (req,res) => {
    console.log(req.session.pseudo);
    sessionSecure(req,res);

    const pseudo = req.session.pseudo;
    const user = users.get(pseudo);

    res.render('profiles', { 
        style: true,
        title: title.profiles, 
        error: false,
        user: user,
    });
});



// LA PAGE D'ACCUEIL
router.get('/home', (req,res) => {
    console.log(req.session.pseudo);
    sessionSecure(req,res);

    const pseudo = req.session.pseudo;
    const user = accounts.get(pseudo);
    const data =  require('../data/' + pseudo + '.json').seances;

    res.render('home', { 
        style: true,
        title: title.home, 
        calorie: user.calorie,
        admin: users.get(pseudo).boost,
        data: data,
        old: oldOrNew(data),
    });
});



// AJOUTE DES ENTRAINEMENTS
router.post('/addWorkout', (req,res) => {
    sessionSecure(req,res);

    const pseudo = req.session.pseudo;
    let seance = new Seance(req.body.training_name, req.body.date, null, false, req.body.detail, req.body.type);
    
    for (let i = 0; i<req.body.repetition.length; i++) {
        const job = new Job(req.body.exercice[i], req.body.repetition[i], req.body.serie[i], req.body.reposSec[i]);
        seance.add(job);
    };

    new Workout(pseudo).load().add(seance).save();

    const data =  require('../data/' + pseudo + '.json').seances;

    res.render('training', { 
        style: true,
        title: title.home, 
        data: data,
        old: oldOrNew(data),
        exMuscu: exMuscu,
    });
});



// L'AFTER ENTRAINEMENT 
router.post('/afterWorkout', (req,res) => {
    const done = req.body.done;
    const difficulty = req.body.difficulty;
    
    const pseudo = req.session.pseudo;
    const data =  require('../data/' + pseudo + '.json').seances;
    
    res.render('training', { 
        title: title.training, 
        data: data,
        style: true,
        old: oldOrNew(data),
        exMuscu: exMuscu,
    });
});



// PASSER ADMIN
router.post('/passAdmin', (req,res) => {
    const pseudo = req.session.pseudo;
    const user = users.get(pseudo)
    user.boost = true;
    const p = new User(user.pseudo, user.name, user.firstname, user.boost);
    users.add(p);
    users.save();


    res.render('training', { 
        title: title.training, 
        data: data,
        style: true,
        old: oldOrNew(data),
        exMuscu: exMuscu,
    });
})



// SUPPRIMER UNE SEANCE
router.post('/deleteWorkout', (req, res) => {
    workouts.delete(req.body.supprimer).save();
    const user = users.get(req.session.pseudo);
    const data =  require('../data/' + req.session.pseudo + '.json').seances;
    
    res.render('training', { 
        style: true,
        title: title.training, 
        calorie: user.calorie,
        admin: user.boost,
        data: data,
        old: oldOrNew(data),
        exMuscu: exMuscu,
    });
})




module.exports = router;