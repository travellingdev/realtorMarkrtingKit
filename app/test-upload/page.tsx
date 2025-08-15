'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useUser } from '@/app/providers/UserProvider';

export default function TestUpload() {
  const { user } = useUser();
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const testBucketAccess = async () => {
    setStatus('Testing bucket access...');
    const sb = supabaseBrowser();
    
    try {
      // Test bucket listing
      const { data: buckets, error: bucketError } = await sb.storage.listBuckets();
      if (bucketError) throw bucketError;
      
      const photoBucket = buckets.find(b => b.id === 'photos');
      if (!photoBucket) {
        setStatus('❌ Photos bucket not found!');
        return;
      }
      
      setStatus('✅ Photos bucket exists');
      setResults(prev => [...prev, { test: 'Bucket exists', status: '✅', data: photoBucket }]);
      
    } catch (error) {
      setStatus(`❌ Bucket test failed: ${error}`);
      setResults(prev => [...prev, { test: 'Bucket access', status: '❌', error: String(error) }]);
    }
  };

  const testFileUpload = async () => {
    if (!user) {
      setStatus('❌ Must be logged in to test upload');
      return;
    }

    setStatus('Testing file upload...');
    const sb = supabaseBrowser();
    
    try {
      // Create a test file
      const testContent = new Blob(['test photo content'], { type: 'image/jpeg' });
      const testFile = new File([testContent], 'test.jpg', { type: 'image/jpeg' });
      
      const path = `${user.id}/test-${Date.now()}.jpg`;
      
      const { data, error } = await sb.storage
        .from('photos')
        .upload(path, testFile);
        
      if (error) throw error;
      
      setStatus('✅ Test upload successful');
      setResults(prev => [...prev, { test: 'File upload', status: '✅', data }]);
      
      // Test getting public URL
      const { data: urlData } = sb.storage.from('photos').getPublicUrl(path);
      setResults(prev => [...prev, { test: 'Public URL', status: '✅', data: urlData }]);
      
      // Clean up test file
      await sb.storage.from('photos').remove([path]);
      setResults(prev => [...prev, { test: 'Cleanup', status: '✅', data: 'Test file removed' }]);
      
    } catch (error) {
      setStatus(`❌ Upload test failed: ${error}`);
      setResults(prev => [...prev, { test: 'File upload', status: '❌', error: String(error) }]);
    }
  };

  const clearResults = () => {
    setResults([]);
    setStatus('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Storage Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testBucketAccess}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Test Bucket Access
          </button>
          
          <button
            onClick={testFileUpload}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
            disabled={!user}
          >
            Test File Upload {!user && '(Login Required)'}
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg"
          >
            Clear Results
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Status:</h2>
          <p className="text-lg">{status || 'Ready to test'}</p>
        </div>

        {results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <div className="space-y-2">
              {results.map((result, i) => (
                <div key={i} className="p-4 bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{result.status}</span>
                    <span className="font-medium">{result.test}</span>
                  </div>
                  {result.data && (
                    <pre className="text-sm text-green-300 overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                  {result.error && (
                    <pre className="text-sm text-red-300 overflow-x-auto">
                      {result.error}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-neutral-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Manual Setup Instructions:</h3>
          <div className="text-sm text-gray-300 space-y-2">
            <p>1. Go to your Supabase dashboard → Storage</p>
            <p>2. Create a new bucket named &quot;photos&quot; with public access</p>
            <p>3. Set up RLS policies for authenticated users</p>
            <p>4. Run the tests above to verify configuration</p>
          </div>
        </div>
      </div>
    </div>
  );
}