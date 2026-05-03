/**
 * User Journey Integration Test
 * Verifies the full user flow from eligibility to simulation.
 */

const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

describe('Full User Journey Integration', () => {
  const sessionId = 'test-journey-' + Date.now();
  let authToken = 'mock-token';

  it('1. Should allow checking eligibility via AI', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Am I eligible to vote? I am 19 and a citizen.',
        sessionId,
        stage: 'eligibility'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBeDefined();
  });

  it('2. Should allow creating a user profile', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({
        sessionId,
        name: 'Test Citizen',
        state: 'Delhi',
        age: 19
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.name).toBe('Test Citizen');
  });

  it('3. Should allow updating journey progress', async () => {
    const res = await request(app)
      .post(`/api/journey/${sessionId}/step`)
      .send({
        step: 'eligibility',
        completed: true
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.journey.steps.eligibility.completed).toBe(true);
  });

  it('4. Should handle XSS attempts in profile', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({
        sessionId,
        name: '<script>alert(1)</script>',
        state: 'Delhi',
        age: 19
      });
    expect(res.statusCode).toBe(422); // Validation should catch HTML tags
  });
});
