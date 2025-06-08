'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Button from '@/components/ui/Button'
import { Search, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface SEOAnalysisDetail {
  id: number
  job_execution_id: number
  url: string
  current_title: string
  current_description: string
  current_keywords: string[]
  recommended_title: string
  recommended_description: string
  recommended_keywords: string[]
  competitor_analysis: Record<string, unknown>
  keyword_gaps: Array<Record<string, unknown>>
  technical_issues: Array<Record<string, unknown>>
  schema_recommendations: Record<string, unknown>
  score: number
  created_at: string
}

interface SEOAnalysisDetailProps {
  analysisId?: number
  onClose?: () => void
}

export default function SEOAnalysisDetail({ analysisId, onClose }: SEOAnalysisDetailProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysisDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchAnalysisDetail = useCallback(async () => {
    if (!analysisId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/maintenance/seo-analysis/${analysisId}`)
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data)
      }
    } catch (error) {
      console.error('Error fetching SEO analysis:', error)
    } finally {
      setLoading(false)
    }
  }, [analysisId])

  useEffect(() => {
    if (analysisId) {
      fetchAnalysisDetail()
    }
  }, [analysisId, fetchAnalysisDetail])
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No SEO analysis data available. Please select an analysis to view details.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" />
            SEO Analysis Details
          </h2>
          <p className="text-sm text-gray-600">
            Analysis for {analysis.url} • {new Date(analysis.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getScoreBadgeVariant(analysis.score)} className="text-lg px-3 py-1">
            Score: {analysis.score}/100
          </Badge>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                SEO Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Current Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">SEO Score:</span>
                      <span className={`font-semibold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Technical Issues:</span>
                      <span className="font-semibold text-red-600">
                        {analysis.technical_issues?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Keyword Gaps:</span>
                      <span className="font-semibold text-yellow-600">
                        {analysis.keyword_gaps?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Optimization Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Meta tags optimization available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Keyword recommendations provided</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Schema markup suggestions ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Current Title</h4>
                  <p className="text-sm bg-red-50 p-3 rounded border">
                    {analysis.current_title || 'No title found'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Recommended Title</h4>
                  <p className="text-sm bg-green-50 p-3 rounded border">
                    {analysis.recommended_title}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Current Description</h4>
                  <p className="text-sm bg-red-50 p-3 rounded border">
                    {analysis.current_description || 'No description found'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Recommended Description</h4>
                  <p className="text-sm bg-green-50 p-3 rounded border">
                    {analysis.recommended_description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.current_keywords?.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    )) || <span className="text-sm text-gray-500">No keywords found</span>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommended Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.recommended_keywords?.map((keyword, idx) => (
                      <Badge key={idx} variant="default" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.keyword_gaps && analysis.keyword_gaps.length > 0 ? (
                <div className="space-y-4">
                  {analysis.keyword_gaps.map((gap, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Keyword Gap #{idx + 1}</h4>
                      <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
                        {JSON.stringify(gap, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specific content optimization recommendations available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Technical SEO Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.technical_issues && analysis.technical_issues.length > 0 ? (
                <div className="space-y-4">
                  {analysis.technical_issues.map((issue, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 text-red-600">Issue #{idx + 1}</h4>
                      <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
                        {JSON.stringify(issue, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No critical technical SEO issues detected.
                  </AlertDescription>
                </Alert>
              )}

              {analysis.schema_recommendations && Object.keys(analysis.schema_recommendations).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Schema Markup Recommendations</h4>
                  <pre className="text-sm bg-blue-50 p-3 rounded overflow-auto">
                    {JSON.stringify(analysis.schema_recommendations, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.competitor_analysis && Object.keys(analysis.competitor_analysis).length > 0 ? (
                <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto">
                  {JSON.stringify(analysis.competitor_analysis, null, 2)}
                </pre>
              ) : (
                <p className="text-gray-500">No competitor analysis data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
