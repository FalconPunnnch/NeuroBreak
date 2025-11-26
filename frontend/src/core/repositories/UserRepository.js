import apiClient from '../../config/api.config';
export class UserRepository {
  async findAll() {
    const response = await apiClient.get('/users');
    return response.data;
  }
  async findById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }
  async create(data) {
    const response = await apiClient.post('/users', data);
    return response.data;
  }
  async update(id, data) {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  }
  async delete(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }
  async findByEmail(email) {
    const response = await apiClient.get(`/users/email/${email}`);
    return response.data;
  }
}
export default new UserRepository();
