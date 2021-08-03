const express = require('express');
const router = express.Router();
const data = require('../data/users.json')
const Users = require('../public/javascripts/users1.js');
const fs = require('fs')
// Login handle

router.get('/login', (req,res) => {
    res.render('login');
})

router.get('/register', (req,res) => {
    res.render('register');
})

// Workout handle

router.get('/workout', (req,res) => {
    res.render('workout')
})

// Register handle

router.post('/register', (req,res) => {
    const pseudo = req.body.pseudo;
    //const firstname = ;
    //const data = JSON.parse(Data)
    const users = new Users().load();
    const exist = users.exist(req.body.pseudo);
    users.save();
    if(exist){
        res.send('Pseudo déjà utilisé')
    }else{
        res.send('Pseudo non-utilisé')
    }
})



router.post('/login', (req,res,next) => {
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    for (let i=0; i<data.users.length; i++) {
        if (data.users[i].pseudo === pseudo) {
            if (data.users[i].pwd === password) {
                res.render('accueil')
                //res.send("Vous êtes connecté en tant que  "  + data.users[i].firstname);
            } else {
                res.send("Mauvais mot de passe pour "  + data.users[i].firstname);
            }
            return;
        }
    }
    res.send("Vous n'existez pas");

})

// Logout

router.get('/logout', (req,res) => {
})

module.exports = router


