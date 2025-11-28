const { Pool } = require('pg');
require('dotenv').config();

// During tests, avoid creating real DB connections to prevent open handles and flakiness.
if (process.env.NODE_ENV === 'test') {
  // Minimal mock pool used in unit tests; tests can mock modules that call pool.query if they need specific behavior.
  module.exports = {
    query: async () => ({ rows: [] }),
    connect: async () => ({ release: () => {} }),
    on: () => {},
  };
} else {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
  });
  pool.on('error', (err) => {
    console.error('❌ Error en la conexión a PostgreSQL:', err);
    process.exit(-1);
  });
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Error al conectar con la base de datos:', err);
    } else {
      console.log('✅ Base de datos conectada correctamente');
    }
  });
  module.exports = pool;
}
