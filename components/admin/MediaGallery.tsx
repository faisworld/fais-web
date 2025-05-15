import { useState, useEffect } from 'react';
import { Trash2, Download, ExternalLink, Play, Pause, Film, ImageIcon } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  createdAt: string;
  thumbnailUrl?: string;
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
        
        const response = await fetch('/api/admin/media/list');
        
        if (!response.ok) {
          throw new Error('Failed to fetch media');
        }
        
        const data = await response.json();
        
        // Map the data and determine media type
        const mappedData = data.items.map((item: any) => ({
          ...item,
          type: item.type || isVideoFile(item.url) ? 'video' : 'image'
        }));
        
        setMediaItems(mappedData);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError(err instanceof Error ? err.message : 'Error loading media');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedia();
  }, []);

  // Apply filter when filterType or mediaItems change
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredItems(mediaItems);
    } else if (filterType === 'images') {
      setFilteredItems(mediaItems.filter(item => item.type === 'image'));
    } else if (filterType === 'videos') {
      setFilteredItems(mediaItems.filter(item => item.type === 'video'));
    }
  }, [filterType, mediaItems]);

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
    let successCount = 0;
    let failCount = 0;
    
    for (const id of selectedItems) {
      try {
        const item = mediaItems.find(item => item.id === id);
        if (!item) continue;
        
        const response = await fetch(`/api/admin/media/delete?url=${encodeURIComponent(item.url)}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error(`Error deleting item ${id}:`, err);
        failCount++;
      }
    }
    
    // Update the media items list
    if (successCount > 0) {
      setMediaItems(mediaItems.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
    }
    
    // Show error if some deletions failed
    if (failCount > 0) {
      setError(`Failed to delete ${failCount} item(s).`);
    }
    
    setIsLoading(false);
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
      <div className="video-thumbnail relative">
        {isActive ? (
          <video 
            src={item.url} 
            className="w-full h-full object-cover" 
            autoPlay 
            controls 
            muted
          />
        ) : (
          <>
            <video 
              src={item.url} 
              className="w-full h-full object-cover" 
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3 cursor-pointer z-10"
                   onClick={(e) => toggleVideoPlay(item.id, e)}>
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </>
        )}
        
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          <Film className="inline-block h-3 w-3 mr-1" />
          Video
        </div>
      </div>
    );
  };

  // Render image preview
  const renderImagePreview = (item: MediaItem) => {
    return (
      <div className="relative">
        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          <ImageIcon className="inline-block h-3 w-3 mr-1" />
          Image
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedItems.size > 0 && (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm font-medium">
            {selectedItems.size} item(s) selected
          </p>
          <div className="flex space-x-2">
            <button 
              onClick={handleDeleteSelected} 
              className="text-red-600 hover:text-red-800 text-sm flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          {filterType === 'videos' ? (
            <div>
              <Film className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No videos found</p>
            </div>
          ) : filterType === 'images' ? (
            <div>
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No images found</p>
            </div>
          ) : (
            <div>
              <p>No media found</p>
              <p className="text-sm mt-1">Upload some media to see them here</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`
                media-preview rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                ${selectedItems.has(item.id) ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'}
              `}
            >
              {item.type === 'video' ? renderVideoPreview(item) : renderImagePreview(item)}
              
              <div className="p-2 bg-white border-t border-gray-100">
                <p className="text-xs font-medium truncate" title={item.name}>{item.name}</p>
                <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="absolute top-2 right-2 flex space-x-1">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                
                <a 
                  href={item.url} 
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
