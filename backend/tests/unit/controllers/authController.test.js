const path = require('path');

describe('AuthController', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const winston = require('../../../src/utils/logger');
      if (winston && winston.log) {
        jest.spyOn(winston, 'log').mockImplementation(() => {});
      }
    } catch (e) {}
  });
  beforeEach(() => {
    jest.resetModules();
  });

  test('login - success calls res.json with data', async () => {
    const authServicePath = require.resolve('../../../src/services/AuthService');
    const mockResult = { token: 'abc', user: { id: 1, email: 'a@b.com' } };
    jest.doMock(authServicePath, () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    const AuthService = require(authServicePath);
    AuthService.login.mockResolvedValue(mockResult);
    const AuthController = require('../../../src/api/controllers/AuthController');

    const req = { body: { email: 'a@b.com', password: 'pwd' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await AuthController.login(req, res, next);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: mockResult }));
  });

  test('login - error calls next with error', async () => {
    jest.resetModules();
    const authServicePath = require.resolve('../../../src/services/AuthService');
    const err = new Error('login failed');
    jest.doMock(authServicePath, () => ({
      login: jest.fn(),
      register: jest.fn()
    }));
    const AuthService = require(authServicePath);
    AuthService.login.mockRejectedValue(err);
    const AuthController = require('../../../src/api/controllers/AuthController');

    const req = { body: { email: 'a@b.com', password: 'pwd' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await AuthController.login(req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  test('register - success returns 201 and created data', async () => {
    jest.resetModules();
    const authServicePath = require.resolve('../../../src/services/AuthService');
    const created = { id: 2, email: 'new@u.com' };
    jest.doMock(authServicePath, () => ({
      register: jest.fn(),
      login: jest.fn()
    }));
    const AuthService = require(authServicePath);
    AuthService.register.mockResolvedValue(created);
    const AuthController = require('../../../src/api/controllers/AuthController');

    const req = { body: { email: 'new@u.com', password: 'pwd' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await AuthController.register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, data: created }));
  });
});
