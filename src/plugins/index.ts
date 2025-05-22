import { Plugin } from '../types';
import axios from 'axios';

const weatherPlugin: Plugin = {
  name: 'weather',
  description: 'Get current weather for a city',
  command: '/weather',
  execute: async (city: string) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!API_KEY) {
      throw new Error('OpenWeather API key is not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
    }
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  },
  renderResponse: (data: any) => {
    return {
      type: 'weather',
      temperature: data.main.temp,
      description: data.weather[0].description,
      city: data.name,
      humidity: data.main.humidity,
    };
  },
};

const calculatorPlugin: Plugin = {
  name: 'calculator',
  description: 'Calculate mathematical expressions',
  command: '/calc',
  execute: async (expression: string) => {
    // Using Function constructor for safe evaluation
    const sanitizedExpression = expression.replace(/[^0-9+\-*/(). ]/g, '');
    try {
      return {
        expression: sanitizedExpression,
        result: new Function(`return ${sanitizedExpression}`)(),
      };
    } catch (error) {
      throw new Error('Invalid mathematical expression');
    }
  },
  renderResponse: (data: any) => {
    return {
      type: 'calculator',
      expression: data.expression,
      result: data.result,
    };
  },
};

const dictionaryPlugin: Plugin = {
  name: 'dictionary',
  description: 'Get word definitions',
  command: '/define',
  execute: async (word: string) => {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return response.data[0];
  },
  renderResponse: (data: any) => {
    return {
      type: 'dictionary',
      word: data.word,
      phonetic: data.phonetic,
      meanings: data.meanings,
    };
  },
};

export const plugins = [weatherPlugin, calculatorPlugin, dictionaryPlugin];

export const findPlugin = (input: string): { plugin: Plugin; args: string } | null => {
  // Check for slash commands
  for (const plugin of plugins) {
    if (input.startsWith(plugin.command)) {
      const args = input.slice(plugin.command.length).trim();
      return { plugin, args };
    }
  }

  // Natural language parsing (basic)
  const words = input.toLowerCase().split(' ');
  
  if (words.includes('weather')) {
    const cityIndex = words.indexOf('weather') + 2; // Skip "in" if present
    if (words[cityIndex - 1] === 'in') {
      return {
        plugin: weatherPlugin,
        args: words.slice(cityIndex).join(' '),
      };
    } else {
      return {
        plugin: weatherPlugin,
        args: words.slice(words.indexOf('weather') + 1).join(' '),
      };
    }
  }

  if (words.includes('calculate') || words.includes('compute')) {
    const expression = words.slice(words.indexOf('calculate') + 1).join(' ');
    return {
      plugin: calculatorPlugin,
      args: expression,
    };
  }

  if (words.includes('define') || words.includes('meaning')) {
    const wordIndex = words.indexOf('define') + 1 || words.indexOf('meaning') + 2;
    if (wordIndex < words.length) {
      return {
        plugin: dictionaryPlugin,
        args: words[wordIndex],
      };
    }
  }

  return null;
}; 