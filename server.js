const express = require('express')
require('dotenv').config()
var morgan = require('morgan')
const hbs = require('hbs');
var path = require('path');
var session = require('express-session');
require('./helpers/helpers');


const app = express()

// config file
const PUERTO = process.env.PORT || 3000;

// view engine
app.set('view engine', 'hbs');
app.set('views', [
    path.join('./views/front'),
    path.join('./views/back'), 
    path.join('./views')
])
hbs.registerPartials(__dirname + '/views/partials');

// middlewares
app.use(session({
	secret: process.env.SESSION_SECRET,
    resave: true,
	saveUninitialized: false,
    cookie: { maxAge: 600000 }
})); // tutoriales: https://codeshack.io/basic-login-system-nodejs-express-mysql/ y https://medium.com/weekly-webtips/how-to-create-a-simple-login-functionality-in-express-5274c44c20df
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// routes
app.use('/', require('./routes/rutas'))


// publico
// app.use(express.static(__dirname + 'public'))
app.use('/', express.static(__dirname + '/public'))

// 404
app.use(function(req, res, next) {
  res.status(404).render('404');
});

// Errores 
app.use(function(err, req, res, next) {
  console.error("ERR.STACK", err.stack);
  res.status(500).send('Hubo un error con el servidor ' + err);
});



app.listen(PUERTO, () => {
    console.log(`Escuchando en ${PUERTO}`)
})
