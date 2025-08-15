/**
 * Test function to verify image processing is actually working
 * This adds a visible red border to confirm Canvas processing
 */

export async function testImageProcessing(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    console.log('[TEST] Starting test processing...');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('[TEST] No canvas context');
      resolve(imageUrl);
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('[TEST] Image loaded');
      
      // Set canvas size
      canvas.width = 500;
      canvas.height = 500;
      
      // Fill with bright color to make it obvious
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image smaller in center
      ctx.drawImage(img, 50, 50, 400, 400);
      
      // Add obvious text overlay
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 48px Arial';
      ctx.fillText('PROCESSED', 100, 250);
      
      // Add border
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          console.log('[TEST] Created test image with red background and text');
          resolve(url);
        } else {
          console.error('[TEST] Failed to create blob');
          resolve(imageUrl);
        }
      }, 'image/jpeg', 0.85);
    };
    
    img.onerror = () => {
      console.error('[TEST] Failed to load image');
      resolve(imageUrl);
    };
    
    img.src = imageUrl;
  });
}