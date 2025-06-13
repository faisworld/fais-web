import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/utils/auth-compat";
import { Client } from "@neondatabase/serverless";

export async function POST(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = new Client(process.env.DATABASE_URL || "");
    await client.connect();    const results = {
      checkedImages: 0,
      brokenImages: [] as Array<{
        id: number;
        title: string;
        url: string;
        uploaded_at: string;
        status?: number;
        error?: string;
      }>,
      workingImages: 0,
      deletedOrphans: 0,
      errors: [] as string[]
    };

    // Get request body first
    const body = await request.json().catch(() => ({}));

    try {
      // Get all images from database
      const imagesResult = await client.query(`
        SELECT id, title, url, uploaded_at 
        FROM images 
        ORDER BY uploaded_at DESC
      `);

      console.log(`Found ${imagesResult.rows.length} images in database`);
      results.checkedImages = imagesResult.rows.length;

      // Check each image URL to see if it exists
      for (const image of imagesResult.rows) {
        try {
          const response = await fetch(image.url, { method: 'HEAD' });
          
          if (!response.ok) {
            // Image doesn't exist in blob storage
            results.brokenImages.push({
              id: image.id,
              title: image.title,
              url: image.url,
              uploaded_at: image.uploaded_at,
              status: response.status
            });
            
            console.log(`Found broken image: ${image.title} (ID: ${image.id}) - Status: ${response.status}`);
          } else {
            results.workingImages++;
          }
        } catch (fetchError) {
          results.brokenImages.push({
            id: image.id,
            title: image.title,
            url: image.url,
            uploaded_at: image.uploaded_at,
            error: String(fetchError)
          });
          
          console.log(`Error checking image: ${image.title} (ID: ${image.id}) - ${fetchError}`);
        }
      }      // Ask if user wants to delete orphaned entries
      if (body.deleteOrphans === true && results.brokenImages.length > 0) {
        console.log(`Deleting ${results.brokenImages.length} orphaned images from database...`);
        
        for (const brokenImage of results.brokenImages) {
          try {
            await client.query("DELETE FROM images WHERE id = $1", [brokenImage.id]);
            results.deletedOrphans++;
            console.log(`Deleted orphaned image: ${brokenImage.title} (ID: ${brokenImage.id})`);
          } catch (deleteError) {
            results.errors.push(`Failed to delete image ID ${brokenImage.id}: ${deleteError}`);
            console.error(`Failed to delete image ID ${brokenImage.id}:`, deleteError);
          }
        }
      }

    } catch (dbError) {
      console.error("Database error:", dbError);
      results.errors.push(`Database error: ${dbError}`);
    } finally {
      await client.end();
    }

    return NextResponse.json({
      success: true,
      message: `Analyzed ${results.checkedImages} images. Found ${results.brokenImages.length} broken images and ${results.workingImages} working images.`,
      results,
      action: body?.deleteOrphans ? 'Deleted orphaned entries' : 'Analysis only - set deleteOrphans: true to clean up'
    });

  } catch (error) {
    console.error("Error in gallery cleanup:", error);
    return NextResponse.json(
      { error: "Failed to analyze gallery", details: String(error) },
      { status: 500 }
    );
  }
}
