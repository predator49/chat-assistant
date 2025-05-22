import React from 'react';
import { IconUser, IconRobot, IconTemperature, IconCalculator, IconBook } from '@tabler/icons-react';
import { Message } from '../types';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const renderPluginContent = () => {
    if (!message.pluginData) return null;

    switch (message.pluginName) {
      case 'weather':
        return (
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10 mt-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
              <IconTemperature size={24} />
              Weather in {message.pluginData.city}
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-extrabold text-white">{Math.round(message.pluginData.temperature)}°C</p>
              <p className="text-white font-semibold capitalize">{message.pluginData.description}</p>
              <p className="text-white font-semibold">Humidity: {message.pluginData.humidity}%</p>
            </div>
          </div>
        );

      case 'calculator':
        return (
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10 mt-2">
            <div className="flex items-center gap-2 text-purple-400 font-semibold mb-2">
              <IconCalculator size={24} />
              Calculator Result
            </div>
            <div>
              <p className="text-white font-semibold">{message.pluginData.expression} =</p>
              <p className="text-3xl font-extrabold text-white">{message.pluginData.result}</p>
            </div>
          </div>
        );

      case 'dictionary':
        return (
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10 mt-2">
            <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
              <IconBook size={24} />
              Definition of "{message.pluginData.word}"
            </div>
            <div className="space-y-2">
              {message.pluginData.phonetic && (
                <p className="text-white font-semibold font-mono">{message.pluginData.phonetic}</p>
              )}
              {message.pluginData.meanings.map((meaning: any, index: number) => (
                <div key={index} className="border-t border-white/10 pt-2 first:border-t-0 first:pt-0">
                  <p className="text-sm text-white font-semibold italic">{meaning.partOfSpeech}</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {meaning.definitions.slice(0, 2).map((def: any, i: number) => (
                      <li key={i} className="text-white font-semibold">{def.definition}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex gap-3 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
        isUser ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-white/20' : 'bg-black/40 border-white/10'
      }`}>
        {isUser ? (
          <IconUser size={20} className="text-white" />
        ) : (
          <IconRobot size={20} className="text-cyan-400" />
        )}
      </div>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
        <div
          className={`rounded-2xl px-5 py-3 shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold'
              : 'bg-black/40 border border-white/10 text-white font-semibold'
          }`}
        >
          {message.content && (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
          {message.type === 'plugin' && renderPluginContent()}
        </div>
        <span className="text-xs text-gray-400 mt-1 px-2">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage; 