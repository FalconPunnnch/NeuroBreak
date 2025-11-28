const db = require('./connection');
const logger = require('../../utils/logger');
function getDurationLabel(minutes) {
  if (minutes === 1) return '1 minuto';
  return `${minutes} minutos`;
}
const sampleMicroactivities = [
  {
    title: 'Respiración Profunda',
    description: 'Ejercicio de respiración para reducir el estrés y mejorar la concentración. Inhala profundamente, mantén y exhala lentamente.',
    category: 'Mente',
    duration: 5, // minutos
    concentration_time: 10, // minutos
    steps: JSON.stringify([
      'Siéntate cómodamente con la espalda recta',
      'Inhala lentamente por la nariz durante 4 segundos',
      'Mantén la respiración durante 4 segundos',
      'Exhala lentamente por la boca durante 6 segundos',
      'Repite el ciclo 10 veces'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Dibujo Creativo',
    description: 'Actividad de dibujo libre para estimular la creatividad y relajar la mente.',
    category: 'Creatividad',
    duration: 15, // minutos
    concentration_time: 15, // minutos
    steps: JSON.stringify([
      'Prepara papel y materiales de dibujo',
      'Elige un tema libre o abstracto',
      'Comienza a dibujar sin restricciones',
      'Enfócate en el proceso, no en el resultado',
      'Disfruta la experiencia creativa'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(15)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Estiramiento Básico',
    description: 'Serie de estiramientos suaves para aliviar la tensión muscular y mejorar la flexibilidad.',
    category: 'Cuerpo',
    duration: 5, // minuto
    concentration_time: 25, // minutos
    steps: JSON.stringify([
      'Estira el cuello hacia los lados',
      'Rota los hombros hacia atrás y adelante',
      'Estira los brazos hacia arriba',
      'Flexiona la espalda suavemente',
      'Estira las piernas una por una'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Meditación Mindfulness',
    description: 'Práctica de atención plena para mejorar la concentración y reducir la ansiedad.',
    category: 'Mente',
    duration: 8, // 1 minuto
    concentration_time: 60, // 10 minutos
    steps: JSON.stringify([
      'Encuentra un lugar tranquilo',
      'Siéntate en posición cómoda',
      'Cierra los ojos suavemente',
      'Enfoca tu atención en la respiración',
      'Observa tus pensamientos sin juzgarlos'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(8)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Escritura Creativa',
    description: 'Ejercicio de escritura libre para expresar ideas y emociones de manera creativa.',
    category: 'Creatividad',
    duration: 10, // minutos
    concentration_time: 15, // minutos
    steps: JSON.stringify([
      'Prepara papel y bolígrafo',
      'Elige un tema o palabra inspiradora',
      'Escribe continuamente sin detenerte',
      'No te preocupes por la gramática',
      'Deja fluir tus ideas libremente'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(10)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Movilidad Energética',
    description: 'Secuencia corta de movimientos dinámicos para activar articulaciones y elevar ligeramente el pulso.',
    category: 'Cuerpo',
    duration: 5, // minutos
    concentration_time: 25, // minutos
    steps: JSON.stringify([
      'Ponte de pie con postura recta',
      'Realiza círculos lentos de hombros hacia atrás y hacia adelante',
      'Eleva rodillas alternadas durante 20 segundos',
      'Haz giros suaves de torso a ambos lados',
      'Respira profundo y finaliza con estiramiento de brazos'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Visualización Positiva',
    description: 'Técnica de visualización para mejorar el estado de ánimo y la motivación.',
    category: 'Mente',
    duration: 5, // minutos
    concentration_time: 30, // minutos
    steps: JSON.stringify([
      'Siéntate cómodamente',
      'Cierra los ojos',
      'Imagina un lugar que te haga feliz',
      'Visualiza detalles vívidos del lugar',
      'Mantén la imagen positiva en tu mente'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Collage Digital Express',
    description: 'Creación de un collage usando imágenes digitales para expresar creatividad.',
    category: 'Creatividad',
    duration: 10, // minutos
    concentration_time: 20, // minutos
    steps: JSON.stringify([
      'Abre una aplicación de edición de imágenes',
      'Recopila imágenes que te inspiren',
      'Experimenta con diferentes composiciones',
      'Ajusta colores y efectos',
      'Crea tu obra final'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(10)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Ejercicios de Fuerza y Resistencia',
    description: 'Rutina básica de ejercicios de fuerza y resistencia usando el peso corporal.',
    category: 'Cuerpo',
    duration: 20, // minutos
    concentration_time: 90, // minutos
    steps: JSON.stringify([
      'Realiza 10 flexiones — recuerda mantener los codos cerca a tu cuerpo',
      'Descansa 30 segundos',
      'Haz 15 sentadillas',
      'Descansa 30 segundos',
      'Mantén posición de plancha por 30 segundos',
      'Repite el circuito 3 veces',
      'Haz estiramientos suaves al finalizar'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(20)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Organización Rápida',
    description: 'Pequeña sesión para ordenar tu espacio de trabajo y promover claridad mental.',
    category: 'Mente',
    duration: 5, // minutos
    concentration_time: 10, // minutos
    steps: JSON.stringify([
      'Identifica los objetos fuera de lugar',
      'Guarda o apila lo esencial',
      'Limpia rápidamente tu superficie principal',
      'Organiza cables o accesorios visibles',
      'Respira profundo y observa la diferencia'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Impro Musical',
    description: 'Pequeña improvisación musical para relajar la mente y expresar emociones.',
    category: 'Creatividad',
    duration: 10, // minutos
    concentration_time: 15, // minutos
    steps: JSON.stringify([
      'Abre una app o instrumento simple (piano virtual, ocarina, etc.)',
      'Elige un ritmo o melodía base',
      'Improvisa sonidos sin buscar perfección',
      'Explora diferentes intensidades',
      'Escucha lo que creaste por unos segundos'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(10)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Movilidad Suave',
    description: 'Secuencia ligera para liberar tensión articular y mejorar el flujo corporal.',
    category: 'Cuerpo',
    duration: 5, // minutos
    concentration_time: 10, // minutos
    steps: JSON.stringify([
      'Rota lentamente cuello y hombros',
      'Haz círculos con brazos',
      'Rota la cadera suavemente',
      'Flexiona rodillas y tobillos',
      'Respira profundo para terminar'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Escritura de Gratitud Express',
    description: 'Actividad corta para mejorar el estado emocional enfocándote en cosas positivas de tu día.',
    category: 'Mente',
    duration: 3, // minutos
    concentration_time: 10, // minutos
    steps: JSON.stringify([
      'Toma papel o abre una nota en tu dispositivo',
      'Escribe 3 cosas por las que te sientes agradecida hoy',
      'Añade una frase positiva para ti misma',
      'Lee todo en voz baja',
      'Respira profundo y cierra la nota'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(3)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Mini Fotografía Creativa',
    description: 'Ejercicio rápido para entrenar el ojo creativo tomando una foto con intención artística.',
    category: 'Creatividad',
    duration: 5, // minutos
    concentration_time: 12, // minutos
    steps: JSON.stringify([
      'Toma tu teléfono o cámara',
      'Busca un objeto, textura o luz interesante',
      'Enfoca desde distintos ángulos',
      'Toma una foto que represente una emoción',
      'Observa tu foto final y nómbrala mentalmente'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
  },
  {
    title: 'Auto-Masaje Relajante',
    description: 'Técnica breve de automasaje para liberar tensión acumulada en cuello y hombros.',
    category: 'Cuerpo',
    duration: 5, // minutos
    concentration_time: 30, // minutos
    steps: JSON.stringify([
      'Siéntate con espalda recta',
      'Con las yemas de los dedos masajea suavemente la base del cuello, bajo la nuca',
      'Realiza movimientos circulares en las sienes por 20–30 segundos',
      'Respira profundo para finalizar'
    ]),
    requirements: (durationLabel => [
      'Un espacio cómodo y tranquilo',
      `${durationLabel} de tiempo disponible`,
      'Actitud positiva y ganas de relajarte'
    ])(getDurationLabel(5)),
    benefits: [
      'Reduce el estrés y la ansiedad',
      'Mejora el enfoque y la concentración',
      'Aumenta el bienestar general'
    ]
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
          steps, requirements, benefits, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING id, title`,
        [
          microactivity.title,
          microactivity.description,
          microactivity.category,
          microactivity.duration,
          microactivity.concentration_time,
          microactivity.steps,
          JSON.stringify(microactivity.requirements),
          JSON.stringify(microactivity.benefits)
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
