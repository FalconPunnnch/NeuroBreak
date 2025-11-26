const request = require('supertest');

// Mock external dependencies to avoid DB calls
jest.mock('../../src/core/application/services/AuthService', () => ({
  login: jest.fn(async () => ({
    user: {
      id: 20,
      email: 'loginint@example.com',
      firstName: 'Login',
      lastName: 'Integration',
      role: 'student'
    },
    token: 'login-integration-jwt'
  })),
  register: jest.fn(async () => ({
    id: 10,
    email: 'inttest@example.com',
    first_name: 'Int',
    last_name: 'Test',
    role: 'student'
  }))
}));
jest.mock('../../src/core/application/services/EmailService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../../src/core/application/services/AuthService');
const EmailService = require('../../src/core/application/services/EmailService');

const app = require('../../src/app');

describe('Auth routes (integration, mocked services)', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      const winston = require('../../src/utils/logger');
      if (winston && winston.log) {
        jest.spyOn(winston, 'log').mockImplementation(() => {});
      }
    } catch (e) {}
  });
  beforeEach(() => {
    jest.resetAllMocks();
    // Setup default mocks
    jest.spyOn(AuthService, 'login').mockImplementation(async () => ({
      user: {
        id: 20,
        email: 'loginint@example.com',
        firstName: 'Login',
        lastName: 'Integration',
        role: 'student'
      },
      token: 'login-integration-jwt'
    }));
    jest.spyOn(AuthService, 'register').mockImplementation(async () => ({
      id: 10,
      email: 'inttest@example.com',
      first_name: 'Int',
      last_name: 'Test',
      role: 'student'
    }));
    AuthService.findUserByEmail = jest.fn();
    AuthService.createUser = jest.fn();
    AuthService.findUserById = jest.fn();
    AuthService.savePasswordResetToken = jest.fn();
    AuthService.findUserByResetToken = jest.fn();
    AuthService.updatePassword = jest.fn();
    EmailService.sendWelcomeEmail = jest.fn();
    EmailService.sendPasswordResetEmail = jest.fn();
  });

  test('POST /api/auth/register -> 201 and returns token', async () => {
    const userData = {
      id: 10,
      email: 'inttest@example.com',
      first_name: 'Int',
      last_name: 'Test',
      role: 'student'
    };
    AuthService.register.mockResolvedValue(userData);
    jwt.sign.mockReturnValue('integration-jwt');

    const res = await request(app)
      .post('/api/auth/register')
      .send({ firstName: 'Int', lastName: 'Test', email: 'inttest@example.com', password: 'Password1!' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      message: expect.any(String),
      data: userData
    });
  });

  test('POST /api/auth/login -> 200 and returns token when credentials valid', async () => {
    const loginResult = {
      user: {
        id: 20,
        email: 'loginint@example.com',
        firstName: 'Login',
        lastName: 'Integration',
        role: 'student'
      },
      token: 'login-integration-jwt'
    };
    AuthService.login.mockResolvedValue(loginResult);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'loginint@example.com', password: 'Password1!' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: expect.any(String),
      data: loginResult
    });
  });
});
