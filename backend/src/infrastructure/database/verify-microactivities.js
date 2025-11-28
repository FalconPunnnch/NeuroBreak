require('dotenv').config();
const db = require('./connection');
const logger = require('../../utils/logger');

async function verifyMicroactivities(limit = 10) {
  try {
    logger.info('🔍 Verificando microactividades (requirements/benefits)...');
    const result = await db.query(
      `SELECT id, title, requirements, benefits, duration FROM microactivities ORDER BY id ASC LIMIT $1`,
      [limit]
    );
    if (result.rows.length === 0) {
      logger.warn('⚠️ No hay microactividades en la tabla.');
      return;
    }
    for (const row of result.rows) {
      const reqCount = Array.isArray(row.requirements) ? row.requirements.length : (row.requirements ? 'JSON(raw)' : 0);
      const benCount = Array.isArray(row.benefits) ? row.benefits.length : (row.benefits ? 'JSON(raw)' : 0);
      logger.info(`✅ ID ${row.id} | ${row.title} | duration=${row.duration}m | requirements=${reqCount} | benefits=${benCount}`);
      if (Array.isArray(row.requirements) && row.requirements.length) {
        logger.debug(`   requirements: ${row.requirements.join(' | ')}`);
      }
      if (Array.isArray(row.benefits) && row.benefits.length) {
        logger.debug(`   benefits: ${row.benefits.join(' | ')}`);
      }
    }
    logger.info('✅ Verificación completada');
  } catch (error) {
    logger.error('❌ Error verificando microactividades:', error.message);
  } finally {
    db.end && db.end();
  }
}

if (require.main === module) {
  verifyMicroactivities(parseInt(process.argv[2], 10) || 10);
}

module.exports = verifyMicroactivities;
