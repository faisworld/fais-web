"use client";

import { useState, useEffect } from 'react';

interface ConsistencyData {
  success: boolean;
  sync: {
    isConsistent: boolean;
    missingInDatabase: number;
    missingInBlob: number;
    issues: number;
  };
  media: {
    total: number;
    recent: Array<{
      id: number;
      url: string;
      title: string;
      folder: string;
      uploadedAt: string;
    }>;
  };
  message: string;
}

export default function MediaConsistencyPage() {
  const [consistencyData, setConsistencyData] = useState<ConsistencyData | null>(null);  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [fixing, setFixing] = useState(false);

  const checkConsistency = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media-consistency-check');
      const data = await response.json();
      setConsistencyData(data);
    } catch (error) {
      console.error('Error checking consistency:', error);
    } finally {
      setLoading(false);
    }
  };

  const testUpload = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/admin/media-consistency-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-upload' }),
      });
      const data = await response.json();
      alert(data.success ? data.message : `Error: ${data.error}`);
      // Refresh data after test
      checkConsistency();
    } catch (error) {
      console.error('Error testing upload:', error);
      alert('Test failed: ' + error);
    } finally {
      setTesting(false);
    }
  };

  const fixAllIssues = async () => {
    setFixing(true);
    try {
      const response = await fetch('/api/admin/fix-media-consistency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'fix-all-inconsistencies' }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nDetails:\n- Added to database: ${data.details.addedToDatabase}\n- Removed broken entries: ${data.details.removedFromDatabase}\n- Total fixed: ${data.details.totalFixed}`);
        // Refresh data after fix
        checkConsistency();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error fixing issues:', error);
      alert('❌ Fix failed: ' + error);
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    checkConsistency();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Media Consistency Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and test the consistency between Vercel blob storage and Neon database
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Consistency Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Consistency Status
              </h2>
              <button
                onClick={checkConsistency}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Checking...' : 'Refresh'}
              </button>
            </div>

            {consistencyData ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-md ${
                  consistencyData.sync.isConsistent 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-yellow-50 border border-yellow-200'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      consistencyData.sync.isConsistent ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className={`font-medium ${
                      consistencyData.sync.isConsistent ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {consistencyData.message}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-2xl font-bold text-gray-900">
                      {consistencyData.media.total}
                    </div>
                    <div className="text-sm text-gray-600">Total Media Files</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-2xl font-bold text-red-600">
                      {consistencyData.sync.issues}
                    </div>
                    <div className="text-sm text-gray-600">Issues Found</div>
                  </div>
                </div>                {consistencyData.sync.issues > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Missing in Database: {consistencyData.sync.missingInDatabase}
                    </div>
                    <div className="text-sm text-gray-600">
                      Missing in Blob Storage: {consistencyData.sync.missingInBlob}
                    </div>
                    <button
                      onClick={fixAllIssues}
                      disabled={fixing}
                      className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {fixing ? 'Fixing Issues...' : 'Fix All Issues'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading consistency data...</p>
              </div>
            )}
          </div>

          {/* Test Functions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Functions
            </h2>
            <div className="space-y-4">
              <button
                onClick={testUpload}
                disabled={testing}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {testing ? 'Testing Upload...' : 'Test Upload Consistency'}
              </button>
              
              <div className="text-sm text-gray-600">
                This will test if the upload process correctly saves to both blob storage and database.
              </div>
            </div>
          </div>
        </div>

        {/* Recent Media Files */}
        {consistencyData?.media.recent && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Media Files
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">ID</th>
                    <th className="text-left py-2">Title</th>
                    <th className="text-left py-2">Folder</th>
                    <th className="text-left py-2">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {consistencyData.media.recent.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-2">{item.id}</td>
                      <td className="py-2">{item.title}</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {item.folder}
                        </span>
                      </td>
                      <td className="py-2">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
