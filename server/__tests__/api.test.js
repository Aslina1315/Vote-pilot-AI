/**
 * Health & AI Route Tests
 * Tests API health check and AI chat route (success + failure cases).
 * Uses supertest to make HTTP requests without starting a real server.
 */

const request = require('supertest');
const app = require('../index');

// Mock Mongoose connection so tests don't need a real MongoDB
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(true),
    connection: { close: jest.fn() },
  };
});

// Mock Gemini service to avoid real API calls in tests
jest.mock('../services/geminiService', () => ({
  sendMessage: jest.fn().mockResolvedValue('Here is a test AI response about voting.'),
  getStageGuidance: jest.fn().mockResolvedValue('Complete your voter registration at vote.gov.'),
}));

// Mock User model to isolate from DB
jest.mock('../models/User', () => {
  const mockUser = {
    conversationHistory: [],
    save: jest.fn().mockResolvedValue(true),
  };
  return {
    findOne: jest.fn().mockResolvedValue(mockUser),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockUser),
  };
});

describe('GET /api/health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('VotePilot AI Server');
  });
});

describe('POST /api/ai/chat', () => {
  it('should return 200 with AI response for valid message', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'How do I register to vote?',
        sessionId: 'testsession123',
        stage: 'registration',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('response');
    expect(typeof res.body.response).toBe('string');
  });

  it('should return 422 for empty message', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: '', sessionId: 'testsession123' });
    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 422 for message exceeding 1000 chars', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'a'.repeat(1001), sessionId: 'testsession123' });
    expect(res.statusCode).toBe(422);
  });

  it('should return 422 for invalid stage value', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Help me vote', sessionId: 'abc', stage: 'invalid_stage' });
    expect(res.statusCode).toBe(422);
  });
});

describe('GET /api/ai/guidance', () => {
  it('should return a tip for a valid stage', async () => {
    const res = await request(app)
      .get('/api/ai/guidance?stage=eligibility&persona=first-time');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('tip');
  });
});

describe('Unknown routes', () => {
  it('should return 404 for undefined routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
