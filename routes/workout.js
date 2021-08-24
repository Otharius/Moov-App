const express = require('express');
const router = express.Router();
const fs = require('fs')

// Workout handle
 
router.get('/training', (req,res) => {
    res.render('training', { title: "Training"})
})

// Meal handle
 
router.get('/meal', (req,res) => {
    res.render('meal', { title: "Meal", calorie: 0})
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

