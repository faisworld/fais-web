"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload, ArrowLeft, Check, Film, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CarouselSlide {
  name: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  uploadedAt?: string;
}

export default function CarouselUploadPage() {
  // Define carousel slides
  const carouselSlides: CarouselSlide[] = [
    {
      name: "Pioneering Digital Transformation",
      description: "Main hero image or video for digital transformation slide"
    },
    {
      name: "Innovating the Future",
      description: "Hero image or video for innovation slide"
    },
    {
      name: "Shaping SOTA Technologies",
      description: "Hero image or video for SOTA technologies slide"
    }
  ];

  const [slideMedia, setSlideMedia] = useState<{[key: string]: {url: string, type: 'image' | 'video'}}>({});
  const [uploadingSlide, setUploadingSlide] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [refreshRequired, setRefreshRequired] = useState(false);

  // Fetch existing carousel media on load
  useEffect(() => {
    const fetchCarouselMedia = async () => {
      try {
        const response = await fetch('/api/admin/carousel/list');
        if (response.ok) {
          const data = await response.json();
          
          // Map images/videos to slides by name
          const mediaMap: {[key: string]: {url: string, type: 'image' | 'video'}} = {};
          data.mediaItems.forEach((item: any) => {
            mediaMap[item.slideName] = {
              url: item.url,
              type: item.mediaType || 'image' // Default to image if type not specified
            };
          });
          
          setSlideMedia(mediaMap);
        }
      } catch (error) {
        console.error('Error fetching carousel media:', error);
      }
    };
    
    fetchCarouselMedia();
  }, []);

  // Detect file type (image or video)
  const getMediaType = (file: File): 'image' | 'video' => {
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, slideName: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0]; // Just use the first file
    
    // Validate file is an image or video
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setUploadError('Only image or video files are allowed');
      return;
    }
    
    // Start upload
    setUploadingSlide(slideName);
    setUploadError(null);
    setUploadSuccess(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slideName', slideName);
      formData.append('mediaType', getMediaType(file));
      
      const response = await fetch('/api/admin/carousel/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      
      // Update local state with new media
      setSlideMedia(prev => ({
        ...prev,
        [slideName]: {
          url: data.url,
          type: getMediaType(file)
        }
      }));

      // Update carousel metadata in DB
      await updateCarouselMediaMetadata([{
        key: slideName.toLowerCase().replace(/\s+/g, '-'),
        url: data.url,
        keywords: '', // Add keywords if applicable
        link: '', // Add link if applicable
      }]);

      setUploadSuccess(slideName);
      onUploadSuccess();
    } catch (err) {
      console.error(`Error uploading for ${slideName}:`, err);
      setUploadError(`Failed to upload: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUploadingSlide(null);
    }
  };

  // Handle save changes to update the carousel on the homepage
  const handleSaveChanges = async () => {
    setSaveStatus('saving');
    try {
      // Call the API to update the carousel configuration
      const response = await fetch('/api/admin/carousel/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Send any configuration data needed
          updateTimestamp: Date.now()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      
      setSaveStatus('success');
      setRefreshRequired(false);
      
      // Reset success status after a few seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save carousel changes:', error);
      setSaveStatus('error');
    }
  };

  // When a file is successfully uploaded, mark that a save is required
  const onUploadSuccess = () => {
    setRefreshRequired(true);
  };

  // Render media preview (image or video)
  const renderMediaPreview = (slideName: string) => {
    const media = slideMedia[slideName];
    
    if (!media) {
      return (
        <div className="h-48 border rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
          No media uploaded
        </div>
      );
    }
    
    if (media.type === 'video') {
      return (
        <div className="relative h-48 border rounded-md overflow-hidden">
          <video 
            src={media.url}
            className="w-full h-full object-cover"
            controls
            muted
          />
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white rounded-md px-2 py-1 text-xs">
            <Film className="inline-block h-3 w-3 mr-1" />
            Video
          </div>
        </div>
      );
    }
    
    // Default to image
    return (
      <div className="relative h-48 border rounded-md overflow-hidden">
        <Image 
          src={media.url}
          alt={slideName}
          fill
          className="object-cover"
          unoptimized={true}
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link 
          href="/admin" 
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Admin
        </Link>
        <h1 className="text-2xl font-bold">Carousel Media Upload</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        Upload images or videos for the homepage carousel. For images, recommended size: 1920×1080px (16:9 ratio) or 1440×900px.
        For videos, use short clips (10-30 seconds) in MP4 format.
      </p>
      
      {uploadError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{uploadError}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {carouselSlides.map((slide) => (
          <div key={slide.name} className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-2">{slide.name}</h2>
            <p className="text-gray-500 mb-4">{slide.description}</p>
            
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                {renderMediaPreview(slide.name)}
              </div>
              
              <div className="w-full md:w-auto">
                <input
                  type="file"
                  id={`file-${slide.name}`}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileSelect(e, slide.name)}
                  disabled={uploadingSlide === slide.name}
                />
                <label 
                  htmlFor={`file-${slide.name}`}
                  className={`
                    flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-600 
                    rounded-md cursor-pointer hover:bg-blue-50 transition-colors
                    ${uploadingSlide === slide.name ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {uploadingSlide === slide.name ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : slideMedia[slide.name] ? (
                    <>
                      <Upload size={16} className="mr-2" />
                      Replace {slideMedia[slide.name].type === 'video' ? 'Video' : 'Image'}
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Select image or video
                    </>
                  )}
                </label>
                
                {uploadSuccess === slide.name && (
                  <p className="text-green-600 text-sm mt-2 flex items-center">
                    <Check size={14} className="mr-1" /> Media uploaded successfully
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add a save button at the bottom */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            {refreshRequired && (
              <p className="text-amber-600">
                Media has been uploaded. Please save changes to update the carousel.
              </p>
            )}
            {saveStatus === 'success' && (
              <p className="text-green-600 flex items-center">
                <Check size={16} className="mr-1.5" />
                Changes saved successfully. The homepage carousel has been updated.
              </p>
            )}
            {saveStatus === 'error' && (
              <p className="text-red-600">
                Failed to save changes. Please try again.
              </p>
            )}
          </div>
          
          <button
            onClick={handleSaveChanges}
            disabled={saveStatus === 'saving' || !refreshRequired}
            className={`
              px-4 py-2 rounded-md flex items-center 
              ${!refreshRequired || saveStatus === 'saving'
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'}
            `}
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save and Update Carousel
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Guidance note */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">How carousel updates work:</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-1 ml-2">
          <li>Upload your image or video for each slide</li>
          <li>Once uploads are complete, click "Save and Update Carousel"</li>
          <li>The homepage carousel will immediately reflect your changes</li>
          <li>Changes are permanent and will be visible to all users</li>
        </ol>
      </div>
    </div>
  );
}
