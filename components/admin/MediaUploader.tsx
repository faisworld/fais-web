import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, File, Image as ImageIcon, Film } from 'lucide-react';

interface MediaUploaderProps {
  onUploadComplete: (mediaUrls: string[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  buttonText?: string;
}

interface UploadResponse {
  url: string;
  success: boolean;
  message?: string;
  error?: string;
}

export default function MediaUploader({
  onUploadComplete,
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'],
  buttonText = 'Select Media Files'
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }

    // Check file types
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      if (allowedTypes.includes(files[i].type)) {
        validFiles.push(files[i]);
      } else {
        invalidFiles.push(files[i].name);
      }
    }

    if (invalidFiles.length > 0) {
      setError(`Unsupported file type(s): ${invalidFiles.join(', ')}`);
      if (validFiles.length === 0) return;
    }

    setSelectedFiles(validFiles);
    setError(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Film className="h-4 w-4 text-purple-500" />;
    } else {
      return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('media', selectedFiles[i]);
        
        // Track individual file progress
        const progress = Math.round((i / selectedFiles.length) * 100);
        setUploadProgress(progress);
        
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json() as { error: string; message: string };
          throw new Error(errorData.message || errorData.error || 'Failed to upload media');
        }
        
        const data = await response.json() as UploadResponse;
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }
      
      setUploadProgress(100);
      setSuccess(true);
      onUploadComplete(uploadedUrls);
      
      // Reset form after successful upload
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="media-upload-label">
          <input
            ref={fileInputRef}
            type="file"
            className="media-upload-input"
            onChange={handleFileSelect}
            accept={allowedTypes.join(',')}
            multiple
            disabled={isUploading}
          />
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected files ({selectedFiles.length}):</p>
          <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-md">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center mb-1 text-sm">
                {getFileIcon(file)}
                <span className="ml-2">{file.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-3"
          >
            {isUploading ? 'Uploading...' : 'Upload Selected Files'}
          </button>
        </div>
      )}
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-xs text-gray-500 mt-1">
            Uploading {uploadProgress}%
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md mb-4 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-md mb-4 flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">Media uploaded successfully!</p>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1">
        <p>Supported formats: JPG, PNG, GIF, MP4, WebM, MOV</p>
        <p>Maximum files: {maxFiles}</p>
      </div>
    </div>
  );
}
