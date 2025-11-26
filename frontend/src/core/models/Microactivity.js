export class Microactivity {
  constructor({
    id = null,
    title = '',
    description = '',
    category = '',
    duration = 0,
    concentrationTime = 0,
    steps = [],
    imageUrl = null,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.duration = duration;
    this.concentrationTime = concentrationTime;
    this.steps = steps;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  getDurationInMinutes() {
    return Math.floor(this.duration);  // Ya viene en minutos
  }
  getCategoryIcon() {
    const icons = {
      'Mente': '',
      'Creatividad': '',
      'Cuerpo': ''
    };
    return icons[this.category] || '';
  }
}
export default Microactivity;
