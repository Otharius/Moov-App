const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Job = workoutClass.Job;
const Run = workoutClass.Run;

const Users = require('../public/javascripts/users');
const User = require('../public/javascripts/user');
const users = new Users().load();

const exerciceType = require('../data/exercices.json').exerciceType;
const exMuscu =  require('../data/exercices.json').exerciceWorkout;



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



router.get('/changeWorkout', (req,res) => {

    const userData = workoutClass.getData(req.session.pseudo);

    res.render('extern/changeWorkout', { 
        style: true,
        title: title.training,
        userData: userData,
        old: dataLenght(userData.workout.seances),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
        userBody: dataLenght(userData.health.body),
    });
})

// LA PAGE D'ENTRAINEMENT
router.get('/training', (req,res) => {
    sessionSecure(req, res);
    const userData = workoutClass.getData(req.session.pseudo);
    

    res.render('principal/training', {
        style: true,
        title: title.training,
        userData: userData,
        old: dataLenght(userData.workout.seances),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
        userBody: dataLenght(userData.health.body),
    });
});

router.post('/deleteJob', (req, res) => {
    console.log(req.body)
    const userData = workoutClass.getData(req.session.pseudo);
    userData.workout.deleteJob(req.body.supprimer)

    userData.save()

    res.render('extern/changeWorkout', { 
        style: true,
        title: title.training, 
        userData: userData,
        exerciceType: exerciceType,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
})

router.post('/addJob', (req, res) => {
    console.log(req.body)
    const userData = workoutClass.getData(req.session.pseudo);
    const job = new Job(req.body.exercice, req.body.repetition, req.body.serie, req.body.reposMin)
    userData.workout.addJob(job)

    userData.save()

    res.render('extern/changeWorkout', { 
        style: true,
        title: title.training, 
        userData: userData,
        exerciceType: exerciceType,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
})




router.post('/plus', (req, res) => {
    console.log(req.body)
    const userData = workoutClass.getData(req.session.pseudo);
    const seance = new Seance(req.body.training_name,req.body.date, null, false, req.body.detail, userData.workout.seances[0].type)
    for (let i = 0; i<req.body.repetition.length; i++) {
        const job = new Job(req.body.exercice[i], req.body.repetition[i], req.body.serie[i], req.body.reposMin[i]);
        seance.add(job);
    };    
    
    userData.workout.seances[0] = seance
    
    userData.save()

    res.render('principal/training', { 
        style: true,
        title: title.training, 
        userData: userData,
        exerciceType: exerciceType,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
})

// AJOUTE DES ENTRAINEMENTS
router.post('/addWorkout', (req,res) => {
    sessionSecure(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    const i = Number(req.body.copier);
    const newSeance = userData.workout.seances;

    const seance = new Seance(req.body.training_name, req.body.date, null, false, req.body.detail, req.body.type);

    if (req.body.type == exerciceType[0]) {
        for (let i = 0; i<req.body.repetition.length; i++) {
            const job = new Job(req.body.exercice[i], req.body.repetition[i], req.body.serie[i], req.body.reposSec[i]);
            seance.add(job);
        };    
    };

    if (req.body.type == exerciceType[1]) {
        const job = new Run(req.body.start, req.body.arrival, req.body.bounds, req.body.time);
        seance.add(job);
    };
    

    
    userData.workout.add(seance);
    userData.save();
    res.render('principal/training', { 
        style: true,
        title: title.training, 
        userData: userData,
        exerciceType: exerciceType,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
});



// L'AFTER ENTRAINEMENT 
router.post('/afterWorkout', (req,res) => {
    const seanceDifficulty = req.body.difficulty;
    const pseudo = req.session.pseudo;
    const userData = workoutClass.getData(pseudo);
    const s = userData.workout.seances[req.body.rpe];
    s.difficulty = seanceDifficulty;
    s.done = true;
    userData.save();
    
    res.render('principal/training', { 
        style: true,
        title: title.training, 
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
});



// SUPPRIMER UNE SEANCE
router.post('/deleteWorkout', (req, res) => {
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
    userData.workout.delete(req.body.supprimer);
    userData.save();
   
    res.render('principal/training', { 
        style: true,
        title: title.training, 
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
});



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

    res.render('principal/training', { 
        style: true,
        title: title.training, 
        userData: workoutClass.getData(pseudo),
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
});



// SUPPRIMER Une IMC
router.post('/deleteIMC', (req, res) => {
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
    userData.health.delete(req.body.supprimer);
    userData.save();
   
    res.render('principal/training', { 
        style: true,
        title: title.training, 
        userData: userData,
        old: dataLenght(userData.workout.seances),
        userBody: dataLenght(userData.health.body),
        exMuscu: exMuscu,
        exerciceType: exerciceType,
    });
});



module.exports = router;