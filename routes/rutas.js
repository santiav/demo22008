const { Router } = require('express')
const router = Router()

		
// Front
// =================================================================
const { inicioGET,
	comoComprarGET,
	sobreNosotrosGET,
	contactoGET,
	contactoPOST,
	productoGET_ID        
} = require('../controllers/front.ctrl')


router.get('/', inicioGET)
router.get('/como-comprar', comoComprarGET)
router.get('/sobre-nosotros', sobreNosotrosGET)
router.get('/contacto', contactoGET)
router.post('/contacto', contactoPOST);
router.get('/producto/:id', productoGET_ID)

// Back
// =================================================================
const { adminGET,
		loginGET,
		loginPOST,
		agregarGET,
		agregarPOST,
		editarGET,
		editarPOST,
		borrarGET,
        logoutGET
} = require('../controllers/back.ctrl')


router.get('/admin', adminGET)
router.get('/login', loginGET)
router.post('/login',loginPOST)
router.get('/agregar', agregarGET)
router.post('/agregar',agregarPOST)
router.get('/editar/:id', editarGET)
router.post('/editar/:id',editarPOST)
router.get('/borrar/:id', borrarGET)
router.get('/logout', logoutGET)


module.exports = router;