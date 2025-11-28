import apiClient from 'infrastructure/api/apiClient';
export class MoodRepository {
  constructor(httpClient = apiClient) {
    this.http = httpClient;
    this.basePath = '/moods';
  }
  async create(moodData) {
    try {
      const response = await this.http.post(this.basePath, moodData);
      return response.data;
    } catch (error) {
      throw new Error(`Error al crear entrada de estado emocional: ${error.message}`);
    }
  }
  async findByUser(filters = {}) {
    try {
      const response = await this.http.get(this.basePath, { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener entradas de estado emocional: ${error.message}`);
    }
  }
  async getStatistics(days = 7) {
    try {
      const response = await this.http.get(`${this.basePath}/stats`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener estad�sticas de estado emocional: ${error.message}`);
    }
  }
  async delete(entryId) {
    try {
      const response = await this.http.delete(`${this.basePath}/${entryId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error al eliminar entrada de estado emocional: ${error.message}`);
    }
  }
  async createBatch(moodEntries) {
    try {
      const promises = moodEntries.map(entry => this.create(entry));
      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
      const failed = results.filter(r => r.status === 'rejected').map(r => r.reason);
      return {
        successful: successful.length,
        failed: failed.length,
        errors: failed
      };
    } catch (error) {
      throw new Error(`Error en operaci�n batch de estado emocional: ${error.message}`);
    }
  }
}
export default MoodRepository;
