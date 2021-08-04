const express = require('express');
const router = express.Router();
const data = require('../data/user.json')
const Users = require('../public/javascripts/users1.js');
const fs = require('fs');
const User = require('/dev/oss2021/public/javascripts/user');
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
    const firstname = req.body.firstname;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    //const data = JSON.parse(Data)
    const users = new Users().load();
    const exist = users.exist(req.body.pseudo);

    if (exist) {
        res.send('Pseudo déjà utilisé');
    } else {
        if (password === password2) {
            const user = new User(pseudo, name, firstname).withEmail(email).withPassword(password);
            users.add(user);
            users.save();
            res.render('login');
        }
    }
})



router.post('/login', (req,res,next) => {
    const pseudo = req.body.pseudo;
    const password = req.body.password;
    for (let i=0; i<data.length; i++) {
        if (data[i].pseudo === pseudo) {
            if (data[i].password === password) {
                res.render('accueil')
                //res.send("Vous êtes connecté en tant que  "  + data.users[i].firstname);
            } else {
                res.send("Mauvais mot de passe pour "  + data[i].firstname);
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


