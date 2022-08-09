const express = require('express');
const router = express.Router();
const groupClass = require('../public/javascripts/rights');
const workoutClass = require('../public/javascripts/userData');
const Right = groupClass.Right;
const Group = groupClass.Group;
const Groups = groupClass.Groups;
const Users = require('../public/javascripts/users.js');
const groups = new Groups().load();
const users = new Users().load();



//FONCTION SI ON A PAS D'ENTRAINEMENT
function groupsLenght () {
    if (groups.groups.size === 0) {
        return false;
    } else {
        return true;
    }
};

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

router.get('/group', (req,res) => {
    req.session.group = req.query.group;
    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
});



router.post('/new', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);

    if (req.body.name != '') {
        const right = new Right(req.session.pseudo, req.body.name);
        const group =  new Group(req.body.name).addRight(right);
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
    const right = new Right(req.session.pseudo, req.body.name);

    try {
        if (group.rights.rights.get(req.session.pseudo).admin === true) {
            right.grantAdmin();
        }
    } catch (error) {
    };

    groups.get(req.body.name).addRight(right);
    groups.save();


    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
});



router.get('/delete', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    groups.delete(req.query.name);
    groups.save()

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



router.get('/grantCoatch', (req,res) => {
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).grantCoatch()
    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})



router.get('/denyCoatch', (req,res) => {
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).denyCoatch()
    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})



router.get('/grantTrainee', (req,res) => {
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).grantTrainee()
    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})



router.get('/denyTrainee', (req,res) => {
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).denyTrainee()
    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})



router.get('/grantAdmin', (req,res) => {
    const group = groups.get(req.query.group).rights.rights;
    group.get(req.query.pseudo).grantAdmin();
    group.get(req.session.pseudo).denyAdmin();

    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        group: groups.get(req.session.group),
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})


module.exports = router;