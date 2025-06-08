"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiCpu, 
  FiActivity, 
  FiClock, 
  FiZap, 
  FiServer, 
  FiDatabase,
  FiTrendingUp,
  FiAlertTriangle
} from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

interface PerformanceMetrics {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  activeConnections: number;
  throughput: number;
  errorRate: number;
}

interface AIModelMetrics {
  modelName: string;
  status: 'active' | 'idle' | 'error';
  requestCount: number;
  avgResponseTime: number;
  successRate: number;
  lastUsed: string;
}

export default function PerformanceMonitorPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [aiModels, setAiModels] = useState<AIModelMetrics[]>([
    {
      modelName: 'GPT-4o',
      status: 'active',
      requestCount: 245,
      avgResponseTime: 1200,
      successRate: 98.5,
      lastUsed: new Date().toISOString()
    },
    {
      modelName: 'Google Imagen 3',
      status: 'idle',
      requestCount: 89,
      avgResponseTime: 3500,
      successRate: 97.2,
      lastUsed: new Date(Date.now() - 3600000).toISOString()
    },
    {
      modelName: 'Minimax Video',
      status: 'active',
      requestCount: 12,
      avgResponseTime: 15000,
      successRate: 94.8,
      lastUsed: new Date(Date.now() - 1800000).toISOString()
    },
    {
      modelName: 'Nvidia Sana',
      status: 'idle',
      requestCount: 156,
      avgResponseTime: 2800,
      successRate: 99.1,
      lastUsed: new Date(Date.now() - 7200000).toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock performance data
  const generateMockMetrics = (): PerformanceMetrics => {
    return {
      timestamp: new Date().toISOString(),
      cpuUsage: Math.random() * 80 + 10,
      memoryUsage: Math.random() * 70 + 20,
      responseTime: Math.random() * 500 + 100,
      activeConnections: Math.floor(Math.random() * 50) + 10,
      throughput: Math.random() * 1000 + 200,
      errorRate: Math.random() * 2
    };
  };

  // Initialize with some sample data
  useEffect(() => {
    const initialMetrics = Array.from({ length: 10 }, () => generateMockMetrics());
    setMetrics(initialMetrics);
  }, []);

  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMetric = generateMockMetrics();
      setMetrics(prev => [...prev.slice(-9), newMetric]);
      
      // Update AI model metrics
      setAiModels(prev => prev.map(model => ({
        ...model,
        requestCount: model.requestCount + Math.floor(Math.random() * 5),
        avgResponseTime: model.avgResponseTime + (Math.random() - 0.5) * 200,
        successRate: Math.max(95, Math.min(100, model.successRate + (Math.random() - 0.5) * 2))
      })));
      
      toast.success('Performance metrics updated');
    } catch (error) {
      toast.error('Failed to refresh metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const currentMetrics = metrics[metrics.length - 1];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Performance Monitor</h1>
          <p className="text-gray-600 mt-2">
            Monitor AI model performance, system resources, and response times
          </p>
        </div>
        <Button 
          onClick={refreshMetrics}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          {isLoading ? (
            <>
              <FiActivity className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <FiActivity className="mr-2 h-4 w-4" />
              Refresh Metrics
            </>
          )}
        </Button>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <FiCpu className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMetrics ? `${currentMetrics.cpuUsage.toFixed(1)}%` : '0%'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentMetrics?.cpuUsage > 70 ? 'High usage' : 'Normal'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <FiDatabase className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMetrics ? `${currentMetrics.memoryUsage.toFixed(1)}%` : '0%'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentMetrics?.memoryUsage > 80 ? 'High usage' : 'Normal'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <FiClock className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMetrics ? formatDuration(currentMetrics.responseTime) : '0ms'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Average response
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <FiServer className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentMetrics ? currentMetrics.activeConnections : 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Concurrent users
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Model Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiZap className="h-5 w-5" />
            AI Model Performance
          </CardTitle>
          <CardDescription>
            Performance metrics for AI models used in content generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiModels.map((model, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{model.modelName}</h3>
                    <div className="text-sm text-gray-500">
                      Last used: {new Date(model.lastUsed).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(model.status)}>
                    {model.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{model.requestCount}</div>
                    <div className="text-gray-500">Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatDuration(model.avgResponseTime)}</div>
                    <div className="text-gray-500">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{model.successRate.toFixed(1)}%</div>
                    <div className="text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiTrendingUp className="h-5 w-5" />
            Performance Trends
          </CardTitle>
          <CardDescription>
            System performance over the last monitoring period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Throughput</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentMetrics ? `${currentMetrics.throughput.toFixed(0)} req/min` : '0 req/min'}
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiActivity className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <div className="text-2xl font-bold text-green-600">99.9%</div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Error Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {currentMetrics ? `${currentMetrics.errorRate.toFixed(2)}%` : '0%'}
                </div>
              </div>
            </div>
            
            {/* Simple metrics visualization */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Recent Performance Data</h4>
              <div className="grid grid-cols-5 gap-2">
                {metrics.slice(-10).map((metric, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-sm font-medium">
                      {formatDuration(metric.responseTime)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
