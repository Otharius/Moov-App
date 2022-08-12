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
const Training = workoutClass.Training;
const Seance = workoutClass.Seance;




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
    const users = new Users().load();

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
    const users = new Users().load();

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
    const users = new Users().load();
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
    const users = new Users().load();
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





// Partie sur les groupes -----------------------------------------------------------------------------------------------------------------






router.get('/group', (req,res) => {
    req.session.group = req.query.group;
    const userData =  workoutClass.getData(req.session.pseudo);
    const users = new Users().load();
    console.log(groups.get(req.query.group))
    res.render('group/group', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.query.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
});



router.post('/new', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();
    const name = req.body.name.trim();

    if (name != '' && groups.exist(name) === false) {
        const right = new Right(req.session.pseudo, req.body.name);
        const group =  new Group(name, true).addRight(right);
        right.grantAdmin();
        groups.add(group);
        groups.save();
    }

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




router.post('/add', (req,res) => {
    // Savoir si la personne est ds le groupe
    const group = groups.get(req.body.name);
    if (groups.exist(req.body.name) && group.open === true) {

        const right = new Right(req.session.pseudo, req.body.name);
    
        try {
            if (group.rights.rights.get(req.session.pseudo).admin === true) {
                right.grantAdmin();
            }
        } catch (error) {
        };
    
        groups.get(req.body.name).addRight(right);
        groups.save();
    
    }

    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();

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



router.get('/delete', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const users = new Users().load();
    groups.delete(req.query.name);
    groups.save();

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
})


// For grant a people to coatch
router.get('/grantCoatch', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).grantCoatch();
    groups.save();


    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})


// For deny a coatch
router.get('/denyCoatch', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).denyCoatch()
    groups.save()

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})


// For grant a trainee
router.get('/grantTrainee', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).grantTrainee()
    groups.save()

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})


// For deny a trainee
router.get('/denyTrainee', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).denyTrainee()
    groups.save()

    res.render('group/user', { 
        style: false,
        title: title.training,
        userData: userData,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})


// For grant admin a other people and deny the old admin
router.get('/grantAdmin', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    const group = groups.get(req.query.group).rights.rights;
    group.get(req.query.pseudo).grantAdmin();
    group.get(req.session.pseudo).denyAdmin();

    groups.save()

    res.render('group/user', { 
        style: false,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})



router.get('/leave', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const user = groups.groups.get(req.query.name).rights.rights.get(req.session.pseudo).admin;
    let page = null;
    let group = null;
    if (user === false) {
        groups.get(req.query.name).deleteRight(req.session.pseudo);
        groups.save() ;
        page = 'home/main';
        group = groups.groups;

    } else {
        page = 'group/group';
        group = groups.get(req.session.group);
    }
    const users = new Users().load();

    res.render(page, { 
        style: page === "group/group" ? false : true,
        length: groupsLenght(),
        groups: group,
        exercices: exercices,
        userBody: dataLenght(userData.health.body),
        title: title.home, 
        user: users.get(req.session.pseudo),
        seance: dataLenght(endWorkout(userData)),
        userData: userData,
        old: dataLenght(userData.workout.seances),
    });
})


router.get('/exclude', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.query.group).deleteRight(req.query.pseudo);
    groups.save() ;


    res.render('group/group', { 
        style: false,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})

router.get('/changeStatus', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);
    groups.get(req.query.name).changeStatus();
    groups.save() ;

    res.render('group/group', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})

router.get('/groupUser', (req,res) => {
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);

    res.render('group/user', { 
        style: false,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})

router.get('/newSeanceGroup', (req,res) => {
    
    const users = new Users().load();
    const userData =  workoutClass.getData(req.session.pseudo);

    res.render('group/newSeance', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
        viewUser: users.get(req.query.pseudo),
    });
})

router.post('/addGroupSeance', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);

    const duration = parseInt(req.body.durationHeure) * 60 + parseInt(req.body.durationMin);
    const seance = new GroupSeance(req.body.training_name, req.body.date, req.body.detail, duration);
    const type = Array.isArray(req.body.pseudo);

    if (req.body.time.trim() != '') {
        seance.withTime(req.body.time)
    };
    
    if (type) {
        for (let i=0; i<req.body.pseudo.length; i++) {
           seance.addUser(req.body.pseudo[i]);
        }
    } else {
        seance.addUser(req.body.pseudo);
    }
    
    groups.get(req.session.group).addSeance(seance);
    groups.save();

    res.render('group/newSeance', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})


router.post('/newJobGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    const job = Training.create(req, userData);
    groups.get(req.session.group).seances[req.session.seanceGroup].add(job, req.session.idSeance);
    groups.save();

    res.render('group/newJob', { 
        style: false,
        exercices: exercices,
        userData: userData,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})

router.post('/goJobGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.seanceGroup = req.body.idSeance;

    res.render('group/newJob', { 
        style: false,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})



router.get('/seanceGroup', (req,res) => {
    const users = new Users().load();
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.seanceGroupId = parseInt(req.query.id);


    res.render('group/seanceGroup', { 
        style: false,
        id: req.session.seanceGroupId,
        userData: userData,
        exercices: exercices,
        title: title.training,
        groups: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})




module.exports = router;