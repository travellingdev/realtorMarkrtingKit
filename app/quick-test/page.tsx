'use client';
import { useState } from 'react';
import { uploadPhotos } from '@/lib/uploadPhotos';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useUser } from '@/app/providers/UserProvider';

export default function QuickPhotoTest() {
  const { user } = useUser();
  const [status, setStatus] = useState('');
  const [testFile, setTestFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string[]>([]);

  const createTestFile = () => {
    // Create a small test image file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Draw a simple test pattern
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 50, 50);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(50, 0, 50, 50);
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(0, 50, 50, 50);
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(50, 50, 50, 50);
    }
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'test-photo.jpg', { type: 'image/jpeg' });
        setTestFile(file);
        setStatus('✅ Test file created (100x100 colored squares)');
      }
    }, 'image/jpeg', 0.8);
  };

  const testDirectUpload = async () => {
    if (!user || !testFile) {
      setStatus('❌ Need to be logged in and have test file');
      return;
    }

    setStatus('🔄 Testing direct upload...');
    
    try {
      const sb = supabaseBrowser();
      const urls = await uploadPhotos(sb, [testFile], user.id);
      
      if (urls.length > 0) {
        setUploadResult(urls);
        setStatus(`✅ Upload successful! Generated ${urls.length} URL(s)`);
      } else {
        setStatus('❌ Upload failed - no URLs returned');
      }
    } catch (error) {
      setStatus(`❌ Upload failed: ${error}`);
    }
  };

  const testFromFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;

    setStatus(`🔄 Testing upload of ${files.length} file(s)...`);
    
    try {
      const sb = supabaseBrowser();
      const fileArray = Array.from(files);
      const urls = await uploadPhotos(sb, fileArray, user.id);
      
      if (urls.length > 0) {
        setUploadResult(urls);
        setStatus(`✅ Upload successful! ${urls.length}/${files.length} files uploaded`);
      } else {
        setStatus('❌ All uploads failed');
      }
    } catch (error) {
      setStatus(`❌ Upload failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quick Photo Upload Test</h1>
        
        {!user && (
          <div className="p-4 bg-red-500/20 border border-red-400/20 rounded-lg mb-8">
            <p className="text-red-300">⚠️ You must be logged in to test photo uploads</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Test 1: Generated test file */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 1: Generated Test File</h2>
            <div className="space-y-4">
              <button
                onClick={createTestFile}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                Create Test Image
              </button>
              
              {testFile && (
                <div>
                  <p className="text-green-300">✅ Test file ready: {testFile.name} ({Math.round(testFile.size / 1024)}KB)</p>
                  <button
                    onClick={testDirectUpload}
                    disabled={!user}
                    className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 rounded-lg"
                  >
                    Test Upload
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Test 2: Real file upload */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 2: Upload Your Own Photos</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={testFromFileInput}
              disabled={!user}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600 disabled:opacity-50"
            />
          </div>

          {/* Status */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Status</h2>
            <p className="text-lg">{status || 'Ready to test'}</p>
          </div>

          {/* Results */}
          {uploadResult.length > 0 && (
            <div className="p-6 bg-neutral-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Upload Results</h2>
              <div className="space-y-2">
                {uploadResult.map((url, i) => (
                  <div key={i} className="p-3 bg-neutral-700 rounded">
                    <p className="text-sm text-gray-300 mb-2">Photo {i + 1}:</p>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-xs break-all"
                    >
                      {url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Troubleshooting */}
          <div className="p-6 bg-neutral-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
            <div className="text-sm space-y-2 text-gray-300">
              <p><strong>If upload fails with &quot;row-level security&quot; error:</strong></p>
              <p>→ Storage policies are missing. Fix through Supabase Dashboard → Storage → Policies</p>
              
              <p className="mt-4"><strong>If upload fails with &quot;bucket not found&quot;:</strong></p>
              <p>→ Photos bucket doesn&apos;t exist or is misconfigured</p>
              
              <p className="mt-4"><strong>If upload succeeds but URLs don&apos;t work:</strong></p>
              <p>→ Bucket is not public or CORS is misconfigured</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}