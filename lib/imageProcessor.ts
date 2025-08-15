/**
 * Client-side image processor for hero image enhancements
 * Uses Canvas API to apply filters and overlays
 */

export interface ProcessingOptions {
  imageUrl: string;
  enhancement: string;
  platform: string;
  overlays: {
    badge?: string;
    price?: string;
    bedsBaths?: string;
    agentInfo?: {
      name: string;
      phone?: string;
    };
  };
  customFilters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    temperature?: number;
    tint?: number;
    highlights?: number;
    shadows?: number;
    vibrance?: number;
    clarity?: number;
  };
}

export interface ProcessingResult {
  success: boolean;
  url: string | null;
  error: string | null;
  platform: string;
}

export interface PlatformDimensions {
  width: number;
  height: number;
}

export class ImageProcessor {
  /**
   * Test if an image URL can be used with Canvas (CORS check)
   */
  static async testCORS(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('[ImageProcessor] No canvas context available');
        resolve(false);
        return;
      }
      
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        console.error('[ImageProcessor] CORS test timeout');
        resolve(false);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        try {
          canvas.width = 10;
          canvas.height = 10;
          ctx.drawImage(img, 0, 0, 10, 10);
          
          // Try to get data - will throw if tainted
          canvas.toDataURL();
          console.log('[ImageProcessor] CORS test passed for:', imageUrl.substring(0, 50));
          resolve(true);
        } catch (e) {
          console.error('[ImageProcessor] CORS test failed - canvas tainted');
          resolve(false);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error('[ImageProcessor] CORS test failed - image load error');
        resolve(false);
      };
      
      img.src = imageUrl;
    });
  }
  
  /**
   * Process image with proper error handling
   */
  static async processImage(options: ProcessingOptions): Promise<ProcessingResult> {
    const startTime = Date.now();
    const result: ProcessingResult = {
      success: false,
      url: null,
      error: null,
      platform: options.platform
    };
    
    console.log('[ImageProcessor] ==========================================');
    console.log('[ImageProcessor] Starting processing for platform:', options.platform);
    console.log('[ImageProcessor] Image URL:', options.imageUrl?.substring(0, 100));
    console.log('[ImageProcessor] Enhancement type:', options.enhancement);
    console.log('[ImageProcessor] Overlays:', JSON.stringify(options.overlays));
    
    // First test CORS
    console.log('[ImageProcessor] Testing CORS...');
    const corsOk = await this.testCORS(options.imageUrl);
    console.log('[ImageProcessor] CORS test result:', corsOk);
    
    if (!corsOk) {
      console.error('[ImageProcessor] CORS check failed, will try proxy method');
      result.error = 'CORS_BLOCKED';
      return result;
    }
    
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        result.error = 'NO_CANVAS_CONTEXT';
        resolve(result);
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        console.error('[ImageProcessor] Processing timeout');
        result.error = 'TIMEOUT';
        resolve(result);
      }, 10000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('[ImageProcessor] Image loaded successfully');
        console.log('[ImageProcessor] Image dimensions:', img.width, 'x', img.height);
        
        try {
          // Set canvas size based on platform
          const dimensions = this.getPlatformDimensions(options.platform);
          console.log('[ImageProcessor] Target dimensions for', options.platform, ':', dimensions);
          
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          console.log('[ImageProcessor] Canvas size set to:', canvas.width, 'x', canvas.height);
          
          // Apply enhancement filters (use AI-generated or default)
          const filter = options.customFilters 
            ? this.buildFilterFromParams(options.customFilters)
            : this.getEnhancementFilter(options.enhancement);
          ctx.filter = filter;
          console.log('[ImageProcessor] Applied filter:', ctx.filter);
          console.log('[ImageProcessor] Using:', options.customFilters ? 'AI-generated filters' : 'default filters');
          
          // Draw image with cover fit
          console.log('[ImageProcessor] Drawing image to canvas...');
          this.drawImageCover(ctx, img, dimensions);
          console.log('[ImageProcessor] Image drawn to canvas');
          
          // Test if canvas is tainted after drawing
          try {
            const testData = canvas.toDataURL().substring(0, 50);
            console.log('[ImageProcessor] Canvas not tainted, data URL starts with:', testData);
          } catch (e) {
            console.error('[ImageProcessor] Canvas tainted after drawing');
            result.error = 'CANVAS_TAINTED';
            resolve(result);
            return;
          }
          
          // Reset filter for overlays
          ctx.filter = 'none';
          console.log('[ImageProcessor] Reset filter for overlays');
          
          // Add overlays
          console.log('[ImageProcessor] Adding overlays...');
          this.addOverlays(ctx, options.overlays, options.platform, dimensions);
          console.log('[ImageProcessor] Overlays added');
          
          // Convert to blob URL
          console.log('[ImageProcessor] Converting to blob...');
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const elapsed = Date.now() - startTime;
              console.log('[ImageProcessor] ✅ Successfully created enhanced image');
              console.log('[ImageProcessor] Blob URL:', url.substring(0, 50));
              console.log('[ImageProcessor] Processing time:', elapsed, 'ms');
              console.log('[ImageProcessor] Blob size:', blob.size, 'bytes');
              result.success = true;
              result.url = url;
              resolve(result);
            } else {
              console.error('[ImageProcessor] Failed to create blob');
              result.error = 'BLOB_CREATION_FAILED';
              resolve(result);
            }
          }, 'image/jpeg', 0.85);
        } catch (error) {
          console.error('[ImageProcessor] Processing error:', error);
          result.error = 'PROCESSING_ERROR';
          resolve(result);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error('[ImageProcessor] Failed to load image');
        result.error = 'IMAGE_LOAD_FAILED';
        resolve(result);
      };
      
      img.src = options.imageUrl;
    });
  }
  
  static getPlatformDimensions(platform: string): PlatformDimensions {
    const dimensions: Record<string, PlatformDimensions> = {
      mls: { width: 1024, height: 768 },
      instagram: { width: 1080, height: 1080 },
      instagram_story: { width: 1080, height: 1920 },
      facebook: { width: 1200, height: 630 },
      email: { width: 600, height: 400 }
    };
    return dimensions[platform] || dimensions.mls;
  }
  
  static getEnhancementFilter(enhancement: string): string {
    const filters: Record<string, string> = {
      brightness: 'brightness(115%) contrast(110%) saturate(110%)',
      twilight: 'brightness(95%) contrast(120%) saturate(130%) sepia(20%) hue-rotate(-10deg)',
      sky: 'brightness(110%) contrast(105%) saturate(120%)',
      staging: 'brightness(105%) contrast(105%) saturate(105%)',
      seasonal: 'brightness(110%) contrast(110%) saturate(90%) hue-rotate(30deg)'
    };
    return filters[enhancement] || filters.brightness;
  }
  
  static buildFilterFromParams(params: any): string {
    const filters = [];
    
    // Convert AI parameters to CSS filters
    if (params.brightness !== undefined && params.brightness !== 1) {
      filters.push(`brightness(${params.brightness * 100}%)`);
    }
    if (params.contrast !== undefined && params.contrast !== 1) {
      filters.push(`contrast(${params.contrast * 100}%)`);
    }
    if (params.saturation !== undefined && params.saturation !== 1) {
      filters.push(`saturate(${params.saturation * 100}%)`);
    }
    if (params.temperature !== undefined && params.temperature !== 0) {
      // Temperature affects hue
      const hueShift = params.temperature * 2; // Scale temperature to hue degrees
      filters.push(`hue-rotate(${hueShift}deg)`);
    }
    if (params.tint !== undefined && params.tint !== 0) {
      // Tint can be simulated with sepia
      const sepiaAmount = Math.abs(params.tint) / 100;
      if (sepiaAmount > 0) filters.push(`sepia(${sepiaAmount})`);
    }
    
    // If no filters specified, use default
    if (filters.length === 0) {
      return 'brightness(115%) contrast(110%) saturate(110%)';
    }
    
    console.log('[ImageProcessor] Built filter from AI params:', filters.join(' '));
    return filters.join(' ');
  }
  
  static drawImageCover(
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    dimensions: PlatformDimensions
  ): void {
    // Calculate scale to cover entire canvas
    const scale = Math.max(dimensions.width / img.width, dimensions.height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Center the image
    const x = (dimensions.width - scaledWidth) / 2;
    const y = (dimensions.height - scaledHeight) / 2;
    
    // Draw the image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  }
  
  static addOverlays(
    ctx: CanvasRenderingContext2D, 
    overlays: any, 
    platform: string, 
    dimensions: PlatformDimensions
  ): void {
    // Add gradient overlay for text readability
    if (overlays.badge || overlays.price) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, 200);
      
      // Bottom gradient for price
      const bottomGradient = ctx.createLinearGradient(0, dimensions.height - 150, 0, dimensions.height);
      bottomGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
      bottomGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(0, dimensions.height - 150, dimensions.width, 150);
    }
    
    // Add "JUST LISTED" badge
    if (overlays.badge) {
      // Badge background
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Create rounded rectangle for badge
      const badgeX = 30;
      const badgeY = 30;
      const badgeWidth = 200;
      const badgeHeight = 50;
      const borderRadius = 10;
      
      ctx.beginPath();
      ctx.moveTo(badgeX + borderRadius, badgeY);
      ctx.lineTo(badgeX + badgeWidth - borderRadius, badgeY);
      ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + borderRadius);
      ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - borderRadius);
      ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - borderRadius, badgeY + badgeHeight);
      ctx.lineTo(badgeX + borderRadius, badgeY + badgeHeight);
      ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - borderRadius);
      ctx.lineTo(badgeX, badgeY + borderRadius);
      ctx.quadraticCurveTo(badgeX, badgeY, badgeX + borderRadius, badgeY);
      ctx.closePath();
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Badge text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(overlays.badge, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
    }
    
    // Add price and details at bottom
    if (overlays.price) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(overlays.price, 30, dimensions.height - 60);
      
      if (overlays.bedsBaths) {
        ctx.font = '24px system-ui, -apple-system, sans-serif';
        ctx.fillText(overlays.bedsBaths, 30, dimensions.height - 25);
      }
    }
    
    // Platform-specific overlays
    if (platform === 'instagram') {
      // Add Instagram-style gradient overlay
      const igGradient = ctx.createRadialGradient(
        dimensions.width / 2, dimensions.height / 2, 0,
        dimensions.width / 2, dimensions.height / 2, dimensions.width / 2
      );
      igGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      igGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
      ctx.fillStyle = igGradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Add "Swipe for more" indicator
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(dimensions.width - 220, dimensions.height - 70, 200, 50);
      
      ctx.fillStyle = 'white';
      ctx.font = '18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Swipe for more →', dimensions.width - 120, dimensions.height - 45);
    }
    
    if (platform === 'mls') {
      // Add professional watermark/branding
      if (overlays.agentInfo?.name) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(overlays.agentInfo.name, dimensions.width - 20, dimensions.height - 20);
        
        if (overlays.agentInfo.phone) {
          ctx.fillText(overlays.agentInfo.phone, dimensions.width - 20, dimensions.height - 40);
        }
      }
    }
    
    if (platform === 'facebook') {
      // Add call-to-action button style
      ctx.fillStyle = '#1877f2'; // Facebook blue
      ctx.fillRect(dimensions.width - 250, dimensions.height - 90, 220, 60);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Learn More', dimensions.width - 140, dimensions.height - 60);
    }
  }
  
  /**
   * Process image through proxy to bypass CORS
   */
  static async processImageWithProxy(options: ProcessingOptions): Promise<ProcessingResult> {
    const result: ProcessingResult = {
      success: false,
      url: null,
      error: null,
      platform: options.platform
    };
    
    try {
      console.log('[ImageProcessor] Attempting proxy method for:', options.platform);
      
      // Use proxy endpoint to fetch image
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(options.imageUrl)}`;
      
      // Now process the proxied image
      const proxiedOptions = { ...options, imageUrl: proxyUrl };
      return await this.processImage(proxiedOptions);
      
    } catch (error) {
      console.error('[ImageProcessor] Proxy processing failed:', error);
      result.error = 'PROXY_FAILED';
      return result;
    }
  }
  
  /**
   * Main entry point - tries direct processing, then proxy if needed
   */
  static async processImageSmart(options: ProcessingOptions): Promise<ProcessingResult> {
    console.log('[ImageProcessor] Smart processing for:', options.platform);
    
    // First try direct processing
    const directResult = await this.processImage(options);
    
    if (directResult.success) {
      console.log('[ImageProcessor] Direct processing succeeded');
      return directResult;
    }
    
    // If CORS blocked, try proxy
    if (directResult.error === 'CORS_BLOCKED' || directResult.error === 'CANVAS_TAINTED') {
      console.log('[ImageProcessor] Direct failed with CORS, trying proxy');
      return await this.processImageWithProxy(options);
    }
    
    // For other errors, return the direct result
    return directResult;
  }
  
  /**
   * Generate a data URL instead of blob URL for more compatibility
   */
  static async processImageToDataURL(options: ProcessingOptions): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(options.imageUrl);
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const dimensions = this.getPlatformDimensions(options.platform);
          canvas.width = dimensions.width;
          canvas.height = dimensions.height;
          
          ctx.filter = this.getEnhancementFilter(options.enhancement);
          this.drawImageCover(ctx, img, dimensions);
          ctx.filter = 'none';
          this.addOverlays(ctx, options.overlays, options.platform, dimensions);
          
          // Return data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        } catch (error) {
          console.error('[ImageProcessor] Processing error:', error);
          resolve(options.imageUrl);
        }
      };
      
      img.onerror = () => resolve(options.imageUrl);
      img.src = options.imageUrl;
    });
  }
}