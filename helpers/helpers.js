const hbs = require('hbs');
const axios = require('axios');



hbs.registerHelper("list", function(objeto) {

	// Convierto en array la lista de características separadas previamente con "coma"
	let array = objeto.split(",");
	var html = "<ul>";

	// Recorro array para que, cada valor, tenga el HTML <li> 
	for (var i = 0; i < array.length; i++) {
		html = `${html} <li> ${array[i]} </li>`;
	}

  	return html + "</ul>";
});


hbs.registerHelper("dolarApeso", function(objeto) {
	let total = (dolarHOY * objeto);
    // Instalar paquete "full-icu" y luego ejecutar export NODE_ICU_DATA="./node_modules/full-icu/icudt67l.dat" 
    // o si se quiere temporalmente  nodemon --icu-data-dir="./node_modules/full-icu/icudt67l.dat" server
	return new Intl.NumberFormat("es-AR", {style: "currency", currency: "ARS"}).format(total)


});

/* FUNCION: Cálculo dolar */
var dolarHOY;
axios.get('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
	.then(function (response) {
		// handle success
		dolar = response.data[0].casa.venta;
		dolar = dolar.replace(/,/g, '.')
		dolar = parseFloat(dolar)
	})
	.then(function () {
		
		const impuestoPAIS = 0.30;
		const percepcionAFIP = 0.35;
		
		dolarHOY = (dolar * impuestoPAIS) + (dolar * percepcionAFIP) + dolar;
		return dolarHOY		
		
	})
	.catch(function (error) {
		// handle error
		console.log("error Axios", error);
	});


// FUNCION: subida de imagen
var multer  = require('multer')
var storage = multer.diskStorage({
	destination:  (req, file, cb) => {
		cb(null, './public/uploads/')
	},
	filename:  (req, file, cb) => {
		console.log("OBJETO FILE", file)
		let fileExtension = file.originalname.split('.')[1] 
		cb(null, file.originalname + '-' + Date.now() + "." + fileExtension)
	},
})

var maxSize = (1024 * 1024) * 5 // 5MB
var maxSizeMB = formatBytes(maxSize,2) 
// FUNCION: : Manejar errores de la imagen cargada
var upload = multer({
	storage:storage, 
	limits: {fileSize: maxSize },  
	fileFilter: (req, file, cb) => {
		if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || 	file.mimetype == "image/jpeg") {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Sólo los formatos .png .png, .jpg y .jpeg son los permitidos'));
        
		}
	}
}).single("imagenDeProducto")

// FUNCION: tamaño de archivo
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = {
    upload,
    maxSizeMB,
    multer,
    storage
}