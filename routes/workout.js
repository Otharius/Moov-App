const express = require('express');
const router = express.Router();
const data = require('../data/account.json');
const Accounts = require('../public/javascripts/accouts');
const Account = require('../public/javascripts/account');

const accounts = new Accounts().load();

// Workout handle
 
router.get('/training', (req,res) => {
    res.render('training', { title: "Training"})
})

// Meal handle
 
router.get('/meal', (req,res) => {
    const calorie = data[0].calorie
    res.render('meal', { title: "Meal", calorie: calorie})
})

router.post('/addCal', (req,res) => {

    if (req.body.cal === null){
        return;
    }

    const ajout = parseInt(req.body.cal);


    const calorie = data[0].calorie + ajout;
    const sleep = data[0].sleep;
    const account = new Account("Otharius", calorie, sleep);
    data[0].calorie = calorie;
    accounts.add(account);
    accounts.save();
    res.render('meal', { title: "Meal", calorie: calorie})

})

router.post('/resetCal', (req,res) => {
    const calorie = data[0].calorie = 0;
    const sleep = data[0].sleep;
    const account = new Account("Otharius", calorie, sleep)
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
    res.render('home', { title: "Home"})
})

module.exports = router

