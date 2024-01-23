const express = require('express');
const router = express.Router();
const {ejecutarConsulta} = require('./database');

const crud = require('./controllers/crud');

router.use((req, res, next) => {
  res.locals.datos = req.session.datos; // Establece res.locals para que esté disponible en las vistas
  next();
});


router.get('/deleteClientSuministro/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const results = await ejecutarConsulta(
      'DELETE FROM clientesSuministro WHERE noCliente = ?', [id]
    );
    
    res.redirect('/clientesSuministro');
  } catch (error) {
    console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
  
});

router.get('/deleteUser/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const results = await ejecutarConsulta(
      'DELETE FROM usuarios WHERE idUsuario = ?', [id]
    );
    
    res.redirect('/usersControlAdmin');
  } catch (error) {
    console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }

 
});

router.get('/deleteClientAdministracion/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const results = await ejecutarConsulta(
      'DELETE FROM clientesAdministracion WHERE noCliente = ?', [id]
    );
    
    res.redirect('/clientesAdministracionAdmin');
  } catch (error) {
    console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }

  
});

router.get('/deleteUnidad/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const results = await ejecutarConsulta(
      'DELETE FROM unidades WHERE noEco = ?', [id]
    );
    
    res.redirect('/viewUnidades');
  } catch (error) {
    console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }

 
});



router.post('/saveUserAdmin', crud.saveUserAdmin);
router.post('/saveUserSup', crud.saveUserSup);
router.post('/updateUser', crud.updateUser);
router.post('/saveClientSuministro', crud.saveClientSuministro);
router.post('/updateSuministro', crud.updateSuministro);
router.post('/saveClientAdministracion',crud.saveClientAdministracion)
router.post('/saveClientAdministracionOper', crud.saveClientAdministracionOper);
router.post('/updateAdministracion', crud.updateAdministracion);
router.post('/saveUnidad', crud.saveUnidad);
router.post('/startUnity', crud.startUnity);
router.post('/closeUnity', crud.closeUnity);
router.post('/saveClientSuministroTemp', crud.saveClientSuministroTemp)


module.exports = router;
