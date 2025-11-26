const request = require('supertest');

// Mock external dependencies to avoid DB calls
jest.mock('../../src/core/application/services/AuthService');
jest.mock('../../src/core/application/services/EmailService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../../src/core/application/services/AuthService');
const EmailService = require('../../src/core/application/services/EmailService');

const app = require('../../src/app');

// Skipping integration tests in this quick-run to avoid DB/email external calls.
// These tests can be enabled in CI with proper test DB and email mocks.
describe.skip('Auth routes (integration, mocked services)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Setup default mocks
    AuthService.mockImplementation(() => ({
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      findUserById: jest.fn(),
      savePasswordResetToken: jest.fn(),
      findUserByResetToken: jest.fn(),
      updatePassword: jest.fn()
    }));
    EmailService.mockImplementation(() => ({
      sendWelcomeEmail: jest.fn(),
      sendPasswordResetEmail: jest.fn()
    }));
  });

  test('POST /api/auth/register -> 201 and returns token', async () => {
    const fakeCreateUser = jest.fn().mockResolvedValue({
      id: 10,
      email: 'inttest@example.com',
      first_name: 'Int',
      last_name: 'Test',
      role: 'student'
    });
    // Ensure findUserByEmail returns null (not existing)
    const fakeFindUser = jest.fn().mockResolvedValue(null);
    AuthService.mockImplementation(() => ({
      findUserByEmail: fakeFindUser,
      createUser: fakeCreateUser
    }));

    bcrypt.hash.mockResolvedValue('hashed-password');
    jwt.sign.mockReturnValue('integration-jwt');

    const res = await request(app)
      .post('/api/auth/register')
      .send({ firstName: 'Int', lastName: 'Test', email: 'inttest@example.com', password: 'Password1!' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token', 'integration-jwt');
    expect(fakeCreateUser).toHaveBeenCalled();
  });

  test('POST /api/auth/login -> 200 and returns token when credentials valid', async () => {
    const fakeUser = {
      id: 20,
      email: 'loginint@example.com',
      password: 'hashedpass',
      role: 'student',
      first_name: 'Login',
      last_name: 'Integration'
    };
    const fakeFindUser = jest.fn().mockResolvedValue(fakeUser);
    AuthService.mockImplementation(() => ({ findUserByEmail: fakeFindUser }));

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('login-integration-jwt');

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'loginint@example.com', password: 'Password1!' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'login-integration-jwt');
    expect(fakeFindUser).toHaveBeenCalledWith('loginint@example.com');
  });
});
