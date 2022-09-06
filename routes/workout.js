///////////////////
/// The modules ///
///////////////////


// Basics modules
const express = require('express');
const router = express.Router();

// Trainings modules
const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Training = workoutClass.Training;

// Users modules
const Users = require('../public/javascripts/users');
const users = new Users().load();

// Groups modules
const groupClass = require('../public/javascripts/rights');
const Groups = groupClass.Groups;


/////////////////
/// Variables ///
/////////////////


// List of exercices
const exercices = require('../data/exercices.json');


/////////////////////
/// The functions ///
/////////////////////


// This function test the length of a list
function dataLenght (data) {
    try {
        if (data.length || data === null) {
           return true;
        };
    } catch (error) {
        return false;
    };
};

// This function puts the trainings that have not been done 
function dataExercice (data) {
    let list = 0;
    if(data.workout.seances.length > 0) {
        for (let i = 0; i < data.workout.seances.length; i++) {
            if(data.workout.seances[i].done === false){
                list = list + 1;
            };
        };
    };

    if(list === 0) {
        return false;
    } else {
        return true;
    };
}

// This function test the actual session 
function session (req,res) {
    if (req.session.pseudo == undefined) {
        res.render('sign/login', {
            style: false,
            title: title.login, 
            error: false,
        });
    };
};

// This function puts the trainings that have been done but not had a difficulty
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


                        ///////////////////////////
                        /// The blocs of server ///
                        ///////////////////////////


// Send the home page
router.get('/home', (req,res) => {
    session(req,res);
    const Newgroups = new Groups().load();
    const userData = workoutClass.getData(req.session.pseudo);
 
    res.render('home/main', { 
        style: true,
        groups: Newgroups.groups,
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
    });
});


//////////////////////////////////////////
/// For create workout and create jobs ///
//////////////////////////////////////////


// This bloc create a new workout
router.get('/newWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training/newWorkout', { 
        style: true,
        title: title.training,
        userData: userData,
    });
});

// This bloc add a job in a workout
router.post('/addJob', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const job = Training.create(req, userData);

    userData.workout.addJob(job, req.session.idSeance);
    userData.save();

    res.render('training/completeWorkout', { 
        id: req.session.idSeance,
        style: false,
        title: title.training, 
        userData: userData,
        template: dataLenght(Object.keys(userData.templates)),
        exercices: exercices,
    });
});

// This bloc create a workout
router.post('/addWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const duration = parseInt(req.body.durationHeure.trim()) * 60 + parseInt(req.body.durationMin.trim());
    const seance = new Seance(req.body.training_name.trim(), false, req.body.date.trim(), req.body.detail.trim(), duration);

    if (req.body.time.trim() != '') {
        seance.withTime(req.body.time.trim())
    };
    
    userData.workout.add(seance);
    userData.save();

    res.render('training/main', { 
        style: true,
        dataExercice: dataExercice(userData),
        seance: dataLenght(endWorkout(userData)),
        title: title.training, 
        userData: userData,
    });
});


////////////////////////////////////////
/// The after workout and sends page ///
////////////////////////////////////////


// This bloc sends the informations for the after workout
router.post('/afterWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    userData.workout.seances[req.body.rpe.trim()].difficulty = req.body.difficulty.trim();
    userData.workout.seances[req.body.rpe.trim()].note = req.body.note.trim();
    userData.save();
    
    res.render('training/main', { 
        style: true,
        dataExercice: dataExercice(userData),
        title: title.training, 
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
    });
});

// This bloc delete a workout
router.get('/deleteWorkout', (req, res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    userData.workout.delete(req.query.id.trim());
    userData.save();

    res.render("training/main", { 
        style: true,
        dataExercice: dataExercice(userData),
        title: title.training,
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
    });
});

// This bloc send the page complete workout
router.post('/completeWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    req.session.idSeance = parseInt(req.body.idPage.trim());

    res.render('training/completeWorkout', { 
        id: req.session.idSeance,
        style: false,
        template: dataLenght(Object.keys(userData.templates)),
        title: title.training,
        userData: userData,
        exercices: exercices,
    });
});

// This bloc finish a workout
router.get('/endWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const id = req.query.id.trim();

    userData.workout.seances[id].done = true;
    userData.save();

    res.render('training/main', {
        dataExercice: dataExercice(userData),
        seance: dataLenght(endWorkout(userData)),
        style: true,
        title: title.training,
        userData: userData,
    });
});

// This bloc delete a job in a workout
router.get('/deleteJob', (req, res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    userData.workout.deleteJob(req.query.job.trim(), req.session.idSeance);
    userData.save();

    res.render('training/completeWorkout', {
        id: req.session.idSeance,
        style: false,
        title: title.training, 
        userData: userData,
        exercices: exercices,
        template: dataLenght(Object.keys(userData.templates)),
    });
});

// This bloc sends the page training
router.get('/training', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training/main', {
        style: true,
        dataExercice: dataExercice(userData),
        title: title.training,
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
    });
});

// This bloc sends tha page seance
router.get('/seance', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training/seance', {
        id: req.query.id.trim(),
        page: req.query.page.trim(),
        style: false,
        title: title.training,
        userData: userData,
    });
});

// La page avec toutes les séances
router.get('/allSeances', (req, res) => {
    session(req,res);
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
   
    res.render('training/allSeances', { 
        style: false,
        title: title.training, 
        userData: userData,
    });
});


////////////////////////
/// The blocs of imc ///
////////////////////////


// This bloc calculate the imc
router.post('/setIMC', (req, res) => {
    session(req,res);
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
    const body = req.body.body.trim();
    const height = req.body.height.trim();
 
    if (body != '' && height != '') {
        userData.health.add(parseInt(body), parseInt(height));
        userData.save();
    };

    res.render('training/main', { 
        style: true,
        dataExercice: dataExercice(userData),
        title: title.training,
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
    });
});

// This bloc delete a imc
router.get('/deleteIMC', (req, res) => {
    session(req,res);
    const userData =  workoutClass.getData(req.session.pseudo);

    userData.health.delete(req.query.id.trim());
    userData.save();
   
    res.render('training/main', {
        style: true,
        dataExercice: dataExercice(userData),
        title: title.training, 
        userData: userData,
        seance: dataLenght(endWorkout(userData)),
    });
});



module.exports = router;