const express = require('express');
const router = express.Router();
const data = require('../data/account.json');
const Accounts = require('../public/javascripts/accouts');
const Account = require('../public/javascripts/account');
const popup = require('window-popup').windowPopup;


const accounts = new Accounts().load();

// Workout handle
 
router.get('/training', (req,res) => {
        
    res.render('training', { title: "Training"});
})

// Meal handle
 
router.get('/meal', (req,res) => {
    // calorie à changer
    res.render('meal', { title: "Meal", calorie: data[0].calorie})
})

router.post('/addCal', (req,res) => {
    const pseudo = accounts.get(req.body.ok_count_calorie);

    if (req.body.cal === ""){
        res.render('meal', { title: "Meal", calorie: pseudo.calorie })
        return;

    }

    
    const calorie = pseudo.calorie + parseInt(req.body.cal);
    const account = new Account(pseudo.pseudo, calorie, pseudo.sleep);

    pseudo.calorie = calorie;
    accounts.add(account);
    accounts.save();
    res.render('meal', { title: "Meal", calorie: calorie})
})


router.post('/homeAddCal', (req,res) => {
    const pseudo = accounts.get(req.body.ok_count_calorie);

    if (req.body.cal === ""){
        res.render('home', { title: "Home", calorie: pseudo.calorie })
        return;

    }    
    const calorie = pseudo.calorie + parseInt(req.body.cal);
    const account = new Account(pseudo.pseudo, calorie, pseudo.sleep);

    pseudo.calorie = calorie;
    accounts.add(account);
    accounts.save();
    res.render('home', { title: "Home", calorie: calorie})
})

router.post('/homeResetCal', (req,res) => {
    const pseudo = accounts.get(req.body.reset_count_calorie);
    const calorie = pseudo.calorie = 0;
    const account = new Account(pseudo.pseudo, calorie, pseudo.sleep);

    accounts.add(account);
    accounts.save();
    res.render('home', { title: "Home", calorie: calorie})
})

router.post('/resetCal', (req,res) => {
    const pseudo = accounts.get(req.body.reset_count_calorie);
    const calorie = pseudo.calorie = 0;
    const account = new Account(pseudo.pseudo, calorie, pseudo.sleep);

    accounts.add(account);
    accounts.save();
    res.render('meal', { title: "Meal", calorie: calorie})
})


router.post('/resetCal', (req,res) => {
    const pseudo = accounts.get(req.body.reset_count_calorie);
    const calorie = pseudo.calorie = 0;
    const account = new Account(pseudo.pseudo, calorie, pseudo.sleep);

    accounts.add(account);
    accounts.save();
    res.render('meal', { title: "Meal", calorie: calorie})
})

// Sleep handle
 
router.get('/sleep', (req,res) => {
    res.render('sleep', { title: "Sleep"})
})

// Profiles handle
 
router.get('/profiles', (req,res) => {
    res.render('profiles', { title: "Profiles", error: false})
})

router.get('/home', (req,res) => {
    res.render('home', { title: "Home", calorie: data[0].calorie})
})

router.post('/addWorkout', (req,res) => {
    console.log(req.body);
    res.render('training', { title: "Training"})
})

module.exports = router

