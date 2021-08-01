const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
//mongoose
mongoose
    .connect('mongodb://localhost/test',{useNewUrlParser: true, useUnifiedTopology : true})
    .then(() => console.log('connected,,'))
    .catch((err)=> console.log(err));
//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);
//CSS
app.use(express.static(__dirname + '/public'));
//BodyParser
app.use(express.urlencoded({extended : false}));

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

//const data = require('./data/users.json');
//console.log(data);
//console.log(data.users);

app.listen(3000);