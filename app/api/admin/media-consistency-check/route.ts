import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { 
  syncDatabaseWithBlobStorage, 
  getAllMediaWithMetadata,
  uploadMediaWithMetadata 
} from '@/utils/media-database-sync';

export async function GET(request: Request) {
  try {
    // Check admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Perform sync check
    const syncResult = await syncDatabaseWithBlobStorage();
    
    // Get recent media files
    const recentMedia = await getAllMediaWithMetadata();
    const recentCount = Math.min(recentMedia.length, 10);
    const recent = recentMedia.slice(0, recentCount);

    return NextResponse.json({
      success: true,
      sync: {
        isConsistent: syncResult.fixed,
        missingInDatabase: syncResult.missingInDb.length,
        missingInBlob: syncResult.missingInBlob.length,
        issues: syncResult.missingInDb.length + syncResult.missingInBlob.length
      },
      media: {
        total: recentMedia.length,
        recent: recent.map(item => ({
          id: item.id,
          url: item.url,
          title: item.title,
          folder: item.folder,
          uploadedAt: item.uploadedAt
        }))
      },
      message: syncResult.fixed ? 
        "✅ All systems consistent - database and blob storage are synchronized" :
        `⚠️ Found ${syncResult.missingInDb.length + syncResult.missingInBlob.length} inconsistencies`
    });

  } catch (error) {
    console.error('❌ Error checking media consistency:', error);
    return NextResponse.json({ 
      error: 'Failed to check media consistency',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const authResult = await checkAdminAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'test-upload') {
      // Test upload functionality with a small test file
      const testContent = new TextEncoder().encode('Test file for consistency check');
      const testFile = new File([testContent], 'consistency-test.txt', { type: 'text/plain' });
      
      const result = await uploadMediaWithMetadata(testFile, {
        filename: 'consistency-test.txt',
        folder: 'test',
        category: 'test-file',
        altText: 'Test file for consistency check',
        title: 'Consistency Test File',
      });

      return NextResponse.json({
        success: true,
        testUpload: {
          url: result.url,
          databaseId: result.databaseId,
        },
        message: "✅ Test upload successful - all systems working consistently"
      });
    }

    return NextResponse.json({ 
      error: 'Invalid action. Use "test-upload"' 
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Error in consistency test:', error);
    return NextResponse.json({ 
      error: 'Failed to perform consistency test',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
