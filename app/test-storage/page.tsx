'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useUser } from '@/app/providers/UserProvider';

export default function StorageDiagnostic() {
  const { user } = useUser();
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, status: '✅' | '❌' | '⚠️', data?: any, error?: any) => {
    setResults(prev => [...prev, { 
      test, 
      status, 
      data: data ? JSON.stringify(data, null, 2) : null,
      error: error ? String(error) : null,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runFullDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    const sb = supabaseBrowser();

    // Test 1: Check if user is authenticated
    try {
      const { data: { user: authUser } } = await sb.auth.getUser();
      if (authUser) {
        addResult('Authentication', '✅', { userId: authUser.id, email: authUser.email });
      } else {
        addResult('Authentication', '❌', null, 'Not logged in');
        setIsRunning(false);
        return;
      }
    } catch (error) {
      addResult('Authentication', '❌', null, error);
      setIsRunning(false);
      return;
    }

    // Test 2: List all buckets
    try {
      const { data: buckets, error } = await sb.storage.listBuckets();
      if (error) throw error;
      
      const photoBucket = buckets.find(b => b.id === 'photos');
      if (photoBucket) {
        addResult('Photos Bucket Exists', '✅', photoBucket);
      } else {
        addResult('Photos Bucket Exists', '❌', buckets, 'Photos bucket not found');
      }
    } catch (error) {
      addResult('Bucket Listing', '❌', null, error);
    }

    // Test 3: Check bucket permissions by listing files
    try {
      const { data: files, error } = await sb.storage.from('photos').list('', { limit: 1 });
      if (error) {
        if (error.message.includes('row-level security')) {
          addResult('Bucket Permissions', '❌', null, 'RLS policy missing or incorrect');
        } else {
          addResult('Bucket Permissions', '❌', null, error);
        }
      } else {
        addResult('Bucket Permissions', '✅', { fileCount: files.length });
      }
    } catch (error) {
      addResult('Bucket Permissions', '❌', null, error);
    }

    // Test 4: Try to upload a test file
    try {
      const testContent = new Blob(['test-photo-upload'], { type: 'image/jpeg' });
      const testFile = new File([testContent], 'diagnostic-test.jpg', { type: 'image/jpeg' });
      const testPath = `${user?.id}/diagnostic-${Date.now()}.jpg`;

      const { data: uploadData, error: uploadError } = await sb.storage
        .from('photos')
        .upload(testPath, testFile);

      if (uploadError) {
        if (uploadError.message.includes('row-level security')) {
          addResult('File Upload', '❌', null, 'Upload policy missing - users cannot upload');
        } else {
          addResult('File Upload', '❌', null, uploadError);
        }
      } else {
        addResult('File Upload', '✅', uploadData);

        // Test 5: Get public URL
        try {
          const { data: urlData } = sb.storage.from('photos').getPublicUrl(testPath);
          addResult('Public URL Generation', '✅', urlData);

          // Test 6: Verify URL is accessible
          try {
            const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
            if (response.ok) {
              addResult('URL Accessibility', '✅', { status: response.status });
            } else {
              addResult('URL Accessibility', '❌', null, `HTTP ${response.status}`);
            }
          } catch (error) {
            addResult('URL Accessibility', '❌', null, error);
          }

          // Test 7: Clean up test file
          try {
            const { error: deleteError } = await sb.storage.from('photos').remove([testPath]);
            if (deleteError) {
              addResult('File Cleanup', '⚠️', null, deleteError);
            } else {
              addResult('File Cleanup', '✅', null);
            }
          } catch (error) {
            addResult('File Cleanup', '⚠️', null, error);
          }
        } catch (error) {
          addResult('Public URL Generation', '❌', null, error);
        }
      }
    } catch (error) {
      addResult('File Upload', '❌', null, error);
    }

    // Test 8: Check current policies (requires admin access)
    try {
      const { data: policies, error: policyError } = await sb.rpc('get_storage_policies');
      if (policyError) {
        addResult('Policy Check', '⚠️', null, 'Cannot check policies (requires admin)');
      } else {
        addResult('Policy Check', '✅', policies);
      }
    } catch (error) {
      addResult('Policy Check', '⚠️', null, 'Policy check not available');
    }

    setIsRunning(false);
  };

  const fixCommonIssues = async () => {
    setResults([]);
    addResult('Fix Attempt', '⚠️', null, 'Attempting to create missing policies...');

    // Note: These would need to be run in Supabase SQL editor or CLI
    const policySQL = `
-- Enable RLS on storage.objects if not enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicates)
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;

-- Create upload policy
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create select policy  
CREATE POLICY "Users can view their own photos" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create delete policy
CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'photos' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);`;

    addResult('SQL Commands', '⚠️', policySQL, 'Run these commands in Supabase SQL editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Storage Diagnostic</h1>
        
        <div className="space-x-4 mb-8">
          <button
            onClick={runFullDiagnostic}
            disabled={isRunning || !user}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 rounded-lg font-medium"
          >
            {isRunning ? 'Running Diagnostic...' : 'Run Full Diagnostic'}
          </button>
          
          <button
            onClick={fixCommonIssues}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium"
          >
            Show Fix Commands
          </button>
          
          <button
            onClick={() => setResults([])}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg font-medium"
          >
            Clear Results
          </button>
        </div>

        {!user && (
          <div className="p-4 bg-red-500/20 border border-red-400/20 rounded-lg mb-8">
            <p className="text-red-300">⚠️ You must be logged in to run storage diagnostics</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Diagnostic Results</h2>
            
            {results.map((result, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border-l-4 ${
                  result.status === '✅' ? 'bg-green-500/10 border-green-400' :
                  result.status === '❌' ? 'bg-red-500/10 border-red-400' :
                  'bg-yellow-500/10 border-yellow-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{result.status}</span>
                    <span className="font-semibold text-lg">{result.test}</span>
                  </div>
                  <span className="text-sm text-gray-400">{result.timestamp}</span>
                </div>
                
                {result.error && (
                  <div className="mt-2 p-3 bg-red-900/30 rounded text-red-300">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-300 hover:text-white">
                      Show Details
                    </summary>
                    <pre className="mt-2 p-3 bg-neutral-800 rounded text-xs overflow-x-auto">
                      {result.data}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-neutral-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Common Issues & Solutions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-green-400">✅ If &quot;Photos Bucket Exists&quot; passes:</h4>
              <p className="text-gray-300">Good! The bucket is created. Focus on policies.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-red-400">❌ If &quot;Bucket Permissions&quot; fails:</h4>
              <p className="text-gray-300">RLS policies are missing. Run the SQL commands from &quot;Show Fix Commands&quot;.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-red-400">❌ If &quot;File Upload&quot; fails with RLS error:</h4>
              <p className="text-gray-300">Upload policy is missing or incorrect. Check the folder path structure.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-yellow-400">⚠️ If &quot;URL Accessibility&quot; fails:</h4>
              <p className="text-gray-300">The bucket might not be public, or there&apos;s a CORS issue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}