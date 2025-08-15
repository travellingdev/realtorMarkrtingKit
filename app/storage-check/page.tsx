'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useUser } from '@/app/providers/UserProvider';

export default function StorageInfrastructureCheck() {
  const { user } = useUser();
  const [results, setResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, status: '✅' | '❌' | '⚠️' | '🔍', data?: any, error?: any) => {
    setResults(prev => [...prev, { 
      test, 
      status, 
      data: data ? JSON.stringify(data, null, 2) : null,
      error: error ? String(error) : null,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const checkStorageInfrastructure = async () => {
    setIsRunning(true);
    setResults([]);
    const sb = supabaseBrowser();

    // Test 1: Check if user is authenticated
    addResult('Checking Authentication', '🔍');
    try {
      const { data: { user: authUser } } = await sb.auth.getUser();
      if (authUser) {
        addResult('Authentication', '✅', { userId: authUser.id });
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

    // Test 2: Try to check if storage schema exists
    addResult('Checking Storage Schema', '🔍');
    try {
      const { data, error } = await sb.rpc('check_storage_schema');
      if (error) {
        addResult('Storage Schema Check', '⚠️', null, 'Cannot check schema (function not available)');
      } else {
        addResult('Storage Schema', '✅', data);
      }
    } catch (error) {
      addResult('Storage Schema Check', '⚠️', null, 'Schema check function not available');
    }

    // Test 3: Try storage.listBuckets() - this will fail if storage isn't enabled
    addResult('Checking Storage API', '🔍');
    try {
      const { data: buckets, error } = await sb.storage.listBuckets();
      if (error) {
        if (error.message.includes('relation "storage.buckets" does not exist')) {
          addResult('Storage Infrastructure', '❌', null, 'Storage tables do not exist - Storage not enabled');
        } else if (error.message.includes('permission denied')) {
          addResult('Storage Infrastructure', '⚠️', null, 'Storage exists but permission denied');
        } else {
          addResult('Storage API Error', '❌', null, error.message);
        }
      } else {
        addResult('Storage Infrastructure', '✅', buckets);
        
        // If we got buckets, check for photos bucket specifically
        const photoBucket = buckets.find(b => b.id === 'photos');
        if (photoBucket) {
          addResult('Photos Bucket', '✅', photoBucket);
        } else {
          addResult('Photos Bucket', '❌', null, 'Photos bucket not found in available buckets');
        }
      }
    } catch (error) {
      addResult('Storage API', '❌', null, error);
    }

    // Test 4: Try a direct storage operation
    addResult('Testing Storage Operation', '🔍');
    try {
      const { data, error } = await sb.storage.from('photos').list('', { limit: 1 });
      if (error) {
        if (error.message.includes('relation "storage.objects" does not exist')) {
          addResult('Storage Objects Table', '❌', null, 'storage.objects table missing');
        } else if (error.message.includes('bucket "photos" not found')) {
          addResult('Storage Operation', '❌', null, 'Photos bucket not found');
        } else {
          addResult('Storage Operation', '⚠️', null, error.message);
        }
      } else {
        addResult('Storage Operation', '✅', data);
      }
    } catch (error) {
      addResult('Storage Operation', '❌', null, error);
    }

    // Test 5: Check Supabase project info
    addResult('Checking Project Configuration', '🔍');
    try {
      // This won't work from client-side, but let's try
      const response = await fetch('/api/check-storage-config');
      if (response.ok) {
        const data = await response.json();
        addResult('Project Storage Config', '✅', data);
      } else {
        addResult('Project Storage Config', '⚠️', null, 'Cannot check from client side');
      }
    } catch (error) {
      addResult('Project Storage Config', '⚠️', null, 'Config check not available');
    }

    setIsRunning(false);
  };

  const getFixInstructions = () => {
    const hasStorageInfraError = results.some(r => 
      r.error && (
        r.error.includes('does not exist') || 
        r.error.includes('Storage not enabled') ||
        r.error.includes('storage.objects table missing')
      )
    );

    const hasBucketError = results.some(r => 
      r.error && r.error.includes('bucket "photos" not found')
    );

    if (hasStorageInfraError) {
      return 'STORAGE_NOT_ENABLED';
    } else if (hasBucketError) {
      return 'BUCKET_MISSING';
    } else {
      return 'POLICIES_MISSING';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Storage Infrastructure Check</h1>
        
        <div className="mb-8">
          <button
            onClick={checkStorageInfrastructure}
            disabled={isRunning || !user}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 rounded-lg font-medium"
          >
            {isRunning ? 'Checking Infrastructure...' : 'Check Storage Setup'}
          </button>
        </div>

        {!user && (
          <div className="p-4 bg-red-500/20 border border-red-400/20 rounded-lg mb-8">
            <p className="text-red-300">⚠️ You must be logged in to check storage</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">Infrastructure Results</h2>
            
            {results.map((result, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border-l-4 ${
                  result.status === '✅' ? 'bg-green-500/10 border-green-400' :
                  result.status === '❌' ? 'bg-red-500/10 border-red-400' :
                  result.status === '🔍' ? 'bg-blue-500/10 border-blue-400' :
                  'bg-yellow-500/10 border-yellow-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{result.status}</span>
                    <span className="font-semibold">{result.test}</span>
                  </div>
                  <span className="text-xs text-gray-400">{result.timestamp}</span>
                </div>
                
                {result.error && (
                  <div className="mt-2 p-3 bg-red-900/30 rounded text-red-300 text-sm">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-300 hover:text-white">
                      Show Details
                    </summary>
                    <pre className="mt-2 p-3 bg-neutral-800 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {result.data}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Fix Instructions</h3>
            
            {(() => {
              const fixType = getFixInstructions();
              
              switch (fixType) {
                case 'STORAGE_NOT_ENABLED':
                  return (
                    <div className="space-y-4 text-sm">
                      <div className="p-4 bg-red-500/20 rounded-lg">
                        <h4 className="font-semibold text-red-300 mb-2">❌ Storage Not Enabled</h4>
                        <p className="text-red-200">Your Supabase project doesn&apos;t have Storage enabled.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold">To Enable Storage:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                          <li>Go to your Supabase Dashboard</li>
                          <li>Navigate to <strong>Storage</strong> in the sidebar</li>
                          <li>Click <strong>&quot;Enable Storage&quot;</strong> or <strong>&quot;Create new bucket&quot;</strong></li>
                          <li>This will initialize the storage infrastructure</li>
                          <li>Create a bucket named &quot;photos&quot; with public access</li>
                          <li>Set up RLS policies for the bucket</li>
                        </ol>
                      </div>
                    </div>
                  );
                
                case 'BUCKET_MISSING':
                  return (
                    <div className="space-y-4 text-sm">
                      <div className="p-4 bg-yellow-500/20 rounded-lg">
                        <h4 className="font-semibold text-yellow-300 mb-2">⚠️ Photos Bucket Missing</h4>
                        <p className="text-yellow-200">Storage is enabled but the &quot;photos&quot; bucket doesn&apos;t exist.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold">To Create Photos Bucket:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                          <li>Go to Supabase Dashboard → Storage</li>
                          <li>Click &quot;Create new bucket&quot;</li>
                          <li>Name: &quot;photos&quot;</li>
                          <li>Enable &quot;Public bucket&quot; option</li>
                          <li>Click &quot;Create bucket&quot;</li>
                        </ol>
                      </div>
                    </div>
                  );
                
                default:
                  return (
                    <div className="space-y-4 text-sm">
                      <div className="p-4 bg-green-500/20 rounded-lg">
                        <h4 className="font-semibold text-green-300 mb-2">✅ Infrastructure Looks Good</h4>
                        <p className="text-green-200">Storage and bucket exist. Issue is likely with policies.</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="font-semibold">To Fix Policies:</h5>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                          <li>Go to Supabase Dashboard → Storage → Policies</li>
                          <li>Look for policies on the &quot;objects&quot; table</li>
                          <li>Create INSERT, SELECT, and DELETE policies for authenticated users</li>
                          <li>Use the WITH CHECK: bucket_id = &apos;photos&apos; AND folder = auth.uid()</li>
                        </ol>
                      </div>
                    </div>
                  );
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
}