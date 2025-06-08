"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiTrendingUp, 
  FiGlobe, 
  FiSettings, 
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiPlay,
  FiBarChart2,
  FiAlertTriangle
} from 'react-icons/fi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

interface OrchestrationLog {
  id: number;
  status: 'running' | 'completed' | 'failed';
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  total_jobs: number;
  completed_jobs: number;
  failed_jobs: number;  error_message?: string;
}

interface SEOAnalysis {
  id: number;
  url: string;
  current_title: string;
  recommended_title: string;
  current_description?: string;
  recommended_description?: string;
  score: number;
  created_at: string;
  job_name: string;
  orchestration_id: number;
}

interface WebsiteAnalysis {
  id: number;
  url: string;
  analysis_type: string;
  score: number;
  issues: Array<Record<string, unknown>>;
  recommendations: Array<Record<string, unknown>>;
  created_at: string;
  job_name: string;
  orchestration_id: number;
}

interface DashboardStats {
  totalOrchestrations: number;
  runningJobs: number;
  completedJobs24h: number;
  failedJobs24h: number;
  avgJobDuration: number;
}

export default function SEOManagementPage() {  const [activeTab, setActiveTab] = useState<'overview' | 'orchestrations' | 'seo-analysis' | 'website-analysis'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orchestrations, setOrchestrations] = useState<OrchestrationLog[]>([]);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis[]>([]);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<WebsiteAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/seo-management?type=${type}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch data');
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch ${type}:`, error);
      toast.error(`Failed to fetch ${type}`);
      return [];
    }
  };

  const loadAllData = async () => {
    setRefreshing(true);    try {
      const [statsData, orchestrationsData, seoData, websiteData] = await Promise.all([
        fetchData('dashboard-stats'),
        fetchData('orchestrations'),
        fetchData('seo-analysis'),
        fetchData('website-analysis')
      ]);

      setStats(statsData);
      setOrchestrations(orchestrationsData);
      setSeoAnalysis(seoData);
      setWebsiteAnalysis(websiteData);
    } finally {
      setRefreshing(false);
    }
  };

  const triggerMaintenance = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/seo-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger-maintenance' })
      });      if (!response.ok) throw new Error('Failed to trigger maintenance');
      
      await response.json();
      toast.success('Maintenance orchestration triggered successfully');
      
      // Refresh data after a short delay
      setTimeout(loadAllData, 2000);
    } catch (error) {
      console.error('Failed to trigger maintenance:', error);
      toast.error('Failed to trigger maintenance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      'completed': 'default',
      'running': 'secondary',
      'failed': 'destructive',
      'pending': 'outline'
    };
    
    const icons: Record<string, React.ReactNode> = {
      'completed': <FiCheckCircle className="w-3 h-3" />,
      'running': <FiClock className="w-3 h-3" />,
      'failed': <FiXCircle className="w-3 h-3" />,
      'pending': <FiClock className="w-3 h-3" />
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    return `${Math.round(seconds)}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage automated SEO optimization tasks</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={loadAllData}
            disabled={refreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={triggerMaintenance}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FiPlay className="w-4 h-4" />
            {loading ? 'Triggering...' : 'Run Maintenance'}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: FiBarChart2 },
            { id: 'orchestrations', label: 'Orchestrations', icon: FiSettings },
            { id: 'seo-analysis', label: 'SEO Analysis', icon: FiSearch },
            { id: 'website-analysis', label: 'Website Analysis', icon: FiGlobe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orchestrations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalOrchestrations || 0}</p>
                  </div>
                  <FiSettings className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Running Jobs</p>
                    <p className="text-2xl font-bold text-orange-600">{stats?.runningJobs || 0}</p>
                  </div>
                  <FiClock className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed (24h)</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.completedJobs24h || 0}</p>
                  </div>
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed (24h)</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.failedJobs24h || 0}</p>
                  </div>
                  <FiXCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-2xl font-bold text-gray-900">{formatDuration(stats?.avgJobDuration)}</p>
                  </div>
                  <FiTrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiSearch className="w-5 h-5" />
                  Recent SEO Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoAnalysis.slice(0, 3).map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{analysis.url}</p>
                        <p className="text-xs text-gray-600">{formatDate(analysis.created_at)}</p>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </div>
                    </div>
                  ))}
                  {seoAnalysis.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No SEO analysis data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiGlobe className="w-5 h-5" />
                  Recent Website Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {websiteAnalysis.slice(0, 3).map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{analysis.url}</p>
                        <p className="text-xs text-gray-600">
                          {analysis.analysis_type} • {formatDate(analysis.created_at)}
                        </p>
                      </div>
                      <div className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                      </div>
                    </div>
                  ))}
                  {websiteAnalysis.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No website analysis data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Orchestrations Tab */}
      {activeTab === 'orchestrations' && (
        <Card>
          <CardHeader>
            <CardTitle>Orchestration Logs</CardTitle>
            <CardDescription>View maintenance orchestration execution history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orchestrations.map((orchestration) => (
                <div key={orchestration.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">Orchestration #{orchestration.id}</h3>
                      {getStatusBadge(orchestration.status)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(orchestration.start_time)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Jobs:</span>
                      <span className="ml-2 font-medium">{orchestration.total_jobs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <span className="ml-2 font-medium text-green-600">{orchestration.completed_jobs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>
                      <span className="ml-2 font-medium text-red-600">{orchestration.failed_jobs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{formatDuration(orchestration.duration_seconds)}</span>
                    </div>
                  </div>

                  {orchestration.error_message && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      <strong>Error:</strong> {orchestration.error_message}
                    </div>
                  )}
                </div>
              ))}
              {orchestrations.length === 0 && (
                <p className="text-gray-500 text-center py-8">No orchestration logs available</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Analysis Tab */}
      {activeTab === 'seo-analysis' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiSearch className="w-5 h-5" />
              SEO Analysis Results
            </CardTitle>
            <CardDescription>Review SEO optimization recommendations and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seoAnalysis.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{analysis.url}</h3>
                      <div className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
                        Score: {analysis.score}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(analysis.created_at)}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-1">Title Optimization</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-red-600">Current:</span>
                          <span className="ml-2">{analysis.current_title}</span>
                        </div>
                        <div>
                          <span className="text-green-600">Recommended:</span>
                          <span className="ml-2">{analysis.recommended_title}</span>
                        </div>
                      </div>
                    </div>

                    {analysis.current_description && analysis.recommended_description && (
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Description Optimization</h4>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-red-600">Current:</span>
                            <span className="ml-2">{analysis.current_description}</span>
                          </div>
                          <div>
                            <span className="text-green-600">Recommended:</span>
                            <span className="ml-2">{analysis.recommended_description}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {seoAnalysis.length === 0 && (
                <p className="text-gray-500 text-center py-8">No SEO analysis data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Website Analysis Tab */}
      {activeTab === 'website-analysis' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiGlobe className="w-5 h-5" />
              Website Analysis Results
            </CardTitle>
            <CardDescription>Review website performance and technical analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {websiteAnalysis.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{analysis.url}</h3>
                      <Badge variant="outline">{analysis.analysis_type}</Badge>
                      <div className={`text-lg font-bold ${getScoreColor(analysis.score)}`}>
                        Score: {analysis.score}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(analysis.created_at)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <FiAlertTriangle className="w-4 h-4" />
                        Issues Found
                      </h4>
                      <div className="space-y-1">
                        {analysis.issues.slice(0, 3).map((issue: Record<string, unknown>, index) => (
                          <div key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                            {String(issue.message) || JSON.stringify(issue)}
                          </div>
                        ))}
                        {analysis.issues.length === 0 && (
                          <p className="text-sm text-gray-500">No issues found</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <FiTrendingUp className="w-4 h-4" />
                        Recommendations
                      </h4>
                      <div className="space-y-1">
                        {analysis.recommendations.slice(0, 3).map((rec: Record<string, unknown>, index) => (
                          <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            {String(rec.action) || JSON.stringify(rec)}
                          </div>
                        ))}
                        {analysis.recommendations.length === 0 && (
                          <p className="text-sm text-gray-500">No recommendations available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {websiteAnalysis.length === 0 && (
                <p className="text-gray-500 text-center py-8">No website analysis data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
