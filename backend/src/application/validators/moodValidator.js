const VALID_MOODS = ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'];
const VALID_EMOJIS = ['😄', '😊', '😐', '😔', '😭'];
function validateCreateMoodEntry(data) {
  const errors = [];
  if (!data.microactivityId) {
    errors.push({
      field: 'microactivityId',
      message: 'ID de microactividad es requerido'
    });
  } else if (!Number.isInteger(data.microactivityId) || data.microactivityId <= 0) {
    errors.push({
      field: 'microactivityId',
      message: 'ID de microactividad debe ser un número entero positivo'
    });
  }
  if (!data.mood) {
    errors.push({
      field: 'mood',
      message: 'Estado emocional es requerido'
    });
  } else if (!VALID_MOODS.includes(data.mood)) {
    errors.push({
      field: 'mood',
      message: `Estado emocional debe ser uno de: ${VALID_MOODS.join(', ')}`
    });
  }
  if (!data.emoji) {
    errors.push({
      field: 'emoji',
      message: 'Emoji es requerido'
    });
  } else if (!VALID_EMOJIS.includes(data.emoji)) {
    errors.push({
      field: 'emoji',
      message: `Emoji debe ser uno de: ${VALID_EMOJIS.join(', ')}`
    });
  }
  if (data.mood && data.emoji) {
    const moodIndex = VALID_MOODS.indexOf(data.mood);
    const emojiIndex = VALID_EMOJIS.indexOf(data.emoji);
    if (moodIndex !== -1 && emojiIndex !== -1 && moodIndex !== emojiIndex) {
      errors.push({
        field: 'mood_emoji_mismatch',
        message: 'El emoji no corresponde con el estado emocional seleccionado'
      });
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function validateGetMoodEntriesQuery(query) {
  const errors = [];
  if (query.limit !== undefined) {
    const limit = parseInt(query.limit);
    if (isNaN(limit) || limit <= 0 || limit > 100) {
      errors.push({
        field: 'limit',
        message: 'Límite debe ser un número entre 1 y 100'
      });
    }
  }
  if (query.offset !== undefined) {
    const offset = parseInt(query.offset);
    if (isNaN(offset) || offset < 0) {
      errors.push({
        field: 'offset',
        message: 'Offset debe ser un número no negativo'
      });
    }
  }
  if (query.microactivityId !== undefined) {
    const microactivityId = parseInt(query.microactivityId);
    if (isNaN(microactivityId) || microactivityId <= 0) {
      errors.push({
        field: 'microactivityId',
        message: 'ID de microactividad debe ser un número entero positivo'
      });
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
module.exports = {
  validateCreateMoodEntry,
  validateGetMoodEntriesQuery,
  VALID_MOODS,
  VALID_EMOJIS
};
