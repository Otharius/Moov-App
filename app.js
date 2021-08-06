const express = require('express');
const router = express.Router();
const app = express();
//const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts');
const http = require('http');
const https = require('https')
const fs = require('fs')
const config = require('./config.json')

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

app.get('/', function(req,res) {
    res.send('hello');
});

if (config.protocol === 'https') {
    const privateKey = fs.readFileSync(config.privateKeyPath, 'utf-8');
    const certificate = fs.readFileSync(config.certificatePath, 'utf-8');
    var credentials = {key: privateKey, cert: certificate};
    var server = https.createServer(credentials, app);
    server.listen(3000);
} else if (config.protocol === 'http') {
    const server = http.createServer(app);
    server.listen(3000);
} else {
    console.log('Unkown protocol ' + config.protocol);
}