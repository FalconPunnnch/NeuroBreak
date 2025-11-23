require('dotenv').config();
const pool = require('./connection');
const fs = require('fs');
const path = require('path');
async function runMigrations() {
  console.log('🚀 Iniciando migraciones de base de datos...\n');
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla de control de migraciones lista\n');
    const result = await client.query('SELECT name FROM migrations ORDER BY id');
    const executedMigrations = result.rows.map(row => row.name);
    console.log('📋 Migraciones ejecutadas previamente:', executedMigrations.length);
    if (executedMigrations.length > 0) {
      executedMigrations.forEach(name => console.log(`   - ${name}`));
    }
    console.log('');
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('⚠️  Carpeta de migraciones no encontrada. Creándola...');
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log('✅ Carpeta de migraciones creada\n');
      return;
    }
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();
    console.log('📂 Archivos de migración encontrados:', migrationFiles.length);
    if (migrationFiles.length > 0) {
      migrationFiles.forEach(file => console.log(`   - ${file}`));
    }
    console.log('');
    let executedCount = 0;
    for (const file of migrationFiles) {
      const migrationName = file.replace('.js', '');
      if (executedMigrations.includes(migrationName)) {
        console.log(`⏭️  Saltando ${migrationName} (ya ejecutada)`);
        continue;
      }
      console.log(`\n▶️  Ejecutando ${migrationName}...`);
      const migration = require(path.join(migrationsDir, file));
      try {
        await migration.up();
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [migrationName]
        );
        console.log(`✅ ${migrationName} ejecutada exitosamente`);
        executedCount++;
      } catch (error) {
        console.error(`❌ Error ejecutando ${migrationName}:`, error.message);
        throw error;
      }
    }
    console.log('\n========================================');
    if (executedCount === 0) {
      console.log('✅ No hay migraciones pendientes');
    } else {
      console.log(`✅ ${executedCount} migración(es) ejecutada(s) exitosamente`);
    }
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Error en el proceso de migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🎉 Proceso de migración completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal en migraciones:', error);
      process.exit(1);
    });
}
module.exports = { runMigrations };
