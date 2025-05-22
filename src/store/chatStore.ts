import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Message } from '../types';

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    }],
  })),
  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore; 