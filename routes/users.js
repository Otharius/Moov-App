const express = require('express');
const router = express.Router();
const Data = require('../../oss2021/data/users.json')

// Login handle

router.get('/login', (req,res) => {
    /*
    console.log("//LOGIN.1");
    */
    res.render('login');
})

router.get('/register', (req,res) => {
    /*
    console.log("//REGISTER.1");
    console.log("//----------------");
    console.log(req);
    console.log("//----------------");
    */
    res.render('register');
})

// Register handle

router.post('/register', (req,res) => {
    //console.log("//REGISTER.2");
    const pseudo = req.body.pseudo;
    //const firstname = ;
    //const data = JSON.parse(Data)
    for(let i=0;Data.users[i].username;i++){
        if(Data.users[i].username === pseudo) {
            res.send("Vous êtes le "  + i);
            return;
        }
    }
    res.send("Vous n'existez pas");
})

router.post('/login', (req,res,next) => {
    //console.log("//LOGIN.2");
})

// Logout

router.get('/logout', (req,res) => {
    //console.log("//LOGOUT");
})

module.exports  = router;



