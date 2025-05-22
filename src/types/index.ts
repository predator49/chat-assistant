import React from 'react';

export interface PluginResponse {
  type: string;
  [key: string]: any;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  type: 'text' | 'plugin';
  pluginName?: string;
  pluginData?: any;
  timestamp: string;
}

export interface Plugin {
  name: string;
  description: string;
  command: string;
  execute: (args: string) => Promise<any>;
  renderResponse: (data: any) => PluginResponse;
}

export interface ChatState {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
} 