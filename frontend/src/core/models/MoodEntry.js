export class MoodEntry {
  constructor({
    id = null,
    userId = null,
    microactivityId = null,
    mood = '',
    emoji = '',
    timestamp = new Date()
  }) {
    this.id = id;
    this.userId = userId;
    this.microactivityId = microactivityId;
    this.mood = mood;
    this.emoji = emoji;
    this.timestamp = timestamp;
  }
}
export default MoodEntry;
