const express = require('express');
const router = express.Router();

const workoutClass = require('../public/javascripts/userData');
const Seance = workoutClass.Seance;
const Job = workoutClass.Job;

const Users = require('../public/javascripts/users');
const User = require('../public/javascripts/user');
const users = new Users().load();

const exMuscu =  require('../data/exercices.json').exerciceWorkout;


//FONCTION SI ON A PAS D'ENTRAINEMENT
function oldOrNew (data) {
    try {
        if (data.length) {
           return true;
        };
    } catch (error) {
        return false;
    };
};

function bodyOrNot (data) {
    try {
        if (data.health.body.length) {
           return true;
        };
    } catch (error) {
        return false;
    };
}


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
    sessionSecure(req, res);
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training', { 
        style: true,
        title: title.training,
        userData: userData,
        old: oldOrNew(userData.workout.seances),
        exMuscu: exMuscu,
        a: true,
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



// AJOUT DES CALORIES SUR LA PAGE D'ACCUEIL
router.post('/homeAddCal', (req,res) => {
    sessionSecure(req,res);

    const userData =  workoutClass.getData(req.session.pseudo);

    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();

    res.render('home', { 
        style: true,
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: oldOrNew(userData.workout.seances),
        user: users.get(req.session.pseudo)
     });
});



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ACCUEIL
router.post('/homeResetCal', (req,res) => {
    sessionSecure(req,res);

    const userData =  workoutClass.getData(req.session.pseudo);
    userData.health.setCalories(0);
    userData.save();

    res.render('home', { 
        style: true,
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        old: oldOrNew(userData.workout.seances),
        user: users.get(req.session.pseudo)
    });
});



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



// PAGE DE SOMMEIL
router.get('/sleep', (req,res) => {
    sessionSecure(req,res);
    res.render('sleep', { 
        style: true,
        title: title.sleep,
        userData: workoutClass.getData(req.session.pseudo),
    });
});



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



// LA PAGE D'ACCUEIL
router.get('/home', (req,res) => {
    sessionSecure(req,res);

    const userData = workoutClass.getData(req.session.pseudo);

    res.render('home', { 
        style: true,
        title: title.home, 
        user: users.get(req.session.pseudo),
        userData: userData,
        old: oldOrNew(userData.workout.seances),
    });
});



// AJOUTE DES ENTRAINEMENTS
router.post('/addWorkout', (req,res) => {
    sessionSecure(req,res);

    const seance = new Seance(req.body.training_name, req.body.date, null, false, req.body.detail, req.body.type);
    for (let i = 0; i<req.body.repetition.length; i++) {
        const job = new Job(req.body.exercice[i], req.body.repetition[i], req.body.serie[i], req.body.reposSec[i]);
        seance.add(job);
    };
    
    const userData =  workoutClass.getData(req.session.pseudo);
    userData.workout.add(seance);
    userData.save();

    res.render('training', { 
        style: true,
        title: title.home, 
        userData: userData,
        old: oldOrNew(userData.workout.seances),
        exMuscu: exMuscu,
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
    
    res.render('training', { 
        style: true,
        title: title.training, 
        userData: userData,
        old: oldOrNew(userData),
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
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
    userData.workout.delete(req.body.supprimer);
    userData.save();
   
    res.render('training', { 
        style: true,
        title: title.training, 
        userData: userData,
        old: oldOrNew(userData),
        exMuscu: exMuscu,
    });
});



// Calcule l'IMC de l'utilisateur
router.post('/setIMC', (req, res) => {
    const pseudo = req.session.pseudo;
    const userData =  workoutClass.getData(pseudo);
    const body = req.body.body;
    const height = req.body.height;

    if (body === '' || height === '') {
        res.render('training', { 
            style: true,
            title: title.training, 
            userData: workoutClass.getData(pseudo),
            old: oldOrNew(userData),
            exMuscu: exMuscu,
        });
    };

    userData.health.add(parseInt(body), parseInt(height));
    userData.save()
    res.render('training', { 
        style: true,
        title: title.training, 
        userData: workoutClass.getData(pseudo),
        old: oldOrNew(userData),
        a: bodyOrNot(userData),
        exMuscu: exMuscu,
    });
})

module.exports = router;