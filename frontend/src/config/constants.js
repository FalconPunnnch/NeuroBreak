// Constantes globales de la aplicación
export const CATEGORIES = {
  MIND: 'Mente',
  CREATIVITY: 'Creatividad',
  BODY: 'Cuerpo'
};

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const MOOD_OPTIONS = [
  { emoji: '', value: 'happy', label: 'Feliz' },
  { emoji: '', value: 'relaxed', label: 'Relajado' },
  { emoji: '', value: 'neutral', label: 'Neutral' },
  { emoji: '', value: 'sad', label: 'Triste' },
  { emoji: '', value: 'stressed', label: 'Estresado' }
];

export const DURATIONS = {
  SHORT: { min: 0, max: 5, label: '0-5 min' },
  MEDIUM: { min: 5, max: 10, label: '5-10 min' },
  LONG: { min: 10, max: 20, label: '10-20 min' }
};
