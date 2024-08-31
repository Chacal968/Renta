const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');

const misControles = require('./controllers/misControles');

app.set('port', process.env.PORT || 3000);
app.set( 'view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use( morgan('dev'));

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/', misControles);

app.use(express.static(path.join(__dirname, 'public'))); 

app.listen(app.get('port'), () => { 
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});