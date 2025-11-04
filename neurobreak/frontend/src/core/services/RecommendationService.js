// Servicio de Recomendaciones - Algoritmo "Sorpréndeme"
import { MicroactivityRepository } from '../repositories/MicroactivityRepository';
import { HistoryRepository } from '../repositories/HistoryRepository';

export class RecommendationService {
  constructor() {
    this.microactivityRepository = new MicroactivityRepository();
    this.historyRepository = new HistoryRepository();
  }

  async getRecommendation(userId) {
    // TODO: Implementar algoritmo de recomendación
    const history = await this.historyRepository.findByUser(userId);
    const allActivities = await this.microactivityRepository.findAll();

    // Filtrar actividades no realizadas recientemente
    const recentIds = history.slice(-5).map(h => h.microactivityId);
    const candidates = allActivities.filter(a => !recentIds.includes(a.id));

    // Seleccionar una al azar
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }
}

export default RecommendationService;
