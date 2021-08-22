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

//CSS
app.use(express.static(__dirname + '/public'));


// //Routes
app.use('/workout',require('./routes/workout'));

app.use(session({
    secret: 'secret-key',
    saveUninitialized: false,
    resave: false}));

app.get('/', function(req,res) {
    req.session.isAuth = true;
    console.log(req.session);
    res.render('login')
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