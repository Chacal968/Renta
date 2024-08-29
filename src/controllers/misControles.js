const { body, header } = require("express-validator");
const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const { fileLoader } = require('ejs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'renta',
    password: 'renta',
    port: '3306',
    database: 'renta'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

const controller = {};

function listar (codCateg='a.categ_comercial', fecha1, fecha2, idAuto = 'idAuto') {
    var fechaInicial = new Date(fecha1);
    var fechaFinal = new Date(fecha2);
    var diasReservados = Math.abs((fechaFinal - fechaInicial) / (1000*60*60*24));
    
    return new Promise((resolve, reject) => {
        var vQuery = 
        'SELECT a.marca, a.modelo, a.transmision, a.id idAuto, c.categoria, p.id idProveedor, ' +
                'cd.costo + ceil((costo*margen_auto)/100) + seguro + ceil((seguro*margen_seguro)/100) costo ' +
          'FROM autos a, categ_comercial c, proveedor p, costo_dias cd, temporada t ' + 
         'WHERE a.categ_comercial = c.id ' +
           'AND a.proveedor = p.id ' +
           'AND cd.temporada = t.tipo ' +
           'AND cd.idauto = a.id ' +
           'AND date("' + fechaInicial.toISOString().split('T')[0].replaceAll('-', '/') + '") between t.fecini and t.fecfin ' +
           'AND ' + diasReservados + ' between cd.rangomin and cd.rangomax ';
        if (codCateg != '0') vQuery += `AND a.categ_comercial = ${codCateg} `;
        vQuery += `AND idAuto = ${idAuto} `;
        vQuery += 'ORDER BY 7 ';
        
        db.query(vQuery, (err, results) => {if (err) reject(err); resolve([results, diasReservados]);});
    });
}

controller.inicio = (req, res) => {
    db.query('SELECT * FROM categ_comercial', (err, filasCateg) => {
        if (err) {res.json(err);} 
        
        var today = new Date();
        
        listar(req.query.Categ ? req.query.Categ : 0,
            req.query.fecha1 ? (new Date(req.query.fecha1)).getTime() : (today.getTime() + 5*24*60*60*1000),
            req.query.fecha2 ? (new Date(req.query.fecha2)).getTime() : (today.getTime() + 8*24*60*60*1000))
            .then(results => {
                res.render('inicio', {
                    queryResultCateg: filasCateg,
                    queryResultAutos: results[0],
                    diasReservados: results[1],
                    inicialData: req.query.Categ ? req.query : { Categ: 0,
                        pick: (new Date(today.getTime() + 5*24*60*60*1000)).toISOString().split('T')[0],
                        drop: (new Date(today.getTime() + 8*24*60*60*1000)).toISOString().split('T')[0] }
                });
            })
            .catch(err => {res.json(err);});
    });
};

controller.listarAutos = (req, res) => {
    listar(req.query.Categ, Number(req.query.fecha1), Number(req.query.fecha2))
    .then(results => {res.send([results[0], results[1]]);})
    .catch(err => {res.json(err);});
}

controller.form = (req, res) => {
    db.query('SELECT * FROM provincia', (err, filasProv) => {
        if (err) {res.json(err);}

        db.query('SELECT * FROM categ_comercial', (err, filasCateg) => {
            if (err) {res.json(err);}
    
            listar(req.query.Categ,
                (new Date(req.query.pick)).getTime(),
                (new Date(req.query.drop)).getTime(),
            req.params.car)
            .then(results => {
                res.render('form', {
                    queryResultCateg: filasCateg,
                    inicialData: req.query,
                    selCar: results[0][0],
                    diasReservados: results[1],
                    queryResultProv: filasProv
                });
            })
            .catch(err => {res.json(err);})
        });
    });
}

controller.PoblarPolosTur = (req, res) => {
    db.query(`SELECT id, nombre_polo FROM polos_turisticos WHERE provincia = ${req.query.id}`, (err, results) => {
        if (err) { res.json(err); }
        res.send(results.map(row => `<option value="${row.id}">${row.nombre_polo}</option>`).join(''));
    });
}

controller.PoblarOficinaRenta = (req, res) => {
    const querySQL = `SELECT id, nombre, aereopuerto, 
                        substr(hora_apertura,1, 2) * 60 + substr(hora_apertura,3, 2) hora_apertura,
                        substr(hora_cierre,1, 2) * 60 + substr(hora_cierre,3, 2) hora_cierre 
                        FROM oficina_renta 
                        WHERE polo_turistico_id = ${req.query.id}`;
    db.query(querySQL, (err, resQuery) => { 
        if (err) { res.json(err); }
        res.send(resQuery);
    });
}

function getLocation (proPolOf, id) {
    if(proPolOf == 'pro') return new Promise((resolve, reject) => {
        db.query(`SELECT provincia FROM provincia WHERE id = ${id}`, (err, results) => {if (err) reject(err); resolve(results[0].provincia);});
    })
    if(proPolOf == 'Pol') return new Promise((resolve, reject) => {
        db.query(`SELECT nombre_polo FROM polos_turisticos WHERE id = ${id}`, (err, results) => {if (err) reject(err); resolve(results[0].nombre_polo);});
    })
    if(proPolOf == 'Of') return new Promise((resolve, reject) => {
        db.query(`SELECT direccion FROM oficina_renta WHERE id = ${id}`, (err, results) => {if (err) reject(err); resolve(results[0].direccion);});
    })
}

controller.userData = (req, res) => {
    listar(undefined, req.query.pickDate, req.query.dropDate, req.params.car)
    .then(result => {
        //res.json({ ...(req.query), ...(result[0][0]), diasReservados:result[1] });
        
        res.render('userData', { ...(req.query), ...(result[0][0]), diasReservados:result[1] });

    }).catch(err => {res.json(err);})    
}

router.get('/', controller.inicio); 
router.get('/listcars', controller.listarAutos);
router.get('/form/:car', controller.form);
//router.post('/add', controller.save);  // insertar una fila en la BD
router.get('/get-polotur', controller.PoblarPolosTur);
router.get('/get-oficina', controller.PoblarOficinaRenta);
router.get('/userdata/:car', controller.userData);

module.exports = router;