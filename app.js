const express = require('express');
const router = express.Router();
const app = express();
//const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
//const http = require('http');
const https = require('https')
const fs = require('fs')

//mongoose
// mongoose
//     .connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
//     .then(() => console.log('connected,,'))
//     .catch((err)=> console.log(err));
//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//CSS
app.use(express.static(__dirname + '/public'));
//BodyParser
app.use(express.urlencoded({extended : false}));

//Routes
app.use('/sign',require('./routes/sign'));
app.use('/workout',require('./routes/workout'));
app.use('/',require('./routes/index'));

var privateKey = fs.readFileSync('C:/Users/Loïc Le Pennec/.ssh/privateKey.key', 'utf-8');
var certificate = fs.readFileSync('C:/Users/Loïc Le Pennec/.ssh/certificate.crt', 'utf-8');
var credentials = {key: privateKey, cert: certificate};

app.get('/', function(req,res) {
    res.send('hello');
});

//var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//httpServer.listen(8080);
httpsServer.listen(3000);

//app.listen(3000);
