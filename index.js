//LIBRERIAS PRINCIAPLES PARA EJECUCIÓN

const express = require('express');
const flash = require('express-flash');
const app = express();
const session = require('express-session');
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const createConnection = require('./database')
const bodyParser = require('body-parser');
const {createCanvas, loadImage}= require('canvas');
const fs = require('fs');
const router = express.Router();
const port = process.env.PORT || 3000;

//FUNCION QUE EJECUTA LAS CONSULTAS A BASE DE DATOS
const {ejecutarConsulta} = require('./database');
const e = require('express');

app.use('/css', express.static(__dirname + '/css'));
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));

//OBTENER LA FECHA Y HORA ACTUAL 
const fechaActual = new Date(); //Fecha actual
const horaActual = fechaActual.getHours();
const minActual = fechaActual.getMinutes();
const segActual = fechaActual.getSeconds()
const horaCompleta = horaActual + ':' + minActual + ':' + segActual;
const diaActual = fechaActual.getDate();
const mesActual = fechaActual.getMonth()+1;
const anioActual = fechaActual.getFullYear();
const fechaCompleta = anioActual + '-' + mesActual + '-' + diaActual;

// CONFIGURACIÓN DE EXPRESS-SESSION
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true
  }));
  
  app.use(flash());
  

  
  app.use(bodyParser.urlencoded({extended:true}));
  
  
  
  
  // Configuración de Express
  app.set('view engine', 'ejs');
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));


  // Ruta de inicio de sesión
router.get('/', (req, res) => {//DECLARAMOS QUE EL INDEX ES EL INICIO
    res.render('login');
  });
  
  const verificarSesion = (req, res, next) => {
    if (req.session && req.session.datos) {
      // El usuario tiene una sesión activa, permitir el acceso a las rutas del panel de control
      next();
    } else {
      // El usuario no tiene una sesión activa, redireccionar al inicio de sesión
      res.redirect('/');
    }
  };

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ? AND status = ?';
  
    try {
      const results = await ejecutarConsulta(query, [username, password, 'ACTIVO']);
  
      if (results.length === 1) {
        const rol = results[0].rol;
        req.session.datos = {
          idUsuario: results[0].idUsuario,
          nombre: results[0].nombre,
          noEmpleado: results[0].noEmpleado,
          username: results[0].username,
          password: results[0].password,
          rol: results[0].rol,
          status: results[0].status,
          telefono: results[0].telefono
        };
  
        console.log(req.session.datos);
  
        if (rol === 'ADMINISTRADOR') {
          res.redirect('/indexadmin');
        } else if (rol === 'SUPERVISOR') {
          res.redirect('/indexsup');
        }else if (rol === 'COORDINADOR'){
            res.redirect('/indexcor');
        } else if (rol === 'OPERADOR') {
          res.redirect('/indexoper');
        } else {
          req.flash('error', 'Tu rol no es válido, intenta nuevamente');
          res.redirect('/');
        }
      } else {
        req.flash('error', 'Credenciales inválidas. Inténtalo nuevamente');
        res.redirect('/');
      }
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });

  // Ruta de cierre de sesión
  router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      throw error;
    }
    console.log('Sesion cerrada')
    res.redirect('/');
  });
});

  router.get('/indexadmin', verificarSesion, async (req, res) => {
    try {

        const results2 = await ejecutarConsulta(
            'SELECT (SELECT COUNT(*) FROM clientesSuministro) + (SELECT COUNT(*) FROM clientesAdministracion) AS total'
          );
      
      const results3 = await ejecutarConsulta('SELECT precio FROM preciogas limit 1');
  
      const datos = req.session.datos;
  
      res.render('indexadmin', { results3, results2, datos });
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });

  router.get('/indexsup', verificarSesion, async (req, res) => {
    try {
      
  
      const results2 = await ejecutarConsulta(
        'SELECT (SELECT COUNT(*) FROM clientesSuministro) + (SELECT COUNT(*) FROM clientesAdministracion) AS total'
      );
  
      const results3 = await ejecutarConsulta('SELECT precio FROM preciogas limit 1');
  
      const datos = req.session.datos;
  
      res.render('indexsup', {  results2, results3, datos });
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });

  router.get('/indexcor', verificarSesion, async (req, res) => {
    try {
      
  
      
  
      const datos = req.session.datos;
  
      res.render('indexcor', {   datos });
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  router.get('/indexoper', verificarSesion, async (req, res) => {
    try {
      
  
      const datos = req.session.datos;
  
      res.render('indexoper', {   datos });
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });


  router.get('/usersControlAdmin',verificarSesion, async (req, res)=>{    
    
    try{

        const results = await ejecutarConsulta('SELECT * FROM usuarios');

        const datos = req.session.datos;        

        res.render('usersControlAdmin', {  results, datos });
    }catch (error){
        console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });

  router.get('/usersControlSup',verificarSesion, async (req, res)=>{    
    
    try{

        const results = await ejecutarConsulta('SELECT * FROM usuarios');

        const datos = req.session.datos;        

        res.render('usersControlSup', {  results, datos });
    }catch (error){
        console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
  });

  router.get('/addUserAdmin', (req,res)=>{
  
    const datos = req.session.datos;
    res.render('addUserAdmin',{datos});
            
  });

  router.get('/addUserSup', (req,res)=>{
  
    const datos = req.session.datos;
    res.render('addUserSup',{datos});
            
  });

  //CLIENTES ADMINISTRACION
  app.get('/clientesAdministracionAdmin',verificarSesion, async (req, res)=>{   
    
    try{

      const results = await ejecutarConsulta('SELECT * FROM clientesAdministracion WHERE statusCliente = ?', ['ACTIVO']);

      const results2 = await ejecutarConsulta('SELECT * FROM clientesAdministracion WHERE statusCliente IN (?,?)',['TEMPORAL','PCAMBIO'])

      const datos = req.session.datos;        

      res.render('clientesAdministracionAdmin', {  results, datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }

  });

  app.get('/clientesAdministracionSup',verificarSesion, async (req, res)=>{   
    
    try{

      const results = await ejecutarConsulta('SELECT * FROM clientesAdministracion WHERE statusCliente = ?', ['ACTIVO']);

      

      const datos = req.session.datos;        

      res.render('clientesAdministracionSup', {  results, datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }

  });

  app.get('/viewClientAdministracion/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const results = await ejecutarConsulta('SELECT * FROM clientesAdministracion WHERE noCliente= ?',[id]);

      const results2 = await ejecutarConsulta('SELECT nombreBloque FROM bloques');
      const opcionesBloque = results2.map(row => row.nombreBloque); 

      const datos = req.session.datos;        


      res.render('viewClientAdministracion', { client: results[0],datos,opcionesBloque });
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
    }

    
  });

  app.get('/createClientAdministracion', async (req,res)=>{

    try {

      const results = await ejecutarConsulta('SELECT  nombreBloque FROM bloques');
      
      const results2 = await ejecutarConsulta('SELECT MAX(consecutivo) + 1 AS consec FROM foliosAdministracion ');

      const results3 = await ejecutarConsulta('INSERT INTO foliosAdministracion(consecutivo) VALUES(?)', [results2[0].consec]);
      
      const datos = req.session.datos;
      res.render('createClientAdministracion',{client:results2[0],datos});
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
 
    
  });

  app.get('/createClientAdministracionAdmin', async (req,res)=>{

    try {

      const results = await ejecutarConsulta('SELECT  nombreBloque FROM bloques');
      
      const results2 = await ejecutarConsulta('SELECT MAX(consecutivo) + 1 AS consec FROM foliosAdministracion ');

      const results3 = await ejecutarConsulta('INSERT INTO foliosAdministracion(consecutivo) VALUES(?)', [results2[0].consec]);
      
      const datos = req.session.datos;
      const opcionesBloque = results.map(row => row.nombreBloque );
      res.render('createClientAdministracionAdmin',{client:results2[0],datos,opcionesBloque});
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
 
    
  });

  //CLIENTES SUMINISTRO
  app.get('/clientesSuministro',verificarSesion, async (req, res)=>{   
    
    try{

      const results = await ejecutarConsulta('SELECT * FROM clientesSuministro WHERE statusCliente = ?', ['ACTIVO']);

      const results2 = await ejecutarConsulta('SELECT * FROM clientesSuministro WHERE statusCliente IN (?,?)',['TEMPORAL','PCAMBIO'])

      const datos = req.session.datos;        

      res.render('clientesSuministro', {  results, results2,  datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }

  });

  app.get('/viewClientSuministro/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const results = await ejecutarConsulta('SELECT * FROM clientesSuministro WHERE noCliente= ?',[id]);

      const datos = req.session.datos;        


      res.render('viewClientSuministro', { client: results[0],datos });
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
    }

    
  });

  app.get('/createClientSuministro', async (req,res)=>{

    try {

      
      
      const results2 = await ejecutarConsulta('SELECT MAX(consecutivo) + 1 AS consec FROM foliosSuministros ');

      const results3 = await ejecutarConsulta('INSERT INTO foliosSuministros(consecutivo) VALUES(?)', [results2[0].consec]);
      
      const datos = req.session.datos;
      res.render('createClientSuministro',{client:results2[0],datos});
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
 
    
  });

  app.get('/createTempClient', async (req,res)=>{

    try {

      
      
      const results2 = await ejecutarConsulta('SELECT MAX(consecutivo) + 1 AS consec FROM foliosSuministros ');

      const results3 = await ejecutarConsulta('INSERT INTO foliosSuministros(consecutivo) VALUES(?)', [results2[0].consec]);
      
      const datos = req.session.datos;
      res.render('createTempClient',{client:results2[0],datos});
    } catch (error) {
      console.error('Error en la aplicación:', error.message);
      res.status(500).send('Error interno del servidor');
    }
 
    
  });
  
//UNIDADES

router.get('/viewUnidades',verificarSesion, async (req, res)=>{    
    
  try{

      const results = await ejecutarConsulta('SELECT * FROM unidades');

      const datos = req.session.datos;        

      res.render('viewUnidades', {  results, datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/addUnidad',verificarSesion, async (req, res)=>{    
    
  try{ 
      const datos = req.session.datos;
      res.render('addUnidad', {  datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

//RUTAS ADMINISTRACION

router.get('/rutasAdmin',verificarSesion, async (req, res)=>{    
    
  try{

      const results = await ejecutarConsulta('SELECT a.*,b.* FROM clientesAdministracion a, bloques b WHERE a.bloque = b.nombreBloque AND a.bloque = ? AND statusServicio != ?  ORDER BY a.municipio,a.cp,a.colonia, a.statusServicio',['BLOQUE 4','COMPLETADO']);

      const results2 = await ejecutarConsulta('SELECT * FROM unidades WHERE statusServicio = ?',['INICIADO']);
      const unidades = results2.map(row => row.noEco ); 

      const results3 = await ejecutarConsulta('SELECT a.*,b.* FROM clientesAdministracion a, bloques b WHERE a.bloque = b.nombreBloque AND a.bloque = ? AND statusServicio = ? ORDER BY a.municipio,a.cp,a.colonia, a.statusServicio',['BLOQUE 4','COMPLETADO']);

      const datos = req.session.datos;        

      res.render('rutasAdmin', {  results, results3, unidades, datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});


app.post('/updateAdminService',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = req.body.selectedOption;
      const status = 'ASIGNADO';

      const results = await ejecutarConsulta('UPDATE clientesAdministracion SET statusServicio = ?, unidadAsignada = ? WHERE noCliente = ?',[status,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarCompletada',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const status = 'COMPLETADO';

      const results = await ejecutarConsulta('UPDATE clientesAdministracion SET statusServicio = ?, unidadAsignada = ? WHERE noCliente = ?',[status,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarReagendar',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const status = 'REAGENDADO';

      const results = await ejecutarConsulta('UPDATE clientesAdministracion SET statusServicio = ?, unidadAsignada = ? WHERE noCliente = ?',[status,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarCancelacion',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const motivo = req.body.motivoSeleccionado;
      const status = 'CANCELADO';

      const results = await ejecutarConsulta('UPDATE clientesAdministracion SET statusServicio = ?, observaciones = ?, unidadAsignada = ? WHERE noCliente = ?',[status,motivo,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/confirmaReagenda',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const fecha = req.body.fechaReagendar;
      const status = 'PENDIENTE';

      const results = await ejecutarConsulta('UPDATE clientesAdministracion SET statusServicio = ?, proximaCarga = ?, unidadAsignada = ? WHERE noCliente = ?',[status,fecha,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarParcial',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const motivo = 'ENTREGA PARCIAL';
      const status = 'PARCIAL';

      const results = await ejecutarConsulta('UPDATE clientesAdministracion SET statusServicio = ?, observaciones = ?, unidadAsignada = ? WHERE noCliente = ?',[status,motivo,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});


//RUTAS SUMINISTRO
router.get('/rutasSum',verificarSesion, async (req, res)=>{    
    
  try{

    const sqlQuery = `
    SELECT 
      *
  FROM 
      clientesSuministro
  WHERE
      (
          (frecuenciaCarga = 'SEMANAL' AND DATE_ADD(ultimaCarga, INTERVAL 7 DAY) = CURDATE()) OR
          (frecuenciaCarga = 'QUINCENAL' AND DATE_ADD(ultimaCarga, INTERVAL 15 DAY) = CURDATE()) OR
          (frecuenciaCarga = 'MENSUAL' AND DATE_ADD(ultimaCarga, INTERVAL 1 MONTH) = CURDATE())
      )
      AND statusServicio != ?
  `;

      const results = await ejecutarConsulta(sqlQuery,['COMPLETADO']);

      const results2 = await ejecutarConsulta('SELECT * FROM unidades WHERE statusServicio = ?',['INICIADO']);
      const unidades = results2.map(row => row.noEco ); 

      const sqlQuery2 = `
    SELECT 
      *
  FROM 
      clientesSuministro
  WHERE
      (
          (frecuenciaCarga = 'SEMANAL' AND DATE_ADD(ultimaCarga, INTERVAL 7 DAY) = CURDATE()) OR
          (frecuenciaCarga = 'QUINCENAL' AND DATE_ADD(ultimaCarga, INTERVAL 15 DAY) = CURDATE()) OR
          (frecuenciaCarga = 'MENSUAL' AND DATE_ADD(ultimaCarga, INTERVAL 1 MONTH) = CURDATE())
      )
      AND statusServicio = ?
  `;

      const results3 = await ejecutarConsulta(sqlQuery2,['COMPLETADO']);

      const datos = req.session.datos;        

      res.render('rutasSum', {  results, results3, unidades, datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});


app.post('/updateSumService',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = req.body.selectedOption;
      const status = 'ASIGNADO';

      const results = await ejecutarConsulta('UPDATE clientesSuministro SET statusServicio = ?, unidadCarga = ? WHERE noCliente = ?',[status,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarCompletadaSum',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const status = 'COMPLETADO';

      const results = await ejecutarConsulta('UPDATE clientesSuministro SET statusServicio = ?, unidadCarga = ? WHERE noCliente = ?',[status,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarReagendarSum',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const status = 'REAGENDADO';

      const results = await ejecutarConsulta('UPDATE clientesSuministro SET statusServicio = ?, unidadCarga = ? WHERE noCliente = ?',[status,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarCancelacionSum',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const motivo = req.body.motivoSeleccionado;
      const status = 'CANCELADO';

      const results = await ejecutarConsulta('UPDATE clientesSuministro SET statusServicio = ?, observaciones = ?, unidadCarga = ? WHERE noCliente = ?',[status,motivo,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/confirmaReagendaSum',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const fecha = req.body.fechaReagendar;
      const status = 'PENDIENTE';

      const results = await ejecutarConsulta('UPDATE clientesSuministro SET statusServicio = ?, proximaCarga = ?, unidadCarga = ? WHERE noCliente = ?',[status,fecha,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/marcarParcialSum',verificarSesion, async (req, res)=>{       
  try{

      const noCliente = req.body.noCliente;
      const noEco = '';
      const motivo = 'ENTREGA PARCIAL';
      const status = 'PARCIAL';

      const results = await ejecutarConsulta('UPDATE clientesSuministro SET statusServicio = ?, observaciones = ?, unidadCarga = ? WHERE noCliente = ?',[status,motivo,noEco,noCliente]);
      res.json({ success: true, message: 'Opción guardada con éxito.' });   
      const datos = req.session.datos;        

      
  }catch (error){
    res.status(500).json({ success: false, message: 'Error al insertar en la base de datos.' });
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

//UNIDADES INICIO Y CIERRE 
router.get('/viewUnidadesServicios',verificarSesion, async (req, res)=>{    
    
  try{

      const results = await ejecutarConsulta('SELECT * FROM unidades WHERE statusServicio = ? AND statusUnidad = ?',['CERRADO','ACTIVO']);

      const results2 = await ejecutarConsulta('SELECT * FROM unidades WHERE statusServicio = ? AND statusUnidad = ?',['INICIADO','ACTIVO']);

      const datos = req.session.datos;        

      res.render('viewUnidadesServicios', {  results, datos,results2 });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/startUnidad/:id',verificarSesion, async (req, res)=>{    
    
  try{
      const id = req.params.id;
      const results = await ejecutarConsulta('SELECT * FROM unidades WHERE noEco= ?', [id]);

      const results2 = await ejecutarConsulta('SELECT * FROM usuarios WHERE rol IN (?,?) ', ['OPERADOR','TRIPULANTE']);

      const datos = req.session.datos;        
      const operadores = results2.map(row => row.nombre );

      res.render('startUnidad', {  unidad: results[0], datos, operadores});
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/closeUnidad/:id',verificarSesion, async (req, res)=>{    
    
  try{
      const id = req.params.id;
      const results = await ejecutarConsulta('SELECT * FROM unidades WHERE noEco= ?', [id]);

      

      const datos = req.session.datos;        
      

      res.render('closeUnidad', {  unidad: results[0], datos});
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

//ver Rutas
router.get('/verRutas',verificarSesion, async (req, res)=>{    
    
  try{

    const sqlQuery = `
    SELECT 
      *
  FROM 
      clientesSuministro
  WHERE
      (
          (frecuenciaCarga = 'SEMANAL' AND DATE_ADD(ultimaCarga, INTERVAL 7 DAY) = CURDATE()) OR
          (frecuenciaCarga = 'QUINCENAL' AND DATE_ADD(ultimaCarga, INTERVAL 15 DAY) = CURDATE()) OR
          (frecuenciaCarga = 'MENSUAL' AND DATE_ADD(ultimaCarga, INTERVAL 1 MONTH) = CURDATE())
      )
      AND statusServicio != ?
  `;

      const results3 = await ejecutarConsulta(sqlQuery,['PENDIENTE']);
      
      ;
      const results2 = await ejecutarConsulta('SELECT * FROM unidades WHERE statusServicio = ?',['INICIADO']);
      

      

      const results = await ejecutarConsulta('SELECT a.*,b.* FROM clientesAdministracion a, bloques b WHERE a.bloque = b.nombreBloque AND a.bloque = ? AND statusServicio != ?   ORDER BY a.municipio,a.cp,a.colonia, a.statusServicio',['BLOQUE 4','PENDIENTE']);

      const results5 = await ejecutarConsulta('SELECT * FROM usuarios WHERE rol IN (?,?) ', ['OPERADOR','TRIPULANTE']);
      const unidades = results2.map(row => row.noEco ); 
      const datos = req.session.datos;  
      const operadores = results5.map(row => row.nombre );       

      res.render('verRutas', {  results, results3, unidades, datos, operadores });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});


//ASIGNACION POR BLOQUE
router.get('/asignaBloque',verificarSesion, async (req, res)=>{    
    
  try{

    const sqlQuery = `
  SELECT
  GROUP_CONCAT(noCliente ORDER BY noCliente) AS numerosClientes,
  municipio
FROM
  gasunion.clientesSuministro
WHERE
  (
      (frecuenciaCarga = 'SEMANAL' AND DATE_ADD(ultimaCarga, INTERVAL 7 DAY) = CURDATE()) OR
      (frecuenciaCarga = 'QUINCENAL' AND DATE_ADD(ultimaCarga, INTERVAL 15 DAY) = CURDATE()) OR
      (frecuenciaCarga = 'MENSUAL' AND DATE_ADD(ultimaCarga, INTERVAL 1 MONTH) = CURDATE())
  )
  AND statusServicio = ?
GROUP BY
  municipio;
  `;

      const results = await ejecutarConsulta(sqlQuery,['PENDIENTE']);
      
      
      const results2 = await ejecutarConsulta('SELECT * FROM unidades WHERE statusServicio = ?',['INICIADO']);
      
      const sqlAdminQuery = `
            SELECT GROUP_CONCAT(noCliente) AS numerosClientes, municipio
            FROM gasunion.clientesAdministracion
            	WHERE statusServicio = ?
                AND bloque = ?
            GROUP BY municipio
            ORDER BY municipio
            `;

      

      const results3 = await ejecutarConsulta(sqlAdminQuery,['PENDIENTE', 'BLOQUE 4']);

      
      const unidades = results2.map(row => row.noEco ); 
      const datos = req.session.datos;  
      
      res.render('asignaBloque', {  results, results3, unidades, datos });
  }catch (error){
      console.error('Error en la aplicación:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/asignar-unidad-admin', verificarSesion, async (req, res) => {
  try {
    const { clienteIds, unidad } = req.body;

    if (!clienteIds || !clienteIds.length) {
      return res.status(400).json({ error: 'IDs de clientes no proporcionados.' });
    }

    // Convertir el array de IDs a una cadena de texto
    const clienteIdsStr = clienteIds.join(',');

    const queryString = `
      UPDATE clientesAdministracion 
      SET unidadAsignada = ?, statusServicio = ? 
      WHERE noCliente IN (${clienteIdsStr})
    `;

    const results = await ejecutarConsulta(queryString, [unidad, 'ASIGNADO']);
    
    res.json({ message: 'Actualización exitosa.' });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});


router.post('/asignar-unidad-sum',verificarSesion, async (req, res)=>{    
    
  try{

    const { clienteIds, unidad } = req.body;

  if (!clienteIds || !clienteIds.length) {
    return res.status(400).json({ error: 'IDs de clientes no proporcionados.' });
  }

  const clienteIdsStr = clienteIds.join(',');
  const queryString = `UPDATE clientesSuministro SET unidadCarga = ?, statusServicio = ? WHERE noCliente IN (${clienteIdsStr})`;
  
      const results = await ejecutarConsulta(queryString,[unidad,'ASIGNADO']);
      
      
      res.json({ message: 'Actualización exitosa.' });
  }catch (error){
    return res.status(500).json({ error: 'Error interno del servidor.' });
      
  }
});


// Iniciar el servidor
app.use('/', require('./routerCRUD'));
app.use('/', router);

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

