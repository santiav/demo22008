const db = require('../db');
const fs = require('fs');
require('../helpers/helpers');
const {upload, maxSizeMB, multer, storage} = require('../helpers/helpers')




// GET: Panel de control ADMIN
const adminGET = (req, res) => {
    
    // chequear si se inició sesión
    if (req.session.loggedin) {
        
        // consulta SQL - Listar productos 
        var sql='SELECT * FROM productos';
        db.query(sql, function (err, data, fields) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            
            res.render('admin', { 
                titulo: 'Panel de control', 
                usuario: req.session.username,
                logueado: true,
                data
            });
        });
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }
}

// GET: Login
const loginGET = (req, res) => {
    res.render("login", { titulo: "Login" })
}
// POST: Login
const loginPOST = (req, res) => {
    
    // Tomar los campos del LOGIN
    var username = req.body.username;
    var password = req.body.password;
    
    // Validación
    if (username && password) {
        
        // Consulta SQL
        db.query('SELECT * FROM cuentas WHERE usuario = ? AND clave = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/admin');
                
            } else {
                res.render("login", { titulo: "Login", error: "Nombre de usuario o contraseña incorrecto" })
            }			
        });
    } else {
        res.render("login", { titulo: "Login", error: "Por favor escribe un nombre de usuario y contraseña" })
    }
}

// GET: Agregar
const agregarGET = (req, res) => {
    
    // Chequear si se inició sesión
    if (req.session.loggedin) {
        res.render("agregar", { 
            titulo: "Agregar producto", 
            usuario: req.session.username,
            logueado: true
        })
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }
}

// POST: Agregar producto
const agregarPOST =  (req, res ) => {
    
    // Usar función de multer
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir imagen
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar', { error: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`});
            }
            return res.status(400).render('agregar', { error: err.code});
        } else if (err) {
            // Ocurrió un error desconocido al subir la imagen
            return res.status(400).render('agregar', { error: err});
        }
        
        // OK - ESTUVO BIEN - instrucciones 
        // almacenar los fields
        const productoDetalles=req.body;
        const nombreImagen = req.file.filename;
        productoDetalles.imagen = nombreImagen
        
        // Consulta SQL - insertar data en la DB
        var sql = 'INSERT INTO productos SET ?';
        db.query(sql, productoDetalles, function (err, data) { 
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log("Información de cliente insertado correctamente "); 
        });
        res.render("agregar", { 
            mensaje: "Producto agregado correctamente", 
            titulo: 'Agregar producto' 
        })
    })
    
    
    
}

// GET:ID Editar 
const editarGET = (req, res) => {
    
    // Chequear inicio sesion de usuario
    if (req.session.loggedin) {
        var id= req.params.id; // Tomar ID del producto
        var sql=`SELECT * FROM productos WHERE id= ?`;
        
        db.query(sql, [id], function (err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            if (data == "") {
                res.send(`
                    <h1>no existe producto con id ${id}</h1>
                    <a href="./admin/">Ver listado de productos</a>    
                `)
            } else {
                res.render('editar', { 
                    titulo: 'Editar producto',
                    usuario: req.session.username,
                    logueado: true,
                    data: data[0]
                });
            }
        });
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }
    
    
}

// POST: Editar
const editarPOST = (req, res) => {
    
    // Usar función de multer
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir imagen
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(418).render('agregar', { error: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`});
            }
            return res.status(418).render('agregar', { error: err.code});
        } else if (err) {
            // Ocurrió un error desconocido al subir la imagen
            return res.status(418).render('agregar', { error: err});
        }
        
        // todo OK continuando
        const id = req.params.id;
        const productoDetalles=req.body;
        
        // chequear si la edición incluyó cambio de imagen
        if (req.hasOwnProperty("file")) {
            
            console.log("Producto Detalles (cambió la imagen): ", productoDetalles)

            const nombreImagen = req.file.filename;
            productoDetalles.imagen = nombreImagen	
            
            // Se procede a borrar la imagen del servidor
            var borrarImagen = 'SELECT rutaImagen FROM productos WHERE id = ?';
            db.query(borrarImagen, [id], function (err, data) {
                
                if (err) res.send(`Ocurrió un error ${err.code}`)
                
                fs.unlink('public/uploads/' + data[0].imagen, (err) => {
                    if (err) res.send(`Ocurrió un error ${err.code}`)
                    
                    var sql = `UPDATE productos SET ? WHERE id= ?`;
                    
                    db.query(sql, [productoDetalles, id], function (err, data) {
                        if (err) res.send(`Ocurrió un error ${err.code}`);
                        console.log(data.affectedRows + " registro(s) actualizado(s)");
                    });
                });		
            });	
        } 
        
        // Insertar datos modificados (sin haber cambiado la imagen)
        console.log("Producto Detalles (sin haber cambiado la imagen): ", productoDetalles)
        var sql = `UPDATE productos SET ? WHERE id= ?`;
        
        db.query(sql, [productoDetalles, id], function (err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log(data.affectedRows + " registro(s) actualizado(s)");
        });
        
        res.redirect('/admin');
    })
    
    
    
    
}

// GET:ID Borrar 
const borrarGET = (req, res) => {
    var id= req.params.id;

    // Borrar fisicamente la imagen relacionada al producto
    var borrarImagen = 'SELECT imagen FROM productos WHERE id = ?';
    db.query(borrarImagen, [id], function (err, data) {
        console.log(data[0].imagen)
        if (err) res.send(`Ocurrió un error ${err.code}`);
        fs.unlink('public/uploads/' + data[0].imagen, (err) => {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log('Archivo borrado');
        });
    });
    
    // Borrar el registro de la base de datos
    var sql = 'DELETE FROM productos WHERE id = ?';
    db.query(sql, [id], function (err, data) {      
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro(s) borrado(s)");
    });
    
    res.redirect('/admin');
}

// GET Logout 
const logoutGET = (req,res)=> {
    console.log("req session", req.session)

	req.session.destroy((err)=>{})

    // Al finalizar sesión vuelve al inicio
	let sql='SELECT * FROM productos';
    db.query(sql, function (err, data, fields) {
        if (err) res.send(`Ocurrió un error ${err.code}`);

        res.render('inicio', { 
            titulo: "Mi emprendimiento",
            data
        })
    });
}

module.exports = {
    adminGET,
    loginGET,
    loginPOST,
    agregarGET,
    agregarPOST,
    editarGET,
    editarPOST,
    borrarGET,
    logoutGET
}