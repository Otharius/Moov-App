const express = require('express');
const user = require('./sign');
const router = express.Router();

// Workout handle
 
router.get('/training', (req,res) => {
    res.render('training')
})

// Meal handle
 
router.get('/meal', (req,res) => {
    res.render('meal')
})

// Sleep handle
 
router.get('/sleep', (req,res) => {
    res.render('sleep')
})

// Profiles handle
 
router.get('/profiles', (req,res) => {
    res.render('profiles')
})

router.get('/home', (req,res) => {
    res.render('home')
})

module.exports = router

