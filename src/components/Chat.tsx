import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconRobot, IconUser, IconBrandOpenai } from '@tabler/icons-react';
import ChatMessage from './ChatMessage';
import useChatStore from '../store/chatStore';
import { findPlugin } from '../plugins';

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    addMessage({
      sender: 'user',
      content: userMessage,
      type: 'text',
    });

    try {
      const pluginMatch = findPlugin(userMessage);

      if (pluginMatch) {
        const { plugin, args } = pluginMatch;
        
        addMessage({
          sender: 'assistant',
          content: '...',
          type: 'text',
        });

        const result = await plugin.execute(args);
        const response = plugin.renderResponse(result);

        addMessage({
          sender: 'assistant',
          content: '',
          type: 'plugin',
          pluginName: plugin.name,
          pluginData: response,
        });
      } else {
        addMessage({
          sender: 'assistant',
          content: "👋 Hi! I'm your AI assistant. Try these commands:\n\n🌤️ Weather:\n- /weather [city]\n- \"What's the weather in Paris?\"\n\n🧮 Calculator:\n- /calc [expression]\n- \"Calculate 15 * 24\"\n\n📚 Dictionary:\n- /define [word]\n- \"Define serendipity\"",
          type: 'text',
        });
      }
    } catch (error) {
      addMessage({
        sender: 'assistant',
        content: error instanceof Error ? error.message : '❌ Something went wrong',
        type: 'text',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="chat-container flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                  <IconRobot className="text-blue-400 float" size={32} />
                  Chat Assistant
                </h1>
                <p className="text-gray-300 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Interactive command system with natural language support ✨
                </p>
              </div>
              {/* Decorative elements */}
              <div className="hidden sm:flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-black/20 via-black/10 to-black/20 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-white/90 font-medium glass-card p-4">
                <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse"></div>
                Processing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-6 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative group">
                {/* Command suggestions */}
                <div className="absolute -top-12 left-0 right-0 flex gap-2 overflow-x-auto pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {['/weather', '/calc', '/define'].map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => setInput(cmd + ' ')}
                      className="px-3 py-1 glass-card hover-glow whitespace-nowrap text-sm text-white/70 hover:text-white/90"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
                
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message or use commands like /weather, /calc, /define ✨"
                  className="w-full px-6 py-4 rounded-2xl bg-black/20 text-white/90 font-medium placeholder-gray-400 
                    border-2 border-white/10 backdrop-blur-sm input-focus
                    hover:bg-black/30 hover:border-white/20
                    transition-all duration-300 ease-out"
                  disabled={isLoading}
                />
                
                {/* Input effects */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 
                  opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                    bg-gradient-to-r from-transparent via-white/10 to-transparent
                    -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`relative group overflow-hidden min-w-[120px] h-[60px] rounded-2xl glass-card hover-glow
                  ${isLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer transform hover:scale-105 active:scale-95'
                  }
                  transition-all duration-300 ease-out`}
              >
                {/* Button effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 
                  group-hover:animate-gradient-shift" />
                
                <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300
                  bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.3),transparent_50%)]
                  blur-md" />
                
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-2 text-white font-medium px-6">
                  <IconSend 
                    size={20} 
                    className="group-hover:rotate-12 group-hover:translate-x-1 transition-all duration-300" 
                  />
                  <span className="hidden sm:block group-hover:translate-x-1 transition-transform duration-300">
                    Send
                  </span>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  -translate-x-full group-hover:translate-x-full transform
                  duration-1000 ease-in-out" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;