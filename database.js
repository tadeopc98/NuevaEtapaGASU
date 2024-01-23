const mysql = require('mysql2/promise');

// function createConnection() {
//   const connection = mysql.createConnection({
//     host: 'gasunion-database-do-user-14562319-0.b.db.ondigitalocean.com',
//     user: 'doadmin',
//     password: 'AVNS_EpXeOpmQDAMrNDn3jnL',
//     database: 'gasunion',
//     port: 25060
    
//   });

//   connection.connect((error) => {
//     if (error) {
//       console.error('Error de conexión a la base de datos:', error);
//     } else {
//       console.log('Conexión exitosa a la base de datos');
//     }
//   });

//   return connection;
// }

// module.exports = createConnection;

// const dbConfig = {
//     host: 'gasunion-database-do-user-14562319-0.b.db.ondigitalocean.com',
//     user: 'doadmin',
//     password: 'AVNS_EpXeOpmQDAMrNDn3jnL',
//     database: 'gasunion',
//     port: 25060
// };

// Función para conectar a la base de datos y ejecutar una consulta
async function ejecutarConsulta(query,values) {

  const connection = await mysql.createConnection({
    host: 'gasunion-database-do-user-14562319-0.b.db.ondigitalocean.com',
    user: 'doadmin',
    password: 'AVNS_EpXeOpmQDAMrNDn3jnL',
    database: 'gasunion',
    port: 25060
});
    try {
      const [results] = await connection.execute(query, values);
      return results;
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
  
      // Manejar errores específicos
      if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        throw new Error('Acceso denegado. Verifica tus credenciales.');
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        throw new Error('La base de datos especificada no existe.');
      } else if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Intento de insertar un valor duplicado en una columna con restricción de clave única.');
      } else if (error.code === 'ER_NO_SUCH_TABLE') {
        throw new Error('La tabla especificada no existe.');
      } else if (error.code === 'ER_SYNTAX_ERROR') {
        throw new Error('Error de sintaxis en la consulta SQL.');
      } else {
        // Si el error no coincide con ninguno de los casos anteriores, lanzar el error original
        throw error;
      }
    } finally{
      await connection.end();
    }
  }
  
  // Exportar la función de ejecutarConsulta
  module.exports = {
    ejecutarConsulta
  };
