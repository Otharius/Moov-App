const express = require('express');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('./config.json');
const session = require('express-session');
const handlebars = require('handlebars');


// App set
app.set('view engine','ejs');
app.set('trust proxy', 1);


// APP use
app.use(expressEjsLayout);
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(router);


// Router use
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "anyrandomstring",
  }));


  //CSS
app.use(express.static(__dirname + '/public'));


//Routes
app.use('/workout', require('./routes/workout'));
app.use('/sign', require('./routes/sign'));
app.use('/meal_sleep', require('./routes/meal_sleep'));
app.use('/home', require('./routes/home'));
app.use('/profiles', require('./routes/profiles'));



// Page quand on lance le serveur
router.get('/', function(req,res) {
    res.render('login', { title: "My App - Login", error: false, style: false})
});


// Lancement du serveur
// Choix du protocole http ou https dans le fichier json associé
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
