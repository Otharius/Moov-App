const express = require('express');
const router = express.Router();
const groupClass = require('../public/javascripts/rights');
const Right = groupClass.Right;
const Rights = groupClass.Rights;
const Group = groupClass.Group;
const Groups = groupClass.Groups;
const groups = new Groups().load();


router.get('/group', (req,res) => {

    res.render('group/group', { 
        style: true,
        title: title.training,

    });
})

router.post('/new', (req,res) => {
    const right = new Right(req.session.pseudo, req.body.name);
    const group =  new Group(req.body.name).addRight(right)
    //bon

    groups.add(group);
    groups.save();


    res.render('group/group', { 
        style: true,
        title: title.training,

    });
})



module.exports = router;