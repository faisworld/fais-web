import { NextRequest, NextResponse } from 'next/server';
import { maintenanceDB } from '@/lib/maintenance-db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    switch (type) {
      case 'orchestrations':
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const orchestrations = await maintenanceDB.getOrchestrationLogs(limit);
        return NextResponse.json(orchestrations);

      case 'job-executions':
        const orchestrationId = url.searchParams.get('orchestrationId');
        const jobLimit = parseInt(url.searchParams.get('limit') || '20');
        const jobs = await maintenanceDB.getJobExecutions(
          orchestrationId ? parseInt(orchestrationId) : undefined,
          jobLimit
        );
        return NextResponse.json(jobs);

      case 'analysis-results':
        const analysisLimit = parseInt(url.searchParams.get('limit') || '10');
        const results = await maintenanceDB.getLatestAnalysisResults(analysisLimit);
        return NextResponse.json(results);

      case 'dashboard-stats':
        const stats = await maintenanceDB.getDashboardStats();
        return NextResponse.json(stats);      case 'seo-analysis':
        // Get recent SEO analysis results - using mock data for now
        const seoMockData = [
          {
            id: 1,
            url: 'https://fais.website',
            current_title: 'FAIS - AI Tools & Solutions',
            recommended_title: 'FAIS - Advanced AI Tools & Solutions for Modern Businesses',
            score: 85,
            created_at: new Date().toISOString(),
            job_name: 'seo-optimization',
            orchestration_id: 1
          }
        ];
        return NextResponse.json(seoMockData);

      case 'website-analysis':
        // Get recent website analysis results - using mock data for now
        const websiteMockData = [
          {
            id: 1,
            url: 'https://fais.website',
            analysis_type: 'performance',
            score: 92,
            issues: [{ type: 'minor', message: 'Image optimization needed' }],
            recommendations: [{ priority: 'medium', action: 'Compress images' }],
            created_at: new Date().toISOString(),
            job_name: 'website-crawling-analysis',
            orchestration_id: 1
          }
        ];
        return NextResponse.json(websiteMockData);

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('SEO Management API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SEO management data' },
      { status: 500 }
    );
  }
}

// Add manual trigger for maintenance orchestration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'trigger-maintenance') {
      // Trigger the maintenance orchestration
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/orchestrate-maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Maintenance trigger failed: ${response.statusText}`);
      }

      const result = await response.json();
      return NextResponse.json({ 
        success: true, 
        message: 'Maintenance orchestration triggered successfully',
        result 
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('SEO Management POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger maintenance action' },
      { status: 500 }
    );
  }
}
