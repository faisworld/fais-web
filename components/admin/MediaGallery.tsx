import React, { useState, useEffect, JSX } from 'react'
import { Trash2, Download, ExternalLink, Play, Film, ImageIcon, Folder } from 'lucide-react';
import { isGif, handleImageError } from '@/utils/media-utils';
import Image from 'next/image';


// Determine if a file is a video based on URL or extension
export const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi', '.mpg', '.mpeg', '.wmv', '.flv'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};
// API response type for media items
interface ApiMediaItem {
  id: string | number;
  url: string;
  title?: string;
  name?: string;
  mediaType?: string;
  uploaded_at?: string;
  createdAt?: string;
  folder?: string;
  altTag?: string;
}

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  createdAt: string;
  thumbnailUrl?: string;
  folder?: string;
}

interface MediaGalleryProps {
  filterType?: 'all' | 'images' | 'videos';
}

export default function MediaGallery({ filterType = 'all' }: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [folders, setFolders] = useState<string[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>('');
  
  // Determine if a file is a video based on URL or type
  const isVideoFile = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // Load media from API
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use a more reliable API endpoint that returns both images and videos
        const response = await fetch('/api/admin/gallery/list');
        
        if (!response.ok) {
          throw new Error('Failed to fetch media');
        }
        
        const data: { images: ApiMediaItem[] } = await response.json();
        
        // Map the data and determine media type
        const mappedData: MediaItem[] = data.images.map((item: ApiMediaItem) => ({
          id: item.id.toString(),
          url: item.url,
          name: item.title || item.name || 'Untitled',
          type: (item.mediaType === 'video' || isVideoFile(item.url)) ? 'video' : 'image',
          createdAt: item.uploaded_at || item.createdAt || new Date().toISOString(),
          folder: item.folder || ''
        }));
        
        setMediaItems(mappedData);
        
        // Extract unique folders - filter out undefined folders
        const uniqueFolders = Array.from(
          new Set(mappedData
            .filter(item => item.folder && item.folder.trim() !== '')
            .map(item => item.folder as string))
        );
        setFolders(uniqueFolders);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err instanceof Error ? err.message : 'Error loading media');
        
        // Provide empty arrays if fetch fails
        setMediaItems([]);
        setFolders([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, []);

  // Apply filter when filterType, activeFolder, or mediaItems change
  useEffect(() => {
    let filtered = mediaItems;
    
    // First apply media type filter
    if (filterType === 'images') {
      filtered = filtered.filter(item => item.type === 'image');
    } else if (filterType === 'videos') {
      filtered = filtered.filter(item => item.type === 'video');
    }
    
    // Then apply folder filter if active
    if (activeFolder) {
      filtered = filtered.filter(item => item.folder === activeFolder);
    }
    
    setFilteredItems(filtered);
  }, [filterType, activeFolder, mediaItems]);

  // Handle media item selection
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  // Handle delete selected items
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedItems.size} item(s)?`)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convert Set to Array
      const idsToDelete = Array.from(selectedItems);
      
      // Use bulk deletion endpoint
      const response = await fetch(`/api/admin/gallery/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: idsToDelete })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`Bulk deletion result:`, data);
        
        // Update the media items list - remove all successfully deleted items
        setMediaItems(prev => prev.filter(item => !data.results.success.includes(item.id)));
        setSelectedItems(new Set());
        
        // Show success/error message
        if (data.results.failCount > 0) {
          setError(`Successfully deleted ${data.results.successCount} item(s), but failed to delete ${data.results.failCount} item(s).`);
        } else {
          setError(`Successfully deleted ${data.results.successCount} item(s).`);
          // Clear success message after 3 seconds
          setTimeout(() => setError(null), 3000);
        }
      } else {
        console.error(`Failed to delete items:`, data.error || 'Unknown error');
        setError(`Failed to delete items: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Error during bulk deletion:`, err);
      setError(`Error during deletion: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new function to handle single item deletion
  const handleDeleteItem = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the selection toggle
    
    if (!confirm(`Are you sure you want to delete this item?`)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/gallery/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`Deletion result:`, data);
        
        // Remove the deleted item from the list
        setMediaItems(prev => prev.filter(item => item.id !== id));
        
        // If the item was selected, remove it from the selection
        if (selectedItems.has(id)) {
          const newSelected = new Set(selectedItems);
          newSelected.delete(id);
          setSelectedItems(newSelected);
        }
        
        setError(`Item deleted successfully.`);
        setTimeout(() => setError(null), 3000);
      } else {
        console.error(`Failed to delete item:`, data.error || 'Unknown error');
        setError(`Failed to delete item: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Error during deletion:`, err);
      setError(`Error during deletion: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle video preview play/pause
  const toggleVideoPlay = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (activeVideoId === id) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(id);
    }
  };

  // Render video preview
  const renderVideoPreview = (item: MediaItem) => {
    const isActive = activeVideoId === item.id;
    
    return (
      <div className='video-thumbnail relative'>
        {isActive ? (
          <video 
            src={item.url} 
            className='w-full h-full object-cover' 
            autoPlay 
            controls 
            muted
          />
        ) : (
          <>
            <video 
              src={item.url} 
              className='w-full h-full object-cover' 
              muted
              playsInline
              preload='metadata'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='bg-black bg-opacity-50 rounded-full p-3 cursor-pointer z-10'
                   onClick={(e) => toggleVideoPlay(item.id, e)}>
                <Play className='h-8 w-8 text-white' />
              </div>
            </div>
          </>
        )}
        
        <div className='absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded'>
          <Film className='inline-block h-3 w-3 mr-1' />
          Video
        </div>
      </div>
    );
  };

  // Render image preview with error handling
  const renderImagePreview: (item: MediaItem) => JSX.Element = (item: MediaItem) => {
    // Determine if this is a GIF that should be unoptimized to preserve animation
    const isAnimatedGif = isGif(item.url);
    
    return (
      <>
        <Image
          src={item.url}
          alt={item.name}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover'
          priority={filteredItems.indexOf(item) < 3}
          style={{ objectFit: 'cover' }}
          onError={handleImageError}
          // Don't optimize GIFs to preserve animation
          unoptimized={isAnimatedGif}
          // Load GIFs eagerly to ensure they start animating immediately
          loading={isAnimatedGif ? 'eager' : 'lazy'}
        />
        <div className='absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded'>
          <ImageIcon className='inline-block h-3 w-3 mr-1' />
          Image
        </div>
      </>
    );
  };

  return (
    <div>
      {/* Folder Filter */}
      {folders.length > 0 && (
        <div className='mb-6 bg-white rounded-lg p-4 border border-gray-200 shadow-sm'>
          {/* Folders section */}
          {folders.length > 0 && (
            <div className='mb-4'>
              <div className='flex flex-wrap gap-2 items-center'>
                <span className='text-sm font-medium text-gray-500 mr-2'>
                  <Folder className='inline-block h-4 w-4 mr-1' />
                  Folders:
                </span>
                <button
                  onClick={() => setActiveFolder('')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeFolder === '' ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  All
                </button>
                {folders.map((folder, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFolder(folder)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      activeFolder === folder ? 'bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}        {selectedItems.size > 0 && (
        <div className='flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-md border border-gray-200'>
          <div className='flex items-center'>
            <input 
              type='checkbox' 
              id='select-all-items'
              name='selectAllItems'
              checked 
              className='mr-2' 
              readOnly 
            />
            <p className='text-sm font-medium'>
              {selectedItems.size} items selected
            </p>
          </div>
          <div className='flex space-x-2'>
            <button
              onClick={handleDeleteSelected}
              className='px-2 py-1 bg-black text-white rounded-sm text-sm flex items-center'
            >
              delete selected
            </button>
            <button 
              onClick={() => setSelectedItems(new Set())}
              className='px-2 py-1 bg-black text-white rounded-sm text-sm flex items-center'
            >
              clear selection
            </button>
            <button className='px-2 py-1 bg-black text-white rounded-sm text-sm flex items-center'>
              download selected
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className='p-4 bg-red-50 text-red-700 rounded-md border border-red-200 mb-4'>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className='flex justify-center items-center py-16'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600'></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className='text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
          {filterType === 'videos' ? (
            <div>
              <Film className='h-12 w-12 mx-auto text-gray-400 mb-2' />
              <p>No videos found</p>
            </div>
          ) : filterType === 'images' ? (
            <div>
              <ImageIcon className='h-12 w-12 mx-auto text-gray-400 mb-2' />
              <p>No images found</p>
            </div>
          ) : (
            <div>
              <p>No media found</p>
              <p className='text-sm mt-1'>Upload some media to see them here</p>
            </div>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`
                media-preview rounded-lg overflow-hidden border-2 cursor-pointer transition-all relative
                ${selectedItems.has(item.id) ? 'border-gray-600 shadow-md' : 'border-transparent hover:border-gray-300'}
              `}
            >
              {/* Media preview (image or video) */}
              {item.type === 'video' ? renderVideoPreview(item) : renderImagePreview(item)}
              
              {/* Item details */}
              <div className='p-2 bg-white border-t border-gray-100'>
                <p className='text-xs font-medium truncate' title={item.name}>{item.name}</p>
                <p className='text-xs text-gray-500'>{new Date(item.createdAt).toLocaleDateString()}</p>
                {item.folder && (
                  <p className='text-xs text-gray-500 mt-1 bg-gray-100 px-1 rounded truncate'>
                    <Folder className='inline-block h-3 w-3 mr-1' />
                    {item.folder}
                  </p>
                )}
              </div>
              
              {/* Action buttons */}
              <div className='absolute top-2 right-2 flex space-x-1'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    selectedItems.has(item.id) 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                  }`}
                >
                  {selectedItems.has(item.id) ? 'Selected' : 'Select'}
                </button>
              </div>
              
              {/* Download/open/delete buttons */}
              <div className='absolute bottom-12 right-2 flex space-x-1'>
                <button
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className='p-1 bg-red-600 rounded-full text-white hover:bg-red-700'
                  title='Delete'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
                
                <a 
                  href={item.url} 
                  target='_blank' 
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  className='p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70'
                  title='Open in new tab'
                >
                  <ExternalLink className='h-4 w-4' />
                </a>
                
                <a 
                  href={item.url} 
                  download
                  onClick={(e) => e.stopPropagation()}
                  className='p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70'
                  title='Download'
                >
                  <Download className='h-4 w-4' />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
