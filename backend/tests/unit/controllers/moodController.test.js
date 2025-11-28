const MoodControllerClass = require('../../../src/api/controllers/MoodController');

describe('MoodController', () => {
  test('createMoodEntry - valid input calls service and returns 201', async () => {
    const mockService = {
      createMoodEntry: jest.fn().mockResolvedValue({ id: 1, mood: 'happy' })
    };
    const controller = new MoodControllerClass(mockService);
    const req = {
      body: { microactivityId: 1, mood: 'happy', emoji: '😊' },
      userId: 10
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await controller.createMoodEntry(req, res, next);

    expect(mockService.createMoodEntry).toHaveBeenCalledWith({
      userId: 10,
      microactivityId: 1,
      mood: 'happy',
      emoji: '😊'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: { id: 1, mood: 'happy' } }));
  });

  test('createMoodEntry - invalid input returns 400 with errors', async () => {
    const mockService = { createMoodEntry: jest.fn() };
    const controller = new MoodControllerClass(mockService);
    const req = { body: { mood: 'invalid' }, userId: 5 };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await controller.createMoodEntry(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, errors: expect.any(Array) }));
    expect(mockService.createMoodEntry).not.toHaveBeenCalled();
  });

  test('getUserMoodEntries - service throws returns empty fallback', async () => {
    const mockService = {
      getMoodEntriesByUser: jest.fn().mockRejectedValue(new Error('no table'))
    };
    const controller = new MoodControllerClass(mockService);
    const req = { query: {}, userId: 7 };
    const res = { json: jest.fn() };
    const next = jest.fn();

    await controller.getUserMoodEntries(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: expect.objectContaining({ entries: expect.any(Array) }) }));
  });
});
