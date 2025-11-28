export const CATEGORIES = {
  MIND: 'Mente',
  CREATIVITY: 'Creatividad',
  BODY: 'Cuerpo'
};
export const CATEGORIES_ARRAY = Object.values(CATEGORIES);
export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin'
};
export const MOOD_OPTIONS = [
  { emoji: '??', value: 'happy', label: 'Feliz' },
  { emoji: '??', value: 'relaxed', label: 'Relajado' },
  { emoji: '??', value: 'neutral', label: 'Neutral' },
  { emoji: '??', value: 'sad', label: 'Triste' },
  { emoji: '??', value: 'stressed', label: 'Estresado' }
];
export const DURATIONS = {
  SHORT: { min: 0, max: 6, label: '0-5 min' },
  MEDIUM: { min: 6, max: 11, label: '5-10 min' },
  LONG: { min: 11, max: 20, label: '10-20 min' }
};
export const VALIDATION = {
  MIN_SEARCH_LENGTH: 2,
  MAX_DURATION: 60,
  MIN_DURATION: 1
};
