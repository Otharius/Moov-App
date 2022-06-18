const express = require('express');
const router = express.Router();


const workoutClass = require('../public/javascripts/userData');
const Templates = workoutClass.Templates;
const Template = workoutClass.Template;
const exercices = require('../data/exercices.json');
const dataFields = exercices.fields;



function dataLenght (data) {
    try {
        if (data.length || data == null) {
           return true;
        };
    } catch (error) {
        return false;
    };
};

function deleteTemplate (data) {
    if (dataLenght(data)) {
        return data;
    } else {
        return null;
    }
}


router.get('/newTemplates', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.fields = [];

    res.render('training/templates/new', {
        style: false,
        dataFields: dataFields,
        fields: null,
        title: title.training,
        template: dataLenght(Object.keys(userData.templates)),
        id: req.session.idSeance,
        userData: userData,
        exercices: exercices,
    });
});



router.post('/newTemplate', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    const template = new Template(req.body.name);

    for (let i = 0; i < req.session.fields.length; i++) {
        template.add(req.session.fields[i]);
    };

    userData.addTemplate(template);
    userData.save();
    req.session.fields = []

    res.render('training/templates/new', {
        style: false,
        title: title.training,
        dataFields: dataFields,
        fields: null,
        template: dataLenght(Object.keys(userData.templates)),
        id: req.session.idSeance,
        userData: userData,
        exercices: exercices,
    });
});


router.post('/newField', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.fields.push(req.body.field)

    res.render('training/templates/new', {
        style: false,
        title: title.training,
        dataFields: dataFields,
        fields: req.session.fields,
        id: req.session.idSeance,
        template: dataLenght(Object.keys(userData.templates)),
        userData: userData,
        exercices: exercices,
    });
});

router.get('/deleteTemplate', (req,res) => {
    const userData = workoutClass.getData(req.session.pseudo);
    userData.deleteTemplate(req.query.template);
    userData.save()

    res.render('training/templates/new', {
        style: false,
        dataFields: dataFields,
        fields: deleteTemplate(req.session.fields),
        title: title.training,
        template: dataLenght(Object.keys(userData.templates)),
        id: req.session.idSeance,
        userData: userData,
        exercices: exercices,
    });
});

module.exports = router;