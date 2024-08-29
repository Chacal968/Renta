const express = require('express');
const app = express();
const morgan = require('morgan'); // Registrar las peticiones entrantes
const path = require('path');

//const mysql = require('mysql');
//const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');
const cors = require('cors');
//const multer = require('multer'); // Para el tratamiento de imagenes

// Importar rutas
const misControles = require('./controllers/misControles');

// Setting 
app.set('port', process.env.PORT || 3000);
app.set( 'view engine', 'ejs'); // Usar EJS como motor de plantilla
app.set('views', path.join(__dirname, 'views')); // Definir la carpeta del motor de plantillas

// Configuración de multer para manejar archivos
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

// Midlewares (antes de las peticiones)
app.use( morgan('dev'));
/*
app.use(myConnection( mysql, {  // Crear la conexión con la BD.
    host: 'localhost',
    user: 'renta',
    password: 'renta',
    port: '3306',
    database: 'renta'
    /*
    host: '192.168.220.128',
    user: 'prueba',
    password: 'prueba',
    port: '3306',
    database: 'renta'*

}, 'single'));
*/
app.use(express.urlencoded({extended: false})); // metodo para entender los datos que vienen del formulario, sin imagenes ni codificacion
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Configuración de la conexión a la base de datos
/*
const db = mysql.createConnection({
    host: 'localhost',
    user: 'renta',
    password: 'renta',
    port: '3306',
    database: 'renta'
});*/
/*
const db = mysql.createConnection({
    host: '192.168.220.128',
    user: 'prueba',
    password: 'prueba',
    port: '3306',
    database: 'renta'
});
*/
// Conectar a la base de datos
/*
db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});*/

// Routes (Peticiones de los usuarios: /empleados, /proyecto, etc.)
app.use('/', misControles);

// Endpoint para poblar los polos turisticos

/*
app.post('/get-polotur', (req, res) => {
    const ProvinciaId = req.body.id;

    console.log('ProvSel = ' + ProvinciaId);

    const sql = 'SELECT id, nombre_polo FROM polos_turisticos WHERE provincia = ' + ProvinciaId;
    db.query(sql, [ProvinciaId], (err, results) => {
        if (err) console.log(err.message);

        // Generar opciones para el SELECT
        const options = results.map(row => `<option value="${row.id}">${row.nombre_polo}</option>`).join('');
        //res.send(<option value="">Polo</option> ${options});
        res.send(options);
    });
});
*/

// Ficheros estáticos
app.use(express.static(path.join(__dirname, 'public'))); 
/*
// Ruta para subir la imagen
app.post('/upload', upload.single('image'), (req, res) => {
    const image = req.file.buffer;
    const imageName = req.file.originalname;
    const idAuto = imageName.substring(0,imageName.length-4);
    console.log('Basename: ' + idAuto);

    const sql = 'UPDATE autos SET imagen = ? WHERE id = ' + idAuto;
    db.query(sql, [image], (err, result) => {
        //if (err) throw err;
        res.send('Imagen cargada con éxito.');
    });
});
*/
 // Ruta para mostrar imágenes
 /*
 app.get('/images', (req, res) => {
    db.query('SELECT * FROM autos WHERE categ_comercial = ' + selCateg.value + ' ORDER BY marca, modelo', (err, results) => {
        if (err) throw err;
        res.render('images', { listaAutos: results });
    });
});
*/
// Iniciar el servidor Web 
app.listen(app.get('port'), () => { 
    console.log(`Servidor corriendo en http://localhost:${app.get('port')}`);
});