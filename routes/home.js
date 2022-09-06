const express = require('express');
const router = express.Router();
const groupClass = require('../public/javascripts/rights');
const workoutClass = require('../public/javascripts/userData');
const Right = groupClass.Right;
const Group = groupClass.Group;
const GroupSeance = groupClass.GroupSeance;
const Groups = groupClass.Groups;
const Users = require('../public/javascripts/users.js');
const groups = new Groups().load();
const exercices = require('../data/exercices.json');
const { trim } = require('jquery');
const Training = workoutClass.Training;



/////////////////////
/// The functions ///
/////////////////////



// This function test the length of data
function dataLenght (data) {
    try {
        if (data.length) {
           return true;
        };
    } catch (error) {
        return false;
    };
};



// FONCTION RAJOUTE DES CALORIES
function addCalorie (calories) {
    if (calories.trim() === "" || isNaN(parseInt(calories))) {
        return 0;
    }

    return parseInt(calories);
};


// Fonction qui classe les séances finies et les séances en cours
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


function session (req,res) {
    if (req.session.pseudo == undefined) {
        res.render('sign/login', {
            style: false,
            title: title.login, 
            error: false,
        });
    };
};


// The home page
router.get('/home', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();


    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
    });
});



// AJOUT DES CALORIES SUR LA PAGE D'ACCUEIL
router.post('/homeAddCal', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();

    userData.health.setCalories(userData.health.calories + addCalorie(req.body.calories));
    userData.save();


    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        seance: dataLenght(endWorkout(userData)),
        userData: workoutClass.getData(req.session.pseudo),
        user: users.get(req.session.pseudo)
     });
});



// REMET A 0 LE NOMBRE DE CALORIE SUR LA PAGE D'ACCUEIL
router.post('/homeResetCal', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();
    userData.health.setCalories(0);
    userData.save();


    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
    });
});



router.post('/afterWorkout', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();
    userData.workout.seances[req.body.rpe.trim()].difficulty = req.body.difficulty.trim();
    userData.workout.seances[req.body.rpe.trim()].note = req.body.note.trim();
    userData.save();

    
    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        userData: workoutClass.getData(req.session.pseudo),
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
    });
});





// Partie sur les groupes -----------------------------------------------------------------------------------------------------------------






router.get('/group', (req,res) => {
    const userData =  workoutClass.getData(req.session.pseudo);
    const users = new Users().load();

    if (req.query.group != undefined) {
        req.session.group = req.query.group.trim();
    };
    

    res.render('group/group', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.post('/new', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();
    const name = req.body.name.trim();

    if (name != '' && groups.exist(name) === false) {
        const right = new Right(req.session.pseudo, name);
        const group =  new Group(name, true).addRight(right);
        right.grantAdmin();
        groups.add(group);
        groups.save();
    }


    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
    });
});




router.post('/add', (req,res) => {
    const name = req.body.name.trim()
    const group = groups.get(name);
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();

    if (groups.exist(name) && group.open === true) {

        const right = new Right(req.session.pseudo, name);
    
        try {
            if (group.rights.rights.get(req.session.pseudo).admin === true) {
                right.grantAdmin();
            }
        } catch (error) {};
    
        groups.get(name).addRight(right);
        groups.save();
    
    };


    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
    });
});



router.get('/delete', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();

    groups.delete(req.session.group.trim());
    groups.save();
    delete req.session.group;

    res.render('home/main', { 
        style: true,
        groups: groups.groups,
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
    });
});


// For grant a people to coatch
router.get('/grantCoatch', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);

    groups.get(req.session.group).rights.rights.get(req.query.pseudo).grantCoatch();
    groups.save();

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
});



// For deny a coatch
router.get('/denyCoatch', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.session.group.trim()).rights.rights.get(req.query.pseudo.trim()).denyCoatch()
    groups.save();

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo.trim()),
    });
});


// For grant a trainee
router.get('/grantTrainee', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.session.group).rights.rights.get(req.query.pseudo.trim()).grantTrainee()
    groups.save();

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo.trim()),
    });
});



// For deny a trainee
router.get('/denyTrainee', (req,res) => {
    const users = new Users().load();
    const pseudo = req.query.pseudo.trim();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.session.group.trim()).rights.rights.get(pseudo).denyTrainee()
    groups.save();

    res.render('group/user', { 
        style: false,
        title: title.training,
        userData: userData,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
        viewUser: users.get(pseudo),
    });
});


// For grant admin a other people and deny the old admin
router.get('/grantAdmin', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    const group = groups.get(req.session.group.trim()).rights.rights;
    group.get(req.query.pseudo.trim()).grantAdmin();
    group.get(req.session.pseudo).denyAdmin();

    groups.save()

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo.trim()),
    });
});



router.get('/leave', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const user = groups.groups.get(req.session.group.trim()).rights.rights.get(req.session.pseudo).admin;
    let page = null;
    let group = null;
    if (user === false) {
        groups.get(req.session.group.trim()).deleteRight(req.session.pseudo);
        groups.save();
        delete req.session.group;
        page = 'home/main';
        group = groups.groups;

    } else {
        page = 'group/group';
        group = groups.get(req.session.group);
    }
    const users = new Users().load();


    res.render(page, { 
        style: page === "group/group" ? false : true,
        groups: group,
        exercices: exercices,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
        old: dataLenght(userData.workout.seances),
    });
});



router.get('/exclude', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    groups.get(req.session.group.trim()).deleteRight(req.query.pseudo.trim());
    groups.save();


    res.render('group/group', { 
        style: false,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.get('/changeStatus', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.session.group.trim()).changeStatus();
    groups.save();


    res.render('group/group', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.get('/groupUser', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);


    res.render('group/user', { 
        style: false,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo.trim()),
    });
});



router.get('/newSeanceGroup', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);

    res.render('group/newSeance', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.post('/addGroupSeance', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);

    if (req.body.pseudo != undefined) {
        const duration = parseInt(req.body.durationHeure.trim()) * 60 + parseInt(req.body.durationMin.trim());
        const seance = new GroupSeance(req.body.training_name.trim(), req.body.date.trim(), req.body.detail.trim(), duration);
        const type = Array.isArray(req.body.pseudo);
    
        if (req.body.time.trim() != '') {
            seance.withTime(req.body.time.trim());
        };
        
        if (type) {
            for (let i=0; i<req.body.pseudo.length; i++) {
               seance.addUser(req.body.pseudo[i].trim()).addAfter(req.body.pseudo[i].trim());
            };
        } else {
            seance.addUser(req.body.pseudo.trim()).addAfter(req.body.pseudo.trim());
        };
        
        groups.get(req.session.group).addSeance(seance);
        groups.save();
    
    };


    res.render('group/newSeance', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});


router.post('/newJobGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    const job = Training.create(req, userData);
    groups.get(req.session.group).seances[req.session.seanceGroup].add(job, req.session.idSeance);
    groups.save();


    res.render('group/newJob', { 
        style: false,
        exercices: exercices,
        id: req.session.seanceGroup,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.get('/deleteJob', (req, res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    groups.get(req.session.group).seances[req.session.seanceGroup].delete(req.query.job.trim());
    groups.save();

    res.render('group/newJob', {
        style: false,
        exercices: exercices,
        id: req.session.seanceGroup,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.get('/endSeance', (req, res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    const obj = groups.get(req.session.group).seances[req.session.seanceGroupId].after.find(item => item.pseudo === req.session.pseudo);
    obj.done = true;
    groups.save();

    res.render('group/seanceGroup', {
        style: false,
        id: req.session.seanceGroupId,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});


// L'after entrainement
router.post('/afterSeanceGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    const obj = groups.get(req.session.group).seances[req.session.seanceGroupId].after.find(item => item.pseudo === req.session.pseudo);
    obj.difficulty = req.body.difficulty.trim();
    groups.save();
    
    res.render('group/seanceGroup', { 
        style: false,
        id: req.session.seanceGroupId,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});





router.post('/goJobGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.seanceGroup = req.body.idSeance.trim();


    res.render('group/newJob', { 
        style: false,
        userData: userData,
        id: req.session.seanceGroup,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});



router.get('/seanceGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.seanceGroupId = parseInt(req.query.id.trim());


    res.render('group/seanceGroup', { 
        style: false,
        id: req.session.seanceGroupId,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        user: users.get(req.session.pseudo),
    });
});


router.get('/deleteSeance', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    const group = groups.get(req.session.group);
    group.deleteSeance(req.session.seanceGroupId);
    groups.save();
    delete req.session.seanceGroupId;

    res.render('group/group', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: group,
        user: users.get(req.session.pseudo),
    });
});






module.exports = router;