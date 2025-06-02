"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Upload, X, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [folderOptions, setFolderOptions] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    
    // Also remove any errors for this file
    const fileKey = `file-${index}`;
    if (errors[fileKey]) {
      const newErrors = {...errors};
      delete newErrors[fileKey];
      setErrors(newErrors);
    }
  };

  // Fetch available folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('/api/admin/gallery/list');
        if (response.ok) {
          const data = await response.json();
          setFolderOptions(data.folders || []);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };
    
    fetchFolders();
  }, []);

  // Handle upload to Blobstore
  const handleUpload = async () => {
    if (!files.length) return;
    
    setUploading(true);
    setUploadedFiles([]);
    setErrors({});
    
    const results: string[] = [];
    
    // Upload each file individually
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileKey = `file-${i}`;
      
      try {
        // Create FormData for this file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0]); // Use filename as title
        
        // Add folder information if selected
        if (selectedFolder) {
          formData.append('folder', selectedFolder);
        }
        
        // Track upload progress for this specific file
        setUploadProgress(prev => ({...prev, [fileKey]: 0}));
        
        // Upload to your API endpoint that handles Blobstore storage
        const response = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          body: formData,
        });
        
        // Show 100% progress when done
        setUploadProgress(prev => ({...prev, [fileKey]: 100}));
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload');
        }
        
        const data = await response.json();
        results.push(data.url);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        setErrors(prev => ({
          ...prev, 
          [fileKey]: err instanceof Error ? err.message : 'Upload failed'
        }));
      }
    }
    
    // Update uploaded files list
    setUploadedFiles(results);
    
    // Only reset files list if all uploads were successful
    if (results.length === files.length) {
      setFiles([]);
    }
    
    setUploading(false);
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link 
          href="/admin/gallery" 
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Gallery
        </Link>
        <h1 className="text-2xl font-bold">Upload Media</h1>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-md">
        {/* Folder selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Target Folder (optional)
          </label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            disabled={uploading}
          >
            <option value="">Root (No folder)</option>
            {folderOptions.map(folder => (
              <option key={folder} value={folder}>{folder}</option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Media will be uploaded to the selected folder
          </p>
        </div>
        
        {/* File drop area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6"
          onDragOver={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
          }}
        >
          <Upload size={40} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Drag and drop media files here, or click to select</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label 
            htmlFor="file-upload"            className={`inline-block px-4 py-2 bg-black text-white rounded-md cursor-pointer
              hover:bg-gray-800 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Select Files
          </label>
          <p className="mt-2 text-sm text-gray-500">
            Supports: JPG, PNG, GIF, WEBP, MP4, WEBM, MOV (Max 100MB)
          </p>
        </div>
        
        {/* Selected files list */}
        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Selected Files ({files.length})</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto p-2">
              {files.map((file, index) => {
                const fileKey = `file-${index}`;
                const progress = uploadProgress[fileKey] || 0;
                const error = errors[fileKey];
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-center p-3 border rounded-md
                      ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  >
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium truncate" style={{maxWidth: '400px'}}>{file.name}</p>
                        <span className="text-gray-500 text-sm">{formatFileSize(file.size)}</span>
                      </div>
                      
                      {uploading && (
                        <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {error && (
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => removeFile(index)}
                      className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={uploading}
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Upload controls */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setFiles([])}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={!files.length || uploading}
          >
            Clear All
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50"
            disabled={!files.length || uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </button>
        </div>
        
        {/* Upload results */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center mb-3">
              <Check size={20} className="text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-green-800">
                Successfully uploaded {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'}
              </h3>
            </div>
            <p className="text-green-700 mb-2">
              Your media has been uploaded to the gallery and is ready to use.
            </p>
            <div className="flex justify-end">
              <Link
                href="/admin/gallery"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Go to Gallery
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
