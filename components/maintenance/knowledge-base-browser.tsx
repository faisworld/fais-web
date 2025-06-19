'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Button from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search,   Database, 
  FileText, 
  ExternalLink,
  Download,
  RefreshCw,
  Filter,
  Hash
} from "lucide-react"

interface KnowledgeChunk {
  id: string
  url: string
  title: string
  content: string
  chunk_index: number
  token_count: number
  similarity_score?: number
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

interface KnowledgeStats {
  totalChunks: number
  totalUrls: number
  averageTokenCount: number
  lastUpdated: string
}

export default function KnowledgeBaseBrowser() {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([])
  const [stats, setStats] = useState<KnowledgeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string>('')
  const [urls, setUrls] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadKnowledgeBase = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/rag-query/knowledge-base?${params}`)
      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setChunks(data.chunks || [])
          setUrls(data.urls || [])
        } else {
          setChunks(prev => [...prev, ...(data.chunks || [])])
        }
        setHasMore(data.hasMore || false)
      }    } catch (error) {
      console.error('Error loading knowledge base:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/rag-query/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }
  const searchKnowledgeBase = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        query: searchQuery,
        url: selectedUrl,
        page: page.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/rag-query/search?${params}`)
      const data = await response.json()

      if (data.success) {
        if (page === 1) {
          setChunks(data.chunks || [])
        } else {
          setChunks(prev => [...prev, ...(data.chunks || [])])
        }
        setHasMore(data.hasMore || false)
      }
    } catch (error) {
      console.error('Error searching knowledge base:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedUrl, page])

  const exportKnowledgeBase = async (format: 'json' | 'xml') => {
    try {
      const response = await fetch(`/api/maintenance/export/knowledge-base?format=${format}&limit=1000`)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting knowledge base:', error)
    }
  }

  useEffect(() => {
    loadKnowledgeBase()
    loadStats()
  }, [loadKnowledgeBase])

  useEffect(() => {
    if (searchQuery || selectedUrl) {
      searchKnowledgeBase()
    } else {
      loadKnowledgeBase()
    }
  }, [searchQuery, selectedUrl, page, searchKnowledgeBase, loadKnowledgeBase])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedUrl('')
    setPage(1)
  }

  const formatTokenCount = (count: number) => {
    if (count > 1000) return `${(count / 1000).toFixed(1)}k`
    return count.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="space-y-6">
      {/* Knowledge Base Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Chunks</p>
                <p className="text-2xl font-bold">{stats?.totalChunks || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">URLs Indexed</p>
                <p className="text-2xl font-bold">{stats?.totalUrls || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Hash className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg. Tokens</p>
                <p className="text-2xl font-bold">{formatTokenCount(stats?.averageTokenCount || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm font-bold">{stats?.lastUpdated ? formatDate(stats.lastUpdated) : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Knowledge Base Browser
          </CardTitle>
          <CardDescription>
            Browse and search your RAG knowledge base chunks and vectors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search knowledge base content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All URLs</option>
                {urls.map((url) => (
                  <option key={url} value={url}>{url}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button onClick={() => exportKnowledgeBase('json')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button onClick={() => exportKnowledgeBase('xml')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export XML
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Chunks */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Chunks</CardTitle>
          <CardDescription>
            {chunks.length} chunks loaded {searchQuery || selectedUrl ? '(filtered)' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div key={chunk.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <a 
                        href={chunk.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        {chunk.title || chunk.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Badge variant="secondary">
                        Chunk {chunk.chunk_index}
                      </Badge>
                      <Badge variant="outline">
                        {formatTokenCount(chunk.token_count)} tokens
                      </Badge>
                      {chunk.similarity_score && (
                        <Badge variant="default">
                          {Math.round(chunk.similarity_score * 100)}% match
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {truncateContent(chunk.content)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Updated: {formatDate(chunk.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-gray-500">Loading knowledge base...</p>
              </div>
            )}

            {!isLoading && chunks.length === 0 && (
              <div className="text-center py-8">
                <Database className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No knowledge chunks found</p>
                {(searchQuery || selectedUrl) && (
                  <Button onClick={clearFilters} variant="outline" className="mt-2">
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {hasMore && !isLoading && (
              <div className="text-center py-4">
                <Button 
                  onClick={() => setPage(p => p + 1)} 
                  variant="outline"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
