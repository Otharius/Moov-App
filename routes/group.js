const express = require('express');
const router = express.Router();
const groupClass = require('../public/javascripts/rights');
const Right = groupClass.Right;
const Rights = groupClass.Rights;
const Group = groupClass.Group;
const Groups = groupClass.Groups;
const groups = new Groups().load();


router.get('/group', (req,res) => {
    const values = Array.from(groups.groups.values())
    console.log(values)
    console.log(values[0])
    console.log(values[0].name)

    res.render('group/group', { 
        style: true,
        title: title.training,
        groups: values,
    });
})

router.post('/new', (req,res) => {
    const right = new Right(req.session.pseudo, req.body.name);
    const group =  new Group(req.body.name).addRight(right)

    groups.add(group);
    groups.save();


    res.render('group/group', { 
        style: true,
        title: title.training,
        groups: groups,
    });
})



module.exports = router;