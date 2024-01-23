//Invocamos a la conexion de la DB
const express = require('express');
const session = require('express-session');
const {ejecutarConsulta} = require('../database');
const toastr = require('toastr');



const fechaActual = new Date(); //Fecha actual
const horaActual = fechaActual.getHours();
const minActual = fechaActual.getMinutes();
const segActual = fechaActual.getSeconds()
const horaCompleta = horaActual + ':' + minActual + ':' + segActual;
const diaActual = fechaActual.getDate();
const mesActual = fechaActual.getMonth()+1;
const anioActual = fechaActual.getFullYear();
const fechaCompleta = anioActual + '-' + mesActual + '-' + diaActual;

//GUARDAR un REGISTRO
exports.saveUserAdmin = async (req, res) => {
    try {
        const nombre = req.body.nombre.toUpperCase();
        const num = req.body.num;
        const user = req.body.username;
        const pass = req.body.pass;
        const rol = req.body.rol.toUpperCase();
        const st = req.body.st.toUpperCase();
        const telefono = req.body.telefono;

        // Verificar si el usuario ya existe por su número de empleado
        const countResult = await ejecutarConsulta('SELECT COUNT(*) AS count FROM usuarios WHERE noEmpleado = ?', [num]);

        const existingCount = countResult[0].count;

        if (existingCount === 0) {
            // Insertar nuevo usuario
            await ejecutarConsulta('INSERT INTO usuarios (nombre, noEmpleado, username, password, rol, status, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, num, user, pass, rol, st, telefono]);

            res.redirect('/usersControlAdmin');
        } else {
            res.redirect('/addUserAdmin');
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

//GUARDAR un REGISTRO
exports.saveUserSup = async (req, res) => {
    try {
        const nombre = req.body.nombre.toUpperCase();
        const num = req.body.num;
        const user = req.body.username;
        const pass = req.body.pass;
        const rol = req.body.rol.toUpperCase();
        const st = req.body.st.toUpperCase();
        const telefono = req.body.telefono;

        // Verificar si el usuario ya existe por su número de empleado
        const countResult = await ejecutarConsulta('SELECT COUNT(*) AS count FROM usuarios WHERE noEmpleado = ?', [num]);

        const existingCount = countResult[0].count;

        if (existingCount === 0) {
            // Insertar nuevo usuario
            await ejecutarConsulta('INSERT INTO usuarios (nombre, noEmpleado, username, password, rol, status, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, num, user, pass, rol, st, telefono]);

            res.redirect('/usersControlSup');
        } else {
            res.redirect('/addUserSup');
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.saveClientSuministro = async (req, res) => {
    try {
        const datos = req.session.datos;
        const noCliente = req.body.noCliente;
        const fecRegistro = fechaCompleta;
        const usuarioRegistro = req.body.usuarioReg.toUpperCase();
        let status
        if (datos.rol === 'SUPERVISOR') {
             status = 'PCAMBIO';
        } else if (datos.rol === 'ADMINISTRADOR'){
             status = 'ACTIVO'
        }
        const nombreCliente = req.body.nombre.toUpperCase();
        const razonSocial = req.body.razonSocial.toUpperCase();
        const obser = req.body.observaciones.toUpperCase();
        const telefono = req.body.telefono.toUpperCase();
        const telefonoFijo = req.body.telFijo.toUpperCase();
        const correo = req.body.correo.toLowerCase();
        const correo2 = req.body.correo2.toLowerCase();
        const calle = req.body.calle.toUpperCase();
        const noExt = req.body.noExterior.toUpperCase();
        const noInt = req.body.noInterior.toUpperCase();
        const cp = req.body.cp;
        const colonia = req.body.colonia.toUpperCase();
        const municipio = req.body.municipio.toUpperCase();
        const estado = req.body.estado.toUpperCase();
        const direccion = calle + ' #' + noExt + ', ' + noInt + ', ' + colonia + ', ' + municipio + ', C.P. ' + cp + ', ' + estado;
        direccion.toUpperCase();
        const frecCarga = req.body.frecCarga.toUpperCase();
        const diaCarga = req.body.diaCarga.toUpperCase();
        const pagoPref = req.body.tipoPago.toUpperCase();
        const tipoCliente = req.body.tipoCliente.toUpperCase();

        // Insertar nuevo cliente de suministro
        await ejecutarConsulta('INSERT INTO clientesSuministro SET noCliente = ?, fecRegistro = ?, usuarioRegistro = ?, statusCliente = ?, nombreCliente = ?, razonSocial = ?, observaciones = ?, telefonoCelular = ?, telefonoFijo = ?, correoCliente = ?, correoAlternativo = ?, calle = ?, noExterior = ?, noInterior = ?, cp = ?, colonia = ?, municipio = ?, estado = ?, direccion = ?, frecuenciaCarga = ?, diaCarga = ?, tipoPago = ?, tipoCliente = ?', [
            noCliente, fecRegistro, usuarioRegistro, status, nombreCliente,
            razonSocial, obser, telefono, telefonoFijo,
            correo, correo2, calle, noExt, noInt, cp, colonia,
            municipio, estado, direccion, frecCarga, diaCarga, pagoPref, tipoCliente
        ]);

        res.redirect('/clientesSuministro');
    } catch (error) {
        console.error('Error al guardar cliente de suministro:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.saveClientSuministroTemp = async (req, res) => {
    try {
        const datos = req.session.datos;
        const noCliente = req.body.noCliente;
        const fecRegistro = fechaCompleta;
        const usuarioRegistro = req.body.usuarioReg.toUpperCase();
        const status = 'TEMPORAL';
        const nombreCliente = req.body.nombre.toUpperCase();
        const razonSocial = req.body.razonSocial.toUpperCase();
        const obser = req.body.observaciones.toUpperCase();
        const telefono = req.body.telefono.toUpperCase();
        const telefonoFijo = req.body.telFijo.toUpperCase();
        const correo = req.body.correo.toLowerCase();
        const correo2 = req.body.correo2.toLowerCase();
        const calle = req.body.calle.toUpperCase();
        const noExt = req.body.noExterior.toUpperCase();
        const noInt = req.body.noInterior.toUpperCase();
        const cp = req.body.cp;
        const colonia = req.body.colonia.toUpperCase();
        const municipio = req.body.municipio.toUpperCase();
        const estado = req.body.estado.toUpperCase();
        const direccion = calle + ' #' + noExt + ', ' + noInt + ', ' + colonia + ', ' + municipio + ', C.P. ' + cp + ', ' + estado;
        direccion.toUpperCase();
        

        // Insertar nuevo cliente de suministro
        await ejecutarConsulta('INSERT INTO clientesSuministro SET noCliente = ?, fecRegistro = ?, usuarioRegistro = ?, statusCliente = ?, nombreCliente = ?, razonSocial = ?, observaciones = ?, telefonoCelular = ?, telefonoFijo = ?, correoCliente = ?, correoAlternativo = ?, calle = ?, noExterior = ?, noInterior = ?, cp = ?, colonia = ?, municipio = ?, estado = ?, direccion = ?', [
            noCliente, fecRegistro, usuarioRegistro, status, nombreCliente,
            razonSocial, obser, telefono, telefonoFijo,
            correo, correo2, calle, noExt, noInt, cp, colonia,
            municipio, estado, direccion
        ]);
        if (datos.rol === 'COORDINADOR') {
            res.redirect('/indexcor');
       } else if (datos.rol === 'OPERADOR'){
            res.redirect('/indexoper');
       }
        
    } catch (error) {
        console.error('Error al guardar cliente de suministro:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.saveClientAdministracionOper = async (req, res) => {
    try {
        const noCliente = req.body.noCliente;
        const fecRegistro = fechaCompleta;
        const usuarioRegistro = req.body.usuarioReg.toUpperCase();
        const status = 'TEMPORAL';
        const nombreCliente = req.body.nombre.toUpperCase();
        
        const obser = req.body.observaciones.toUpperCase();
        
        const calle = req.body.calle.toUpperCase();
        const noExt = req.body.noExterior.toUpperCase();
        const noInt = req.body.noInterior.toUpperCase();
        const cp = req.body.cp;
        const colonia = req.body.colonia.toUpperCase();
        const municipio = req.body.municipio.toUpperCase();
        const estado = req.body.estado.toUpperCase();
        const direccion = calle + ' #' + noExt + ', ' + noInt + ', ' + colonia + ', ' + municipio + ', C.P. ' + cp + ', ' + estado;
        direccion.toUpperCase();
        
        // Insertar nuevo cliente de administración
        await ejecutarConsulta('INSERT INTO clientesAdministracion SET noCliente = ?, fecRegistro = ?, usuarioRegistro = ?, statusCliente = ?, nombreCliente = ?,  observaciones = ?,  calle = ?, noExterior = ?, noInterior = ?, cp = ?, colonia = ?, municipio = ?, estado = ?, direccion = ?', [
            noCliente, fecRegistro, usuarioRegistro, status, nombreCliente,
             obser, calle, noExt, noInt, cp, colonia,
            municipio, estado, direccion
        ]);
        

        res.redirect('/indexoper');
    } catch (error) {
        console.error('Error al guardar cliente de administración:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.saveClientAdministracion = async (req, res) => {
    try {
        const noCliente = req.body.noCliente;
        const fecRegistro = fechaCompleta;
        const usuarioRegistro = req.body.usuarioReg.toUpperCase();
        const status = 'ACTIVO';
        const nombreCliente = req.body.nombre.toUpperCase();
        const razonSocial = req.body.razonSocial.toUpperCase();
        const obser = req.body.observaciones.toUpperCase();
        const nombreAdministracion = req.body.nombreAdmin.toUpperCase();
        const residente = req.body.residente.toUpperCase();
        const telefono = req.body.telefono.toUpperCase();
        const telefonoFijo = req.body.telFijo.toUpperCase();
        const correo = req.body.correo.toLowerCase();
        const correo2 = req.body.correo2.toLowerCase();
        const calle = req.body.calle.toUpperCase();
        const noExt = req.body.noExterior.toUpperCase();
        const noInt = req.body.noInterior.toUpperCase();
        const cp = req.body.cp;
        const colonia = req.body.colonia.toUpperCase();
        const municipio = req.body.municipio.toUpperCase();
        const estado = req.body.estado.toUpperCase();
        const direccion = calle + ' #' + noExt + ', ' + noInt + ', ' + colonia + ', ' + municipio + ', C.P. ' + cp + ', ' + estado;
        direccion.toUpperCase();
        const pagoPref = req.body.tipoPago.toUpperCase();
        const bloque = req.body.bloque.toUpperCase();
        const tipoCliente = req.body.tipoCliente.toUpperCase();
        const diaCarga = req.body.diaCarga.toUpperCase();

        // Insertar nuevo cliente de administración
        await ejecutarConsulta('INSERT INTO clientesAdministracion SET noCliente = ?, fecRegistro = ?, usuarioRegistro = ?, statusCliente = ?, nombreCliente = ?, razonSocial = ?, observaciones = ?, nombreAdministracion = ?, residente = ?, telefonoCelular = ?, telefonoFijo = ?, correoAdministracion = ?, correoAlternativo = ?, calle = ?, noExterior = ?, noInterior = ?, cp = ?, colonia = ?, municipio = ?, estado = ?, direccion = ?, tipoPago = ?, bloque = ?, tipoCliente = ?, diaCarga = ?', [
            noCliente, fecRegistro, usuarioRegistro, status, nombreCliente,
            razonSocial, obser, nombreAdministracion, residente, telefono, telefonoFijo,
            correo, correo2, calle, noExt, noInt, cp, colonia,
            municipio, estado, direccion, pagoPref, bloque,
            tipoCliente, diaCarga
        ]);
        

        res.redirect('/clientesAdministracionAdmin');
    } catch (error) {
        console.error('Error al guardar cliente de administración:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// ACTUALIZAR un REGISTRO
exports.updateUser = (req, res) => {
    // Resto del código sin cambios...
};

exports.updateSuministro = async (req, res) => {
    try {
        const datos = req.session.datos;
        const noCliente = req.body.noCliente;
        const fecRegistro = fechaCompleta;
        const usuarioRegistro = req.body.usuarioReg.toUpperCase();
        let status
        if (datos.rol === 'SUPERVISOR') {
             status = 'PCAMBIO';
        } else if (datos.rol === 'ADMINISTRADOR'){
             status = 'ACTIVO'
        }
        const nombreCliente = req.body.nombre.toUpperCase();
        const razonSocial = req.body.razonSocial.toUpperCase();
        const obser = req.body.observaciones.toUpperCase();
        const telefono = req.body.telefono.toUpperCase();
        const telefonoFijo = req.body.telFijo.toUpperCase();
        const correo = req.body.correo.toLowerCase();
        const correo2 = req.body.correo2.toLowerCase();
        const calle = req.body.calle.toUpperCase();
        const noExt = req.body.noExterior;
        const noInt = req.body.noInterior;
        const cp = req.body.cp;
        const colonia = req.body.colonia.toUpperCase();
        const municipio = req.body.municipio.toUpperCase();
        const estado = req.body.estado.toUpperCase();
        const direccion = calle + ' #' + noExt + ', ' + noInt + ', ' + colonia + ', ' + municipio + ', C.P. ' + cp + ', ' + estado;
        direccion.toUpperCase();
        const frecCarga = req.body.frecCarga.toUpperCase();
        const diaCarga = req.body.diaCarga.toUpperCase();
        const pagoPref = req.body.tipoPago.toUpperCase();
        const tipoCliente = req.body.tipoCliente.toUpperCase();

        // Actualizar cliente de suministro
        await ejecutarConsulta('UPDATE clientesSuministro SET statusCliente = ?, razonSocial = ?, observaciones = ?, telefonoCelular = ?, telefonoFijo = ?, correoCliente = ?, correoAlternativo = ?, calle = ?, noExterior = ?, noInterior = ?, cp = ?, colonia = ?, municipio = ?, estado = ?, direccion = ?, frecuenciaCarga = ?, diaCarga = ?, tipoPago = ? WHERE noCliente = ?', [
            status, razonSocial, obser, telefono, telefonoFijo, correo, correo2, calle, noExt, noInt, cp, colonia, municipio, estado, direccion, frecCarga, diaCarga, pagoPref, noCliente
        ]);

        
        res.redirect('/clientesSuministro');
    } catch (error) {
        console.error('Error al actualizar cliente de suministro:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.updateAdministracion = async (req, res) => {
    try {
        const datos = req.session.datos;
        const noCliente = req.body.noCliente;
        const fecRegistro = fechaCompleta;
        const usuarioRegistro = req.body.usuarioReg.toUpperCase();
        let status
        if (datos.rol === 'SUPERVISOR') {
             status = 'PCAMBIO';
        } else if (datos.rol === 'ADMINISTRADOR'){
             status = 'ACTIVO'
        }
        
        const nombreCliente = req.body.nombre.toUpperCase();
        const razonSocial = req.body.razonSocial.toUpperCase();
        const obser = req.body.observaciones.toUpperCase();
        const nombreAdministracion = req.body.nombreAdmin.toUpperCase();
        const residente = req.body.residente.toUpperCase();
        const telefono = req.body.telefono.toUpperCase();
        const telefonoFijo = req.body.telFijo.toUpperCase();
        const correo = req.body.correo.toLowerCase();
        const correo2 = req.body.correo2.toLowerCase();
        const calle = req.body.calle.toUpperCase();
        const noExt = req.body.noExterior.toUpperCase();
        const noInt = req.body.noInterior.toUpperCase();
        const cp = req.body.cp;
        const colonia = req.body.colonia.toUpperCase();
        const municipio = req.body.municipio.toUpperCase();
        const estado = req.body.estado.toUpperCase();
        const direccion = calle + ' #' + noExt + ', ' + noInt + ', ' + colonia + ', ' + municipio + ', C.P. ' + cp + ', ' + estado;
        direccion.toUpperCase();
        const pagoPref = req.body.tipoPago.toUpperCase();
        const bloque = req.body.bloque.toUpperCase();
        const tipoCliente = req.body.tipoCliente.toUpperCase();
        const diaCarga = req.body.diaCarga.toUpperCase();

        // Actualizar cliente de administración
        await ejecutarConsulta('UPDATE clientesAdministracion SET statusCliente = ?, razonSocial = ?, observaciones = ?, nombreAdministracion = ?, residente = ?, telefonoCelular = ?, telefonoFijo = ?, correoAdministracion = ?, correoAlternativo = ?, calle = ?, noExterior = ?, noInterior = ?, cp = ?, colonia = ?, municipio = ?, estado = ?, direccion = ?, tipoPago = ?, bloque = ?, diaCarga = ? WHERE noCliente = ?', [
            status,
            razonSocial,
            obser,
            nombreAdministracion,
            residente,
            telefono,
            telefonoFijo,
            correo,
            correo2,
            calle,
            noExt,
            noInt,
            cp,
            colonia,
            municipio,
            estado,
            direccion,
            pagoPref,
            bloque,
            diaCarga,
            noCliente
        ]);
        

        
        if (datos.rol === 'ADMINISTRADOR') {
            res.redirect('/clientesAdministracionAdmin');
        } else if (datos.rol === 'SUPERVISOR') {
            res.redirect('/clientesAdministracionSup');
        }
    } catch (error) {
        console.error('Error al actualizar cliente de administración:', error);
        res.status(500).send('Error interno del servidor');
    }
};

exports.saveUnidad = async (req, res) => {
    try {
        const noEco = req.body.noEco;
        const placas = req.body.placas;
        const segVigente = req.body.segVig;
        const disel = req.body.disel;
        const gasLp = req.body.gasLp;
        const usuarioRegistra = req.body.usuarioRegistra;
        const statusUnidad = 'ACTIVO';
        const statusServicio = 'CERRADO';

        // Verificar si la unidad ya existe
        const existingCountResult = await ejecutarConsulta('SELECT COUNT(*) AS count FROM unidades WHERE noEco = ?', [noEco]);
        const existingCount = existingCountResult[0].count;

        if (existingCount === 0) {
            // Insertar nueva unidad
            await ejecutarConsulta(
                'INSERT INTO unidades SET noEco = ?, placas = ?, segVigente = ?, disel = ?, gasLp = ?, usuarioRegistra = ?, statusUnidad = ?, statusServicio = ?',
                [noEco, placas, segVigente, disel, gasLp, usuarioRegistra, statusUnidad, statusServicio]
            );

            res.redirect('/viewUnidades');
        } else {
            res.redirect('/addUnidad');
        }
    } catch (error) {
        console.error('Error al guardar unidad:', error);
        res.status(500).send('Error interno del servidor');
    }
};




exports.startUnity = async (req, res) => {
    try {
        const noEco = req.body.noEco;
        const porcentajeLp = req.body.porcentajeLp;
        const porcentajeDisel = req.body.porcentajeDisel;
        const operador = req.body.operador;
        const tripulante1 = req.body.tripulante1;
        const tripulante2 = req.body.tripulante2;
        const fechaInicio = req.body.fechaInicio;
        const horaInicio = req.body.horaInicio;
        const usuarioInicio = req.body.usuarioInicia;

        // Insertar inicio de unidad
        await ejecutarConsulta(
            'INSERT INTO inicioUnidad SET noEco = ?, porcentajeLp = ?, porcentajeDisel = ?, operador = ?, tripulante1 = ?, tripulante2 = ?, fechaInicio = ?, horaInicio = ?, usuarioInicio = ?',
            [noEco, porcentajeLp, porcentajeDisel, operador, tripulante1, tripulante2, fechaInicio, horaInicio, usuarioInicio]
        );

        // Actualizar estado de la unidad a INICIADO
        await ejecutarConsulta('UPDATE unidades SET statusServicio = ? WHERE noEco = ?', ['INICIADO', noEco]);

        res.redirect('/viewUnidadesServicios');
    } catch (error) {
        console.error('Error al iniciar unidad:', error);
        res.status(500).send('Error interno del servidor');
    }
};


exports.closeUnity = async (req, res) => {
    try {
        const noEco = req.body.noEco;
        const porcentajeLp = req.body.porcentajeLp;
        const porcentajeDisel = req.body.porcentajeDisel;
        const noServicios = '';
        const ltVentaMedidor = req.body.ltVentaMedidor;
        const ltVentaNotas = req.body.ltVentaNotas;
        const ventaDif = req.body.ventaDif;
        const cancelados = '';
        const efectivo = req.body.efectivo;
        const gastos = req.body.gastos;
        const granTotal = req.body.granTotal;
        const usuarioCierra = req.body.usuarioCierra;
        const fechaCierre = req.body.fechaCierre;
        const horaCierre = req.body.horaCierre;

        // Insertar cierre de unidad
        await ejecutarConsulta(
            'INSERT INTO cierreUnidad SET noEco = ?, porcentajeLp = ?, porcentajeDisel = ?, noServicios = ?, ltVentaMedidor = ?, ltVentaNotas = ?, ventaDif = ?, cancelados = ?, efectivo = ?, gastos = ?, granTotal = ?, fechaCierre = ?, horaCierre = ?, usuarioCierra = ?',
            [
                noEco, porcentajeLp, porcentajeDisel, noServicios, ltVentaMedidor, ltVentaNotas, ventaDif, cancelados,
                efectivo, gastos, granTotal, fechaCierre, horaCierre, usuarioCierra
            ]
        );

        // Actualizar estado de la unidad a CERRADO
        await ejecutarConsulta('UPDATE unidades SET statusServicio = ? WHERE noEco = ?', ['CERRADO', noEco]);

        res.redirect('/viewUnidadesServicios');
    } catch (error) {
        console.error('Error al cerrar unidad:', error);
        res.status(500).send('Error interno del servidor');
    }
};
