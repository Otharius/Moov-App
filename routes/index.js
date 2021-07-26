const express = require('express');
const router  = express.Router();

// Login page
router.get('/', (req,res) => {
    res.render('welcome');
})

// Register page
router.get('/register', (req,res) =>{
    res.render('register');
})

module.exports = router; 
