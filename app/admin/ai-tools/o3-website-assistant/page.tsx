'use client';

import { useState } from 'react';
import { Loader2, Send, Check, AlertTriangle, Globe, Search, Wrench } from 'lucide-react';

interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'analysis' | 'fix' | 'recommendation';
}

interface WebsiteIssue {
  type: 'spacing' | 'seo' | 'performance' | 'accessibility' | 'content';
  severity: 'low' | 'medium' | 'high' | 'critical';
  page: string;
  description: string;
  solution: string;
  canAutoFix: boolean;
}

export default function O3WebsiteAssistantPage() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your O3-powered website assistant. I can crawl your website, analyze issues, and provide fixes for problems like spacing, SEO, performance, and content quality. What would you like me to help with?',
      timestamp: new Date(),
      type: 'recommendation'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [foundIssues, setFoundIssues] = useState<WebsiteIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const quickCommands = [
    {
      icon: <Search className="h-4 w-4" />,
      label: 'Analyze Blog Spacing',
      command: 'Check all blog articles for spacing issues between title and content'
    },
    {
      icon: <Globe className="h-4 w-4" />,
      label: 'SEO Analysis',
      command: 'Perform comprehensive SEO analysis of the website'
    },
    {
      icon: <Wrench className="h-4 w-4" />,
      label: 'Fix Found Issues',
      command: 'Apply automatic fixes to all detected issues'
    }
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/admin/ai-tools/o3-website-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversation: messages
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get assistant response');
      }

      const data = await response.json();

      const assistantMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
        type: data.type || 'analysis'
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If issues were found, update the issues list
      if (data.issues) {
        setFoundIssues(data.issues);
      }

    } catch (error) {
      const errorMessage: AssistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date(),
        type: 'analysis'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickCommand = (command: string) => {
    setInput(command);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const runFullSiteAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/admin/ai-tools/o3-website-assistant/analyze', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const data = await response.json();
      
      const analysisMessage: AssistantMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.summary,
        timestamp: new Date(),
        type: 'analysis'
      };

      setMessages(prev => [...prev, analysisMessage]);
      setFoundIssues(data.issues || []);

    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'spacing': return '📏';
      case 'seo': return '🔍';
      case 'performance': return '⚡';
      case 'accessibility': return '♿';
      case 'content': return '📝';
      default: return '🔧';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">O3 Website Assistant</h1>
        <p className="text-gray-600">AI-powered website analysis and auto-fixing assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">Assistant Chat</h2>
              <div className="flex gap-2">
                <button
                  onClick={runFullSiteAnalysis}
                  disabled={isAnalyzing}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Full Analysis'}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'analysis'
                        ? 'bg-green-50 text-green-900 border border-green-200'
                        : message.type === 'fix'
                        ? 'bg-orange-50 text-orange-900 border border-orange-200'
                        : 'bg-gray-50 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Commands */}
            <div className="p-3 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Quick commands:</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {quickCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickCommand(cmd.command)}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition"
                  >
                    {cmd.icon}
                    {cmd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me to analyze your website, fix issues, or check specific problems..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isProcessing || !input.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Panel */}
        <div className="space-y-6">
          {/* Found Issues */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Detected Issues ({foundIssues.length})
            </h3>
            
            {foundIssues.length === 0 ? (
              <p className="text-gray-500 text-sm">No issues detected yet. Run an analysis to find problems.</p>
            ) : (
              <div className="space-y-3">
                {foundIssues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{getTypeIcon(issue.type)}</span>
                        <span className="font-medium text-sm">{issue.type}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    <div className="text-sm mb-1 font-medium">{issue.page}</div>
                    <div className="text-sm mb-2">{issue.description}</div>
                    <div className="text-xs text-gray-600 mb-2">{issue.solution}</div>
                    {issue.canAutoFix && (
                      <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">
                        Auto-fix
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assistant Capabilities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">What I Can Do</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Crawl and analyze your website</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Detect spacing & layout issues</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>SEO analysis & recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Performance optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Auto-fix common problems</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Content quality analysis</span>
              </div>
            </div>
          </div>

          {/* Example Commands */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-sm">Example Commands</h4>            <div className="space-y-1 text-xs text-gray-600">
              <div>&ldquo;Check spacing issues in blog articles&rdquo;</div>
              <div>&ldquo;Analyze SEO performance&rdquo;</div>
              <div>&ldquo;Fix all detected spacing problems&rdquo;</div>
              <div>&ldquo;Check mobile responsiveness&rdquo;</div>
              <div>&ldquo;Optimize page load speed&rdquo;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
