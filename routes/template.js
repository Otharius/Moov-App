///////////////////
/// The modules ///
///////////////////


// Basics modules
const express = require('express');
const router = express.Router();

// Trainings modules
const workoutClass = require('../public/javascripts/userData');
const Template = workoutClass.Template;
const exercices = require('../data/exercices.json');
const dataFields = exercices.fields;


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



function deleteTemplate (data) {

    if (dataLenght(data)) {
        return data;
    } else {
        return null;
    };
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



router.get('/newTemplates', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    req.session.fields = [];

    res.render('training/templates/new', {
        style: false,
        dataFields: dataFields,
        fields: null,
        title: title.training,
        template: dataLenght(Object.keys(userData.templates)),
        userData: userData,
    });
});



router.post('/newTemplate', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    let fields = null;
    if (req.body.name.trim() != "") {
        const template = new Template(req.body.name.trim());

        if (dataLenght(req.session.fields)) {
            for (let i = 0; i < req.session.fields.length; i++) {
                template.add(req.session.fields[i]);
            };
        
            userData.addTemplate(template);
            userData.save();
            req.session.fields = [];
            fields = null;
        };
    } else {
        fields = req.session.fields;
    };


    res.render('training/templates/new', {
        style: false,
        title: title.training,
        dataFields: dataFields,
        fields: fields,
        template: dataLenght(Object.keys(userData.templates)),
        userData: userData,
    });
});



router.post('/newField', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);

    let fields = req.session.fields;
    if (fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
            if (!fields.includes(req.body.field.trim())) {
                req.session.fields.push(req.body.field.trim());
            };
        };
    } else {
        req.session.fields.push(req.body.field.trim());
    };

    res.render('training/templates/new', {
        style: false,
        title: title.training,
        dataFields: dataFields,
        fields: req.session.fields,
        template: dataLenght(Object.keys(userData.templates)),
        userData: userData,
    });
});



router.get('/deleteTemplate', (req,res) => {
    session(req,res);
    const userData = workoutClass.getData(req.session.pseudo);
    userData.deleteTemplate(req.query.template.trim());
    userData.save();

    res.render('training/templates/new', {
        style: false,
        dataFields: dataFields,
        fields: deleteTemplate(req.session.fields),
        title: title.training,
        template: dataLenght(Object.keys(userData.templates)),
        userData: userData,
    });
});



module.exports = router;