const { body, header } = require("express-validator");
const express = require('express');
const router = express.Router();
const { fileLoader } = require('ejs');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./DB.db');

const controller = {};

function listar (codCateg='a.categ_comercial', fecha1, fecha2, idAuto = 'idAuto') {
    var fechaInicial = new Date(fecha1);
    var fechaFinal = new Date(fecha2);
    var diasReservados = Math.abs((fechaFinal - fechaInicial) / (1000*60*60*24));
    
    return new Promise((resolve, reject) => {
        var vQuery =
            'SELECT a.marca, a.modelo, a.transmision, a.id AS idAuto, c.categoria, p.id AS idProveedor, ' +
            'cd.costo_auto + ((costo_auto*margen_auto)/100) + costo_seguro + ((costo_seguro*margen_seguro)/100) costo ' +
            'FROM autos a ' +
            'JOIN categ_comercial c ON a.categ_comercial = c.id ' +
            'JOIN proveedor p ON a.proveedor = p.id ' +
            'JOIN costo_variable cd ON cd.idauto = a.id ' +
            'JOIN temporada t ON cd.temporada = t.tipo ' +
            'WHERE date("' + fechaInicial.toISOString().split('T')[0] + '") BETWEEN t.fecini AND t.fecfin ' +
            'AND ' + diasReservados + ' BETWEEN cd.rangomin AND cd.rangomax ';
        if (codCateg != '0') vQuery += `AND a.categ_comercial = ${codCateg} `;
        vQuery += `AND a.id = ${idAuto} `;
        vQuery += 'ORDER BY costo ';

        db.all(vQuery, (err, results) => {if (err) reject(err); resolve([results, diasReservados]);});
    });
}

controller.inicio = (req, res) => {
    db.all('SELECT * FROM categ_comercial', (err, filasCateg) => {
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
    db.all('SELECT * FROM provincia', (err, filasProv) => {
        if (err) {res.json(err);}

        db.all('SELECT * FROM categ_comercial', (err, filasCateg) => {
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
    db.all(`SELECT id, nombre_polo FROM polos_turisticos WHERE provincia = ${req.query.id}`, (err, results) => {
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
    db.all(querySQL, (err, resQuery) => { 
        if (err) { res.json(err); }
        res.send(resQuery);
    });
}

function getLocation (proPolOf, id) {
    if(proPolOf == 'pro') return new Promise((resolve, reject) => {
        db.all(`SELECT provincia FROM provincia WHERE id = ${id}`, (err, results) => {if (err) reject(err); resolve(results[0].provincia);});
    })
    if(proPolOf == 'Pol') return new Promise((resolve, reject) => {
        db.all(`SELECT nombre_polo FROM polos_turisticos WHERE id = ${id}`, (err, results) => {if (err) reject(err); resolve(results[0].nombre_polo);});
    })
    if(proPolOf == 'Of') return new Promise((resolve, reject) => {
        db.all(`SELECT direccion FROM oficina_renta WHERE id = ${id}`, (err, results) => {if (err) reject(err); resolve(results[0].direccion);});
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
