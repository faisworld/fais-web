'use client'

import React, { useState, useEffect } from 'react'
import Button from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SEOAnalysisDetail from '@/components/maintenance/seo-analysis-detail'
import KnowledgeBaseBrowser from '@/components/maintenance/knowledge-base-browser'
import { 
  Play, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Activity,
  Settings,
  Database,
  Globe,
  Search,
  BookOpen,
  BarChart3
} from "lucide-react"
import { toast } from 'react-hot-toast'

// Interface definitions
interface OrchestrationLog {
  id: number
  status: 'running' | 'completed' | 'failed'
  start_time: string
  end_time?: string
  duration_seconds?: number
  total_jobs: number
  completed_jobs: number
  failed_jobs: number
  error_message?: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

interface JobExecution {
  id: number
  orchestration_id: number
  job_name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  start_time: string
  end_time?: string
  duration_seconds?: number
  error_message?: string
  result_data: Record<string, unknown>
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

interface DashboardStats {
  totalOrchestrations: number
  runningJobs: number
  completedJobs24h: number
  failedJobs24h: number
  avgJobDuration: number
}

const JOB_ICONS = {
  'automated-article-generation': BookOpen,
  'website-crawling-analysis': Globe,
  'update-knowledge-base': Database,
  'seo-optimization': Search
}

const JOB_DESCRIPTIONS = {
  'automated-article-generation': 'Generate new articles using AI',
  'website-crawling-analysis': 'Crawl and analyze website content',
  'update-knowledge-base': 'Update RAG knowledge base with new content',
  'seo-optimization': 'Optimize content for search engines'
}

export default function MaintenanceDashboard() {
  // State management
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [orchestrationLogs, setOrchestrationLogs] = useState<OrchestrationLog[]>([])
  const [jobExecutions, setJobExecutions] = useState<JobExecution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [isRunningOrchestration, setIsRunningOrchestration] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [selectedSEOAnalysis, setSelectedSEOAnalysis] = useState<number | null>(null)
  const [seoAnalyses, setSeoAnalyses] = useState<Array<{ id: number; url: string; score: number; created_at: string }>>([])
  const [showSEODetail, setShowSEODetail] = useState(false)
  // Auto-refresh functionality
  useEffect(() => {
    loadDashboardData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval)
    }
  }, [refreshInterval])
  const loadDashboardData = async () => {
    try {
      const [statsResponse, orchestrationsResponse, jobsResponse, seoResponse] = await Promise.all([
        fetch('/api/maintenance/dashboard'),
        fetch('/api/maintenance/orchestrate'),
        fetch('/api/maintenance/run-job'),
        fetch('/api/maintenance/dashboard?include=seo')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setDashboardStats(statsData.stats)
      }

      if (orchestrationsResponse.ok) {
        const orchestrationsData = await orchestrationsResponse.json()
        setOrchestrationLogs(orchestrationsData.orchestrations || [])
      }

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json()
        setJobExecutions(jobsData.jobExecutions || [])
      }

      if (seoResponse.ok) {
        const seoData = await seoResponse.json()
        setSeoAnalyses(seoData.seoAnalyses || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const startOrchestration = async () => {
    setIsRunningOrchestration(true)
    
    try {
      const response = await fetch('/api/cron/orchestrate-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Orchestration started successfully!`)
        await loadDashboardData() // Refresh data
      } else {
        throw new Error(data.message || 'Failed to start orchestration')
      }
    } catch (error) {
      console.error('Error starting orchestration:', error)
      toast.error(`Failed to start orchestration: ${error instanceof Error ? error.message : 'Unknown error'}`)    } finally {
      setIsRunningOrchestration(false)
    }
  }

  const viewSEOAnalysis = (analysisId: number) => {
    setSelectedSEOAnalysis(analysisId)
    setShowSEODetail(true)
  }

  const closeSEODetail = () => {
    setSelectedSEOAnalysis(null)
    setShowSEODetail(false)
  }

  const runSingleJob = async (jobName: string) => {
    try {
      const response = await fetch('/api/maintenance/run-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobName })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`${jobName} started successfully!`)
        await loadDashboardData() // Refresh data
      } else {
        throw new Error(data.error || `Failed to run ${jobName}`)
      }
    } catch (error) {
      console.error(`Error running ${jobName}:`, error)
      toast.error(`Failed to run ${jobName}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      running: 'default',
      completed: 'default',
      failed: 'destructive',
      pending: 'secondary'
    } as const

    const colors = {
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} 
             className={colors[status as keyof typeof colors] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading maintenance dashboard...</p>
        </div>
      </div>
    )
  }

  const successRate = dashboardStats 
    ? Math.round((dashboardStats.completedJobs24h / (dashboardStats.completedJobs24h + dashboardStats.failedJobs24h)) * 100) || 0
    : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control automated maintenance jobs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadDashboardData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={startOrchestration}
            disabled={isRunningOrchestration}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isRunningOrchestration ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Full Orchestration
          </Button>
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orchestrations</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalOrchestrations}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running Jobs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.runningJobs}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed (24h)</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardStats.completedJobs24h}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed (24h)</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{dashboardStats.failedJobs24h}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate (24h)</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <Progress value={successRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orchestrations">Orchestrations</TabsTrigger>
          <TabsTrigger value="jobs">Job Executions</TabsTrigger>
          <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="controls">Manual Controls</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orchestrations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orchestrations</CardTitle>
                <CardDescription>Latest automated maintenance runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orchestrationLogs.slice(0, 5).map((orchestration) => (
                    <div key={orchestration.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(orchestration.status)}
                        <div>
                          <p className="font-medium">Orchestration #{orchestration.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(orchestration.start_time)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(orchestration.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          {orchestration.completed_jobs}/{orchestration.total_jobs} jobs
                        </p>
                      </div>
                    </div>
                  ))}
                  {orchestrationLogs.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No orchestrations found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Job Executions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Executions</CardTitle>
                <CardDescription>Latest individual job runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobExecutions.slice(0, 5).map((job) => {
                    const JobIcon = JOB_ICONS[job.job_name as keyof typeof JOB_ICONS] || Settings
                    return (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <JobIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{job.job_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(job.start_time)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(job.status)}
                          {job.duration_seconds && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDuration(job.duration_seconds)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {jobExecutions.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No job executions found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orchestrations Tab */}
        <TabsContent value="orchestrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orchestration History</CardTitle>
              <CardDescription>Complete history of automated maintenance orchestrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orchestrationLogs.map((orchestration) => (
                  <div key={orchestration.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(orchestration.status)}
                        <div>
                          <h4 className="font-semibold">Orchestration #{orchestration.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            Started: {formatDateTime(orchestration.start_time)}
                          </p>
                          {orchestration.end_time && (
                            <p className="text-sm text-muted-foreground">
                              Ended: {formatDateTime(orchestration.end_time)}
                            </p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(orchestration.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-sm font-medium">Total Jobs</p>
                        <p className="text-lg">{orchestration.total_jobs}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-lg text-green-600">{orchestration.completed_jobs}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Failed</p>
                        <p className="text-lg text-red-600">{orchestration.failed_jobs}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-lg">{formatDuration(orchestration.duration_seconds)}</p>
                      </div>
                    </div>
                    
                    {orchestration.error_message && (
                      <Alert className="mt-3">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{orchestration.error_message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
                {orchestrationLogs.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No orchestrations found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Execution History</CardTitle>
              <CardDescription>Detailed history of individual job executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobExecutions.map((job) => {
                  const JobIcon = JOB_ICONS[job.job_name as keyof typeof JOB_ICONS] || Settings
                  return (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <JobIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-semibold">{job.job_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {JOB_DESCRIPTIONS[job.job_name as keyof typeof JOB_DESCRIPTIONS] || 'Maintenance job'}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-medium">Job ID</p>
                          <p className="text-lg">#{job.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Orchestration</p>
                          <p className="text-lg">#{job.orchestration_id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Started</p>
                          <p className="text-lg">{formatDateTime(job.start_time)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-lg">{formatDuration(job.duration_seconds)}</p>
                        </div>
                      </div>
                      
                      {job.error_message && (
                        <Alert className="mt-3">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{job.error_message}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )
                })}
                {jobExecutions.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No job executions found</p>
                )}
              </div>
            </CardContent>
          </Card>        </TabsContent>

        {/* SEO Analysis Tab */}
        <TabsContent value="seo" className="space-y-4">
          {showSEODetail && selectedSEOAnalysis ? (
            <SEOAnalysisDetail 
              analysisId={selectedSEOAnalysis} 
              onClose={closeSEODetail}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>SEO Analysis Results</CardTitle>
                <CardDescription>View detailed SEO analysis and optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoAnalyses.length > 0 ? (
                    seoAnalyses.map((analysis) => (
                      <div key={analysis.id} className="p-4 border rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{analysis.url}</h4>
                          <p className="text-sm text-muted-foreground">
                            Score: {analysis.score}/100 • {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={analysis.score >= 80 ? 'default' : analysis.score >= 60 ? 'secondary' : 'destructive'}>
                            {analysis.score >= 80 ? 'Good' : analysis.score >= 60 ? 'Fair' : 'Needs Work'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewSEOAnalysis(analysis.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No SEO analyses found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Manual Controls Tab */}
        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Individual Job Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Run Individual Jobs</CardTitle>
                <CardDescription>Execute specific maintenance jobs manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(JOB_DESCRIPTIONS).map(([jobName, description]) => {
                  const JobIcon = JOB_ICONS[jobName as keyof typeof JOB_ICONS]
                  return (
                    <div key={jobName} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <JobIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{jobName}</p>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => runSingleJob(jobName)}
                        variant="outline"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run
                      </Button>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auto-refresh Status</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {dashboardStats && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Job Duration</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(Math.round(dashboardStats.avgJobDuration))}
                      </span>
                    </div>
                  )}
                </div>
                
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    Dashboard auto-refreshes every 30 seconds to provide real-time status updates.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>        </TabsContent>

        {/* Job Executions Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Job Executions</CardTitle>
              <CardDescription>Detailed view of all individual job executions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobExecutions.map((job) => {
                  const JobIcon = JOB_ICONS[job.job_name as keyof typeof JOB_ICONS] || Settings
                  return (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <JobIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{job.job_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {JOB_DESCRIPTIONS[job.job_name as keyof typeof JOB_DESCRIPTIONS] || 'No description available'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Started: {formatDateTime(job.start_time)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(job.status)}
                        {job.duration_seconds && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Duration: {formatDuration(job.duration_seconds)}
                          </p>
                        )}
                        {job.error_message && (
                          <p className="text-xs text-red-600 mt-1 max-w-xs truncate">
                            Error: {job.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
                {jobExecutions.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No job executions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Analysis Tab */}
        <TabsContent value="seo" className="space-y-4">
          {showSEODetail && selectedSEOAnalysis ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">SEO Analysis Details</h2>
                <Button onClick={closeSEODetail} variant="outline">
                  ← Back to SEO Overview
                </Button>
              </div>
              <SEOAnalysisDetail analysisId={selectedSEOAnalysis} />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>SEO Analysis Results</CardTitle>
                <CardDescription>Recent SEO optimization analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoAnalyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{analysis.url}</p>
                          <p className="text-sm text-muted-foreground">
                            Analyzed: {formatDateTime(analysis.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={analysis.score >= 80 ? "default" : analysis.score >= 60 ? "secondary" : "destructive"}>
                          Score: {analysis.score}/100
                        </Badge>
                        <Button
                          onClick={() => viewSEOAnalysis(analysis.id)}
                          variant="outline"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {seoAnalyses.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No SEO analyses found</p>                  )}
                </div>
              </CardContent>
            </Card>
          )}        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <KnowledgeBaseBrowser />
        </TabsContent>
      </Tabs>
    </div>
  )
}
