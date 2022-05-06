///////////////////
/// Les modules ///
///////////////////


// Modules de base
const express = require('express');
const router = express.Router();

// Modules de séances
const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Training = workoutClass.Training;

// Modules des utilisateurs
const Users = require('../public/javascripts/users');
const users = new Users().load();



/////////////////
/// Variables ///
/////////////////

// Variables pour les listes d'exercices
const exercices = require('../data/exercices.json').exerciceWorkout;


/////////////////////
/// Les fonctions ///
/////////////////////



//Fonction qui vérifie si il y a du contenu dans un tableau
function dataLenght (data) {
    try {
        if (data.length || data == null) {
           return true;
        };
    } catch (error) {
        return false;
    };
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



// Affiche la page d'accueil depuis la page de séance
router.get('/home', (req,res) => {
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



/////////////////////////////////////
/// Pour la création des workouts ///
/////////////////////////////////////


// Affiche la page de modification d'entrainement
router.get('/planWorkout', (req,res) => {

    const userData = workoutClass.getData(req.session.pseudo);
    req.session.idSeance = parseInt(req.query.id);

    res.render('training/planWorkout', { 
        id: req.session.idSeance,
        style: false,
        title: title.training,
        userData: userData,
        template: dataLenght(Object.keys(userData.templates)),
        exercices: exercices,
    });
})


// Affiche la page de modification d'entrainement
router.post('/planWorkout', (req,res) => {

    const userData = workoutClass.getData(req.session.pseudo);
    req.session.idSeance = parseInt(req.body.idPage);
    req.session.type = userData.workout.seances[req.session.idSeance].type;

    res.render('training/planWorkout', { 
        id: req.session.idSeance,
        style: false,
        template: dataLenght(Object.keys(userData.templates)),
        title: title.training,
        userData: userData,
        exercices: exercices,
    });
})



// La page qui fait finir l'entrainement
router.get('/endWorkout', (req,res) => {

    const userData = workoutClass.getData(req.session.pseudo);
    const id = req.query.id;
    userData.workout.seances[id - 1].done = true;
    userData.save()

    res.render('training/main', {
        id: id - 1,
        seance: dataLenght(endWorkout(userData)),
        page: req.query.page,
        style: true,
        title: title.training,
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
});



// L'after entrainement
router.post('/afterWorkout', (req,res) => {
    const seanceDifficulty = req.body.difficulty;

    const userData = workoutClass.getData(res.session.pseudo);
    const s = userData.workout.seances[req.body.rpe];
    s.difficulty = seanceDifficulty;
    s.done = true;
    userData.save();
    
    res.render('training/main', { 
        style: true,
        title: title.training, 
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
});



// Supprime un entrainement
router.post('/deleteWorkout', (req, res) => {
    const userData =  workoutClass.getData(req.session.pseudo);
    userData.workout.delete(req.session.idSeance);
    userData.save();
   
    res.render('training/main', { 
        style: true,
        title: title.training, 
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
});



// Créer un entrainement
router.post('/addWorkout', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const duration = parseInt(req.body.durationHeure) * 60 + parseInt(req.body.durationMin);
    const seance = new Seance(req.body.training_name, req.body.date, req.body.detail, duration);

    if (req.body.time != '') {
        seance.withTime(req.body.time)
    };
    
    userData.workout.add(seance);
    userData.save();
    res.render('training/main', { 
        style: true,
        seance: dataLenght(endWorkout(userData)),
        title: title.training, 
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
});



router.post('/addSeance', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const job = Training.create(req, userData)
    userData.workout.addJob(job, req.session.idSeance);
    userData.save();

    res.render('training/planWorkout', { 
        id: req.session.idSeance,
        style: false,
        title: title.training, 
        userData: userData,
        template: dataLenght(Object.keys(userData.templates)),
        exercices: exercices,
    });
});


/////////////////////////////////////
/// Pour la gestion des exercices ///
/////////////////////////////////////



// La page qui supprime un exercice 
router.get('/deleteJob', (req, res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    userData.workout.deleteJob(req.query.job, req.session.idSeance)

    userData.save()

    res.render('training/planWorkout', {
        id: req.session.idSeance,
        style: false,
        title: title.training, 
        userData: userData,
        exercices: exercices,
        template: dataLenght(Object.keys(userData.templates)),
    });
})



//////////////////////////////////
/// Pour les différentes pages ///
//////////////////////////////////

// Pour créer un nouvel entrainement
router.get('/newWorkout', (req,res) => {

    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training/newWorkout', { 
        style: true,
        title: title.training,
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
})



// LA PAGE D'ENTRAINEMENT
router.get('/training', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training/main', {
        style: true,
        title: title.training,
        userData: userData,
        old: dataLenght(userData.workout.seances),
        seance: dataLenght(endWorkout(userData)),
        userBody: dataLenght(userData.health.body),
    });
});



// La page de la séance choisie
router.get('/seance', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const id = req.query.id;
    req.session.type = userData.workout.seances[id - 1].type;

    res.render('training/seance', {
        id: id - 1,
        page: req.query.page,
        style: false,
        title: title.training,
        userData: userData,
    });
});



// La page avec toutes les séances
router.get('/allSeances', (req, res) => {
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
   
    res.render('training/allSeances', { 
        style: false,
        title: title.training, 
        userData: userData,
    });
});



////////////////////////////////
/// L'évolution poids/taille ///
////////////////////////////////



// Calcule l'IMC de l'utilisateur
router.post('/setIMC', (req, res) => {
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
    const body = req.body.body;
    const height = req.body.height;
 
    if (body != '' && height != '') {
        userData.health.add(parseInt(body), parseInt(height));
        userData.save()
    };

    res.render('training/main', { 
        style: true,
        seance: dataLenght(endWorkout(userData)),
        title: title.training, 
        userData: workoutClass.getData(pseudo),
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
});



// Supprime une IMC
router.post('/deleteIMC', (req, res) => {
    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.delete(req.body.supprimer);
    userData.save();
   
    res.render('training/main', { 
        style: true,
        title: title.training, 
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
    });
});



module.exports = router;