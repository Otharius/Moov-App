const express = require('express');
const router = express.Router();
const groupClass = require('../public/javascripts/rights');
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



router.get('/group', (req,res) => {
    res.render('group/group', { 
        style: true,
        title: title.training,
        groups: groups.groups,
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
});



router.post('/new', (req,res) => {

    if (req.body.name != '') {
        const right = new Right(req.session.pseudo, req.body.name);
        const group =  new Group(req.body.name).addRight(right);
        right.grantAdmin();
        groups.add(group);
        groups.save();
    }

    res.render('group/group', { 
        style: true,
        title: title.training,
        groups: groups.groups,
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
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
        groups: groups.groups,
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
});



router.get('/delete', (req,res) => {
    groups.delete(req.query.name);
    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        groups: groups.groups,
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})



router.get('/grantCoatch', (req,res) => {
    groups.get(req.query.group).rights.rights.get(req.query.pseudo).grantCoatch()
    groups.save()

    res.render('group/group', { 
        style: true,
        title: title.training,
        groups: groups.groups,
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
        groups: groups.groups,
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
        groups: groups.groups,
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
        groups: groups.groups,
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
        groups: groups.groups,
        length: groupsLenght(),
        user: users.get(req.session.pseudo),
    });
})


module.exports = router;