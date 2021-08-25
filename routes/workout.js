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
    const ajout = parseInt(req.body.cal)
    console.log(typeof(5))

    const calorie = data[0].calorie + ajout;
    const account = new Account("Otharius", calorie, 0)
    data[0].calorie = calorie;
    accounts.add(account);
    accounts.save()
    res.render('meal', { title: "Meal", calorie: calorie})
 


    
    //.load(calorie)

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

