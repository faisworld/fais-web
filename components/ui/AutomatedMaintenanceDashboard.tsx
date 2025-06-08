"use client"

import React, { useState } from 'react'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Play, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface CronJobStatus {
  name: string
  endpoint: string
  lastRun?: string
  status: 'idle' | 'running' | 'success' | 'failed'
  duration?: number
  message?: string
  data?: Record<string, unknown>
}

interface OrchestrationResult {
  timestamp: string
  totalDuration: number
  jobsRun: number
  jobsSuccessful: number
  jobsFailed: number
  results: Array<{
    jobName: string
    success: boolean
    duration: number
    message: string
  }>
}

export default function AutomatedMaintenanceDashboard() {
  const [cronJobs, setCronJobs] = useState<CronJobStatus[]>([
    {
      name: 'AI Blog Generation',
      endpoint: '/api/cron/generate-ai-news-article',
      status: 'idle'
    },
    {
      name: 'Codex Website Analysis',
      endpoint: '/api/cron/codex-website-analysis',
      status: 'idle'
    },
    {
      name: 'SEO Optimization',
      endpoint: '/api/cron/seo-optimization',
      status: 'idle'
    },
    {
      name: 'Knowledge Base Update',
      endpoint: '/api/cron/update-knowledge-base',
      status: 'idle'
    }
  ])

  const [orchestrationStatus, setOrchestrationStatus] = useState<{
    status: 'idle' | 'running' | 'completed' | 'failed'
    result?: OrchestrationResult
  }>({ status: 'idle' })

  const [isRunningOrchestration, setIsRunningOrchestration] = useState(false)
  const [lastOrchestrationRun, setLastOrchestrationRun] = useState<string | null>(null)

  const runSingleJob = async (job: CronJobStatus, index: number) => {
    // Update job status to running
    setCronJobs(prev => prev.map((j, i) => 
      i === index ? { ...j, status: 'running' } : j
    ))

    try {
      const response = await fetch(job.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setCronJobs(prev => prev.map((j, i) => 
          i === index ? {
            ...j,
            status: 'success',
            lastRun: new Date().toISOString(),
            message: data.message,
            data: data.summary || data
          } : j
        ))
        toast.success(`${job.name} completed successfully`)
      } else {
        throw new Error(data.message || 'Job failed')
      }
    } catch (error) {
      setCronJobs(prev => prev.map((j, i) => 
        i === index ? {
          ...j,
          status: 'failed',
          lastRun: new Date().toISOString(),
          message: error instanceof Error ? error.message : 'Unknown error'
        } : j
      ))
      toast.error(`${job.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const runOrchestration = async () => {
    setIsRunningOrchestration(true)
    setOrchestrationStatus({ status: 'running' })

    try {
      const response = await fetch('/api/cron/orchestrate-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setOrchestrationStatus({
          status: 'completed',
          result: data.orchestrationResult
        })
        setLastOrchestrationRun(new Date().toISOString())
        toast.success(`Orchestration completed: ${data.summary.jobsCompleted} jobs`)
      } else {
        throw new Error(data.details || 'Orchestration failed')
      }
    } catch (error) {
      setOrchestrationStatus({ status: 'failed' })
      toast.error(`Orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRunningOrchestration(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>
      case 'failed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="outline">Idle</Badge>
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automated Website Maintenance</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive AI-powered website analysis, SEO optimization, and knowledge base management
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runOrchestration}
            disabled={isRunningOrchestration}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isRunningOrchestration ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Full Orchestration
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Orchestration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Orchestration Status
          </CardTitle>
          <CardDescription>
            Sequential execution of all maintenance jobs with intelligent error handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(orchestrationStatus.status)}
              <span className="font-medium">
                Status: {orchestrationStatus.status.charAt(0).toUpperCase() + orchestrationStatus.status.slice(1)}
              </span>
            </div>
            {lastOrchestrationRun && (
              <div className="text-sm text-gray-500">
                Last run: {new Date(lastOrchestrationRun).toLocaleString()}
              </div>
            )}
          </div>

          {orchestrationStatus.result && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {orchestrationStatus.result.jobsRun}
                </div>
                <div className="text-sm text-gray-600">Jobs Run</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {orchestrationStatus.result.jobsSuccessful}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {orchestrationStatus.result.jobsFailed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatDuration(orchestrationStatus.result.totalDuration)}
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cronJobs.map((job, index) => (
          <Card key={job.name}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {job.name === 'AI Blog Generation' && 'Automated blog post creation with AI themes'}
                    {job.name === 'Codex Website Analysis' && 'Comprehensive code analysis and issue detection'}
                    {job.name === 'SEO Optimization' && 'Advanced SEO recommendations and optimizations'}
                    {job.name === 'Knowledge Base Update' && 'RAG pipeline updates for ElevenLabs assistant'}
                  </CardDescription>
                </div>
                {getStatusBadge(job.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {job.lastRun && (
                  <div className="text-sm text-gray-500">
                    Last run: {new Date(job.lastRun).toLocaleString()}
                  </div>
                )}
                
                {job.message && (
                  <div className={`text-sm p-2 rounded ${
                    job.status === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : job.status === 'failed'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {job.message}
                  </div>
                )}

                {job.data && (
                  <div className="text-xs bg-gray-50 p-2 rounded border">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(job.data, null, 2)}
                    </pre>
                  </div>
                )}

                <Button
                  onClick={() => runSingleJob(job, index)}
                  disabled={job.status === 'running' || isRunningOrchestration}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {job.status === 'running' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Job
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system status and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>ElevenLabs Widget:</strong>
              <div className="text-gray-600">Updated to v3 with enhanced features</div>
            </div>
            <div>
              <strong>OpenAI Integration:</strong>
              <div className="text-gray-600">GPT-4 for analysis and content generation</div>
            </div>
            <div>
              <strong>Website Analysis:</strong>
              <div className="text-gray-600">Puppeteer-powered crawling and analysis</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
