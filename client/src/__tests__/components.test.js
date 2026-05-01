/**
 * Frontend Component Tests
 * Tests key components for rendering and interaction.
 * Uses React Testing Library + Jest.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// ─── Mock API calls to isolate component tests ───────────────────────────────
jest.mock('../services/api', () => ({
  sendAiMessage:   jest.fn().mockResolvedValue({ response: 'You can vote at age 18!', sessionId: 'test' }),
  getAiGuidance:   jest.fn().mockResolvedValue({ tip: 'Register at vote.gov today!' }),
  getJourney:      jest.fn().mockResolvedValue({ journey: null }),
  getUser:         jest.fn().mockResolvedValue({ name: 'Test User', persona: 'first-time' }),
  upsertUser:      jest.fn().mockResolvedValue({}),
  updateJourneyStep: jest.fn().mockResolvedValue({ journey: null, tip: 'Great job!' }),
  resetJourney:    jest.fn().mockResolvedValue({}),
  clearAiHistory:  jest.fn().mockResolvedValue({}),
  addWarning:      jest.fn().mockResolvedValue({}),
  updateUserSettings: jest.fn().mockResolvedValue({}),
}));

// Mock localStorage for session
beforeAll(() => {
  Storage.prototype.getItem  = jest.fn(() => 'test-session-id');
  Storage.prototype.setItem  = jest.fn();
});

// ─── Import components after mocks ───────────────────────────────────────────
const { AppProvider } = require('../context/AppContext');
const ChatMessage     = require('../components/chat/ChatMessage').default;
const TypingIndicator = require('../components/chat/TypingIndicator').default;
const ChatInput       = require('../components/chat/ChatInput').default;

// Helper: wrap with providers
const renderWithProviders = (ui) =>
  render(<MemoryRouter><AppProvider>{ui}</AppProvider></MemoryRouter>);

// ─── ChatMessage tests ───────────────────────────────────────────────────────
describe('ChatMessage component', () => {
  it('renders a user message bubble', () => {
    render(
      <ChatMessage
        message={{ id: '1', role: 'user', text: 'How do I register?', timestamp: new Date() }}
      />
    );
    expect(screen.getByText('How do I register?')).toBeInTheDocument();
  });

  it('renders an AI message bubble', () => {
    render(
      <ChatMessage
        message={{ id: '2', role: 'ai', text: 'Visit vote.gov to register!', timestamp: new Date() }}
      />
    );
    expect(screen.getByText('Visit vote.gov to register!')).toBeInTheDocument();
  });

  it('formats bold text correctly', () => {
    render(
      <ChatMessage
        message={{ id: '3', role: 'ai', text: '**Important:** Bring your ID.', timestamp: new Date() }}
      />
    );
    expect(screen.getByText('Important:')).toBeInTheDocument();
  });
});

// ─── TypingIndicator tests ───────────────────────────────────────────────────
describe('TypingIndicator component', () => {
  it('renders with aria-label for screen readers', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status', { name: /typing/i })).toBeInTheDocument();
  });
});

// ─── ChatInput tests ─────────────────────────────────────────────────────────
describe('ChatInput component', () => {
  it('renders the text input and send button', () => {
    render(
      <ChatInput
        value=""
        onChange={jest.fn()}
        onSend={jest.fn()}
        isLoading={false}
        isListening={false}
        isVoiceSupported={false}
      />
    );
    expect(screen.getByRole('textbox', { name: /type your message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    const onChange = jest.fn();
    render(
      <ChatInput
        value=""
        onChange={onChange}
        onSend={jest.fn()}
        isLoading={false}
        isListening={false}
        isVoiceSupported={false}
      />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Hello' } });
    expect(onChange).toHaveBeenCalledWith('Hello');
  });

  it('send button is disabled when input is empty', () => {
    render(
      <ChatInput
        value=""
        onChange={jest.fn()}
        onSend={jest.fn()}
        isLoading={false}
        isListening={false}
        isVoiceSupported={false}
      />
    );
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('calls onSend when Enter is pressed', () => {
    const onSend = jest.fn();
    render(
      <ChatInput
        value="Test message"
        onChange={jest.fn()}
        onSend={onSend}
        isLoading={false}
        isListening={false}
        isVoiceSupported={false}
      />
    );
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', shiftKey: false });
    expect(onSend).toHaveBeenCalled();
  });

  it('shows voice button when voice is supported', () => {
    render(
      <ChatInput
        value=""
        onChange={jest.fn()}
        onSend={jest.fn()}
        isLoading={false}
        isListening={false}
        isVoiceSupported={true}
      />
    );
    expect(screen.getByRole('button', { name: /voice input/i })).toBeInTheDocument();
  });
});
