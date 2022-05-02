const express = require('express');
const router = express.Router();


const workoutClass = require('../public/javascripts/userData');
const Templates = workoutClass.Templates;
const exercices = require('../data/exercices.json');

router.get('/newTemplates', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);

    res.render('training/templates/new', {
        style: false,
        title: title.training,
        id: req.session.idSeance,
        userData: userData,
        exercices: exercices,
    });
});



router.post('/newTemplate', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    userData.templates.add(req.body.name);
    console.log(userData)
    userData.save()


    res.render('training/templates/new', {
        style: false,
        title: title.training,
        id: req.session.idSeance,
        userData: userData,
        exercices: exercices,
    });
});


module.exports = router;