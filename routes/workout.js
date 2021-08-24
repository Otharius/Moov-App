const express = require('express');
const router = express.Router();
const data = require('../data/account.json');
const Accounts = require('../public/javascripts/accouts');
const Account = require('../public/javascripts/account');


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
    const calorie = data[0].calorie + parseInt(req.body.cal);
    //.load(calorie)
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

