const express = require('express');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./config.json');
const session = require('express-session');


//const mongoose = require('mongoose');
//mongoose
// mongoose
//     .connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
//     .then(() => console.log('connected,,'))
//     .catch((err)=> console.log(err));
//EJS

app.set('view engine','ejs');
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({extended : false}));
app.use('/sign',require('./routes/sign'))
app.use(express.json());

//CSS
app.use(express.static(__dirname + '/public'));


// //Routes
app.use('/workout',require('./routes/workout'));

app.set('trust proxy', 1);
app.use(session({
    secret: 'keyboard cat',
    //resave: false,
    saveUninitialized: false,
    cookie: { //secure: true,
              maxAge: 60000 }
  }));


app.get('/', function(req,res) {
    const pseudo = req.session.pseudo = 'tatata';
    console.log("PSEUDO:"+pseudo);
    console.log("AUEHNTIFICATED"+req.session.authenticated);
    console.log("SESSIONID"+ req.sessionID)
    res.render('login', { title: "Login", error: false})
});


if (config.protocol === 'https') {
    const privateKey = fs.readFileSync(config.privateKeyPath, 'utf-8');
    const certificate = fs.readFileSync(config.certificatePath, 'utf-8');
    var credentials = {key: privateKey, cert: certificate};
    var server = https.createServer(credentials, app);
    server.listen(3000 , console.log('Server running on https://localhost:3000'));
} else if (config.protocol === 'http') {
    const server = http.createServer(app);
    server.listen(3000, console.log('Server running on https://localhost:3000'));
} else {
    console.log('Unkown protocol ' + config.protocol);
}

module.exports = session;