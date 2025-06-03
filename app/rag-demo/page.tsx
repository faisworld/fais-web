// filepath: c:\Users\solar\Projects\fais-web\app\rag-demo\page.tsx
'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';

export default function RAGDemo() {
  const [isTyping, setIsTyping] = useState(false);
  const [filterBlogOnly, setFilterBlogOnly] = useState(false);
  const [topK, setTopK] = useState(3);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/rag-query', // Our custom RAG endpoint
    body: {
      filterBlogOnly,
      topK
    },
    onResponse: () => {
      setIsTyping(true);
    },
    onFinish: () => {
      setIsTyping(false);
    },
  });

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">O3 Assistant (RAG-Enhanced)</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Ask questions about Fantastic AI Studio and our services. This version uses RAG (Retrieval Augmented Generation) to provide more accurate answers.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">          <div className="flex items-center gap-2">
            <label htmlFor="rag-topk-select" className="text-sm font-medium whitespace-nowrap">
              Results to retrieve:
            </label>
            <select 
              id="rag-topk-select"
              name="ragTopK"
              value={topK} 
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-sm"
            >
              {[1, 2, 3, 4, 5, 7, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
            <div className="flex items-center gap-2">
            <label htmlFor="rag-blog-filter" className="text-sm font-medium">
              <input
                type="checkbox"
                id="rag-blog-filter"
                name="ragBlogFilter"
                checked={filterBlogOnly}
                onChange={(e) => setFilterBlogOnly(e.target.checked)}
                className="mr-2"
              />
              Blog posts only
            </label>
          </div>
          
          <button 
            onClick={clearChat}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-auto"
          >
            Clear Chat
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto mb-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Ask a question to get started!</p>
            <div className="mt-4 text-sm">
              <p className="font-medium mb-2">Example questions:</p>
              <ul className="space-y-1">                <li className="hover:text-gray-800 cursor-pointer" onClick={() => handleInputChange({ target: { value: "What services does FAIS offer?" } } as React.ChangeEvent<HTMLInputElement>)}>
                  • What services does FAIS offer?
                </li>
                <li className="hover:text-gray-800 cursor-pointer" onClick={() => handleInputChange({ target: { value: "Tell me about the latest blockchain trends" } } as React.ChangeEvent<HTMLInputElement>)}>
                  • Tell me about the latest blockchain trends
                </li>
                <li className="hover:text-gray-800 cursor-pointer" onClick={() => handleInputChange({ target: { value: "How can AI help my business?" } } as React.ChangeEvent<HTMLInputElement>)}>
                  • How can AI help my business?
                </li>
              </ul>
            </div>
          </div>
        ) : (
          messages.map((message, i) => (
            <div
              key={i}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div className="inline-block max-w-[85%]">
                <div className="font-medium text-xs mb-1 opacity-70">
                  {message.role === 'user' ? 'You' : 'O3 Assistant'}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && !isTyping && (
          <div className="text-center py-4">
            <div className="inline-block p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          id="rag-chat-input"
          name="ragChatMessage"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question about FAIS..."
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Thinking...</span>
            </>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </div>
  );
}
