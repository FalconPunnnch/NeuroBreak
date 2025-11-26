const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mocks
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../src/core/application/services/AuthService');
jest.mock('../../../src/core/application/services/EmailService');
// Prevent actual DB connections during unit tests
jest.mock('../../../src/infrastructure/database/connection');

describe('AuthController - register & login', () => {
  let AuthController;

  beforeEach(() => {
    // Clear module cache and re-require controller so mocks apply
    jest.resetModules();
    bcrypt.hash.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
  AuthController = require('../../../src/application/controllers/AuthController');

    // Replace services with controllable mocks
    AuthController.authService = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      findUserById: jest.fn(),
      savePasswordResetToken: jest.fn(),
      findUserByResetToken: jest.fn(),
      updatePassword: jest.fn()
    };
    AuthController.emailService = {
      sendWelcomeEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn()
    };
  });

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
  }

  test('register - success', async () => {
    const req = {
      body: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password1!'
      }
    };
    const res = mockRes();

    AuthController.authService.findUserByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedpass');
    AuthController.authService.createUser.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'student',
      profile_picture: null
    });
    jwt.sign.mockReturnValue('jwt-token-123');
    AuthController.emailService.sendWelcomeEmail.mockResolvedValue(true);

  const next = jest.fn();
  await AuthController.register(req, res, next);

  expect(AuthController.authService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
  expect(AuthController.authService.createUser).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalled();
  });

  test('register - missing fields returns 400', async () => {
    const req = { body: {} };
    const res = mockRes();

  const next = jest.fn();
  await AuthController.register(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Todos los campos son obligatorios' }));
  });

  test('login - success', async () => {
    const req = { body: { email: 'login@example.com', password: 'Password1!' } };
    const res = mockRes();

    const fakeUser = {
      id: 2,
      email: 'login@example.com',
      password: 'hashedpass',
      role: 'student',
      first_name: 'Login',
      last_name: 'User'
    };

    AuthController.authService.findUserByEmail.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('login-jwt-token');

  const next = jest.fn();
  await AuthController.login(req, res, next);

  expect(AuthController.authService.findUserByEmail).toHaveBeenCalledWith('login@example.com');
  expect(res.json).toHaveBeenCalled();
  });

  test('login - invalid credentials returns 401', async () => {
    const req = { body: { email: 'noone@example.com', password: 'x' } };
    const res = mockRes();

    AuthController.authService.findUserByEmail.mockResolvedValue(null);

  const next = jest.fn();
  await AuthController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'Credenciales inválidas' }));
  });

  test('login - oauth account without password returns 401', async () => {
    const req = { body: { email: 'oauth@example.com', password: 'any' } };
    const res = mockRes();

    const oauthUser = { id: 3, email: 'oauth@example.com', password: null };
    AuthController.authService.findUserByEmail.mockResolvedValue(oauthUser);

  const next = jest.fn();
  await AuthController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: expect.stringContaining('Esta cuenta fue registrada con Google/Microsoft') }));
  });
});
