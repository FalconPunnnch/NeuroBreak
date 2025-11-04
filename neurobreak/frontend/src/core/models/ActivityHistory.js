// Modelo de dominio: Historial de Actividades
export class ActivityHistory {
  constructor({
    id = null,
    userId = null,
    microactivityId = null,
    completedAt = new Date(),
    duration = 0,
    mood = null
  }) {
    this.id = id;
    this.userId = userId;
    this.microactivityId = microactivityId;
    this.completedAt = completedAt;
    this.duration = duration;
    this.mood = mood;
  }
}

export default ActivityHistory;
