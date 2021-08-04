const express = require('express');

const router = express.Router();

// Workout handle
 
router.get('/training', (req,res) => {
    res.render('training')
})

// Profiles handle
 
router.get('/home', (req,res) => {
    res.render('home')
})

router.post('/profiles', (req,res) => {
    res.render('login')

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

module.exports = router



