const db = require('../db');
require('dotenv').config()
let nodemailer = require('nodemailer'); 

// GET
const inicioGET = (req, res) => {

    let logueado = req.session.loggedin; // true || undefined
    let usuario = req.session.username

    // consulta SQL
    let sql='SELECT * FROM productos';
    db.query(sql, function (err, data, fields) {
        if (err) res.send(`Ocurrió un error ${err.code}`);

        res.render('inicio', { 
            titulo: "Mi emprendimiento",
            logueado: logueado,
            usuario: usuario,
            data
        })
    });

}

// GET
const comoComprarGET = (req, res) => {

    let logueado = req.session.loggedin; // true || undefined
    let usuario = req.session.username

    res.render("como-comprar", { 
        titulo: "Cómo comprar",
        usuario: usuario,
        logueado: logueado,
    })
}

// GET
const sobreNosotrosGET = (req, res) => {

    let logueado = req.session.loggedin; // true || undefined
    let usuario = req.session.username

    res.render("sobre-nosotros", { 
        titulo: "Sobre nosotros",
        usuario: usuario,
        logueado: logueado,
    })
}

// GET
const contactoGET = (req, res) => {

    let logueado = req.session.loggedin; // true || undefined
    let usuario = req.session.username

    res.render("contacto", { 
        titulo: "Contacto",
        usuario: usuario,
        logueado: logueado,
    })
}

// POST
const contactoPOST = (req, res) => {

    // Paquete: NODEMAILER
    // Definimos el transporter
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		}
	});
	// Definimos el email
    let data = req.body;
	var mailOptions = {
			from: data.nombre,
			to: 'santiago.acosta@bue.edu.ar',
			subject: data.asunto,
			text: data.mensaje
	};
	// Enviamos el email
	transporter.sendMail(mailOptions, function(error, info){
		if (error){
			console.log(error);
			res.status(500, err.message);
            res.status(500).render('contacto', { 
                mensaje: `Ha ocurrido el siguiente error: ${err.message}`,
                mostrar: true
            });
		} else {
			console.log("E-mail enviado");
            //res.redirect("/")
			res.status(200).render('contacto', { 
                mensaje: "Mail enviado correctamente",
                mostrar: true
            });
		}
	});
}

// GET:ID
const productoGET_ID = (req, res) => {

    let id = req.params.id;
    let logueado = req.session.loggedin; // true || undefined
    let usuario = req.session.username

    var sql='SELECT * FROM productos WHERE id = ?';
    db.query(sql, [id], function (err, data) {

        if (err) res.send(`Ocurrió un error ${err.code}`);
        if (data == "") {
            res.status(404).render('404', 
            {mensaje: `Producto con ID ${id} no encontrado`})
        } else {
            res.render('producto', { 
                usuario: usuario,
				logueado: logueado, 
                data: data[0]
            });
        }
    });
}

module.exports = {
    inicioGET,
    comoComprarGET,
    sobreNosotrosGET,
    contactoGET,
    contactoPOST,
    productoGET_ID
}