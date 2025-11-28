import FilterStrategy from './FilterStrategy.js';
import { DURATIONS } from 'config/constants';
export class DurationFilterStrategy extends FilterStrategy {
  apply(items, durationKey) {
    if (!this.isValidCriteria(durationKey) || durationKey === 'all') {
      return items;
    }
    const durationRange = DURATIONS[durationKey];
    if (!durationRange) {
      console.warn(`Duración no válida: ${durationKey}`);
      return items;
    }
    return items.filter(item => {
      const durationInMinutes = this.getDurationInMinutes(item.duration);
      return durationInMinutes >= durationRange.min && durationInMinutes < durationRange.max;
    });
  }
  getDurationInMinutes(durationInMinutes) {
    return Math.floor(durationInMinutes || 0);
  }
  getName() {
    return 'duration';
  }
  getAvailableDurations() {
    return [
      { value: 'all', label: 'Todas las duraciones' },
      ...Object.entries(DURATIONS).map(([key, config]) => ({
        value: key,
        label: config.label
      }))
    ];
  }
  isValidDurationKey(durationKey) {
    return Object.keys(DURATIONS).includes(durationKey);
  }
}
export default DurationFilterStrategy;
