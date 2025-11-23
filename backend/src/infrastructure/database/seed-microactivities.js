const db = require('./connection');
const logger = require('../../utils/logger');
const sampleMicroactivities = [
  {
    title: 'Respiración Profunda',
    description: 'Ejercicio de respiración para reducir el estrés y mejorar la concentración. Inhala profundamente, mantén y exhala lentamente.',
    category: 'Mente',
    duration: 1, // 1 minuto
    concentration_time: 3, // 3 minutos
    steps: JSON.stringify([
      'Siéntate cómodamente con la espalda recta',
      'Inhala lentamente por la nariz durante 4 segundos',
      'Mantén la respiración durante 4 segundos',
      'Exhala lentamente por la boca durante 6 segundos',
      'Repite el ciclo 10 veces'
    ])
  },
  {
    title: 'Dibujo Creativo',
    description: 'Actividad de dibujo libre para estimular la creatividad y relajar la mente.',
    category: 'Creatividad',
    duration: 1, // 1 minuto
    concentration_time: 10, // 10 minutos
    steps: JSON.stringify([
      'Prepara papel y materiales de dibujo',
      'Elige un tema libre o abstracto',
      'Comienza a dibujar sin restricciones',
      'Enfócate en el proceso, no en el resultado',
      'Disfruta la experiencia creativa'
    ])
  },
  {
    title: 'Estiramiento Básico',
    description: 'Serie de estiramientos suaves para aliviar la tensión muscular y mejorar la flexibilidad.',
    category: 'Cuerpo',
    duration: 1, // 1 minuto
    concentration_time: 5, // 5 minutos
    steps: JSON.stringify([
      'Estira el cuello hacia los lados',
      'Rota los hombros hacia atrás y adelante',
      'Estira los brazos hacia arriba',
      'Flexiona la espalda suavemente',
      'Estira las piernas una por una'
    ])
  },
  {
    title: 'Meditación Mindfulness',
    description: 'Práctica de atención plena para mejorar la concentración y reducir la ansiedad.',
    category: 'Mente',
    duration: 1, // 1 minuto
    concentration_time: 10, // 10 minutos
    steps: JSON.stringify([
      'Encuentra un lugar tranquilo',
      'Siéntate en posición cómoda',
      'Cierra los ojos suavemente',
      'Enfoca tu atención en la respiración',
      'Observa tus pensamientos sin juzgarlos'
    ])
  },
  {
    title: 'Escritura Creativa',
    description: 'Ejercicio de escritura libre para expresar ideas y emociones de manera creativa.',
    category: 'Creatividad',
    duration: 1, // 1 minuto
    concentration_time: 15, // 15 minutos
    steps: JSON.stringify([
      'Prepara papel y bolígrafo',
      'Elige un tema o palabra inspiradora',
      'Escribe continuamente sin detenerte',
      'No te preocupes por la gramática',
      'Deja fluir tus ideas libremente'
    ])
  },
  {
    title: 'Caminata Activa',
    description: 'Caminata corta para activar el cuerpo y mejorar la circulación.',
    category: 'Cuerpo',
    duration: 1, // 1 minuto
    concentration_time: 5, // 5 minutos
    steps: JSON.stringify([
      'Sal al aire libre o camina en interiores',
      'Mantén un ritmo constante',
      'Respira profundamente',
      'Observa tu entorno',
      'Disfruta del movimiento'
    ])
  },
  {
    title: 'Visualización Positiva',
    description: 'Técnica de visualización para mejorar el estado de ánimo y la motivación.',
    category: 'Mente',
    duration: 1, // 1 minuto
    concentration_time: 7, // 7 minutos
    steps: JSON.stringify([
      'Siéntate cómodamente',
      'Cierra los ojos',
      'Imagina un lugar que te haga feliz',
      'Visualiza detalles vívidos del lugar',
      'Mantén la imagen positiva en tu mente'
    ])
  },
  {
    title: 'Collage Digital',
    description: 'Creación de un collage usando imágenes digitales para expresar creatividad.',
    category: 'Creatividad',
    duration: 1, // 1 minuto
    concentration_time: 20, // 20 minutos
    steps: JSON.stringify([
      'Abre una aplicación de edición de imágenes',
      'Recopila imágenes que te inspiren',
      'Experimenta con diferentes composiciones',
      'Ajusta colores y efectos',
      'Crea tu obra final'
    ])
  },
  {
    title: 'Ejercicios de Fuerza',
    description: 'Rutina básica de ejercicios de fuerza usando el peso corporal.',
    category: 'Cuerpo',
    duration: 1, // 1 minuto
    concentration_time: 10, // 10 minutos
    steps: JSON.stringify([
      'Realiza 10 flexiones',
      'Haz 15 sentadillas',
      'Mantén plancha por 30 segundos',
      'Repite el circuito 3 veces',
      'Estira al finalizar'
    ])
  }
];
async function seedMicroactivities() {
  try {
    logger.info('🌱 Iniciando seed de microactividades...');
    await db.query('SELECT 1');
    logger.info('✅ Conexión a la base de datos verificada');
    for (const microactivity of sampleMicroactivities) {
      const result = await db.query(
        `INSERT INTO microactivities (
          title, description, category, duration, concentration_time, 
          steps, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING id, title`,
        [
          microactivity.title,
          microactivity.description,
          microactivity.category,
          microactivity.duration,
          microactivity.concentration_time,
          microactivity.steps
        ]
      );
      logger.info(`✅ Microactividad creada: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
    }
    const countResult = await db.query('SELECT COUNT(*) as total FROM microactivities');
    const total = countResult.rows[0].total;
    logger.info(`🎉 Seed completado exitosamente. Total de microactividades: ${total}`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error en el seed de microactividades:', error);
    process.exit(1);
  }
}
if (require.main === module) {
  seedMicroactivities();
}
module.exports = seedMicroactivities;
