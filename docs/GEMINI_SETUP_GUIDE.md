# Gemini API Setup Guide for Hero Image Generation

## Quick Start (5 Minutes)

### Step 1: Get Gemini API Access

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/
   - Sign in with your Google account
   - Click "Get API Key"

2. **Generate API Key**
   ```
   1. Click "Create API Key"
   2. Select or create a Google Cloud Project
   3. Copy your API key
   ```

3. **Add to Environment**
   ```bash
   # Copy the example file
   cp .env.gemini.example .env.local
   
   # Edit .env.local and add your key:
   GEMINI_API_KEY=your-key-here
   IMAGE_PROVIDER=gemini
   ```

### Step 2: Install Dependencies

```bash
npm install @google/generative-ai
```

### Step 3: Test the Integration

```bash
# Run the test script
node test-gemini-integration.js
```

## Advanced Setup (For Production)

### 1. Google Cloud Project Setup

```bash
# Install Google Cloud CLI
# Visit: https://cloud.google.com/sdk/docs/install

# Initialize gcloud
gcloud init

# Create a new project
gcloud projects create realtor-kit-images

# Set as default
gcloud config set project realtor-kit-images

# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable generativelanguage.googleapis.com
```

### 2. Service Account (More Secure)

```bash
# Create service account
gcloud iam service-accounts create realtor-kit-gemini \
  --display-name="RealtorKit Gemini Service"

# Grant permissions
gcloud projects add-iam-policy-binding realtor-kit-images \
  --member="serviceAccount:realtor-kit-gemini@realtor-kit-images.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Download credentials
gcloud iam service-accounts keys create \
  ./credentials/gemini-service-account.json \
  --iam-account=realtor-kit-gemini@realtor-kit-images.iam.gserviceaccount.com

# Add to .env.local
GOOGLE_APPLICATION_CREDENTIALS=./credentials/gemini-service-account.json
```

### 3. Vertex AI Setup (For Imagen 3)

```bash
# Enable Vertex AI
gcloud services enable vertex.googleapis.com

# Create Vertex AI endpoint
gcloud ai endpoints create \
  --region=us-central1 \
  --display-name=realtor-kit-imagen
```

## Configuration Options

### Basic Configuration (.env.local)

```env
# Required
GEMINI_API_KEY=AIza...your-key
IMAGE_PROVIDER=gemini

# Optional - Defaults shown
GEMINI_VISION_MODEL=gemini-1.5-pro        # For analysis
GEMINI_GENERATION_MODEL=imagen-3          # For generation
GEMINI_IMAGE_QUALITY=hd                   # standard or hd
GEMINI_DEFAULT_ASPECT_RATIO=16:9          # 1:1, 4:3, 16:9, 9:16
GEMINI_SAFETY_LEVEL=medium                # low, medium, high
```

### Advanced Configuration

```env
# Rate Limiting
GEMINI_MAX_REQUESTS_PER_MINUTE=60
GEMINI_MAX_CONCURRENT_REQUESTS=5
GEMINI_RETRY_ATTEMPTS=3
GEMINI_RETRY_DELAY_MS=1000

# Cost Control
GEMINI_MONTHLY_BUDGET_USD=50
GEMINI_ALERT_AT_PERCENTAGE=80
GEMINI_COST_PER_IMAGE=0.002

# Caching
GEMINI_CACHE_TTL_SECONDS=3600
GEMINI_CACHE_ENABLED=true

# Monitoring
GEMINI_LOG_LEVEL=info  # error, warn, info, debug
GEMINI_METRICS_ENABLED=true
```

## Testing Your Setup

### 1. Test API Connection

```javascript
// test-gemini-connection.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello, Gemini!");
    console.log('✅ Gemini API connected successfully');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

### 2. Test Image Analysis

```javascript
// test-gemini-vision.js
async function testVision() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const imageParts = [
    {
      inlineData: {
        data: base64ImageData,
        mimeType: "image/jpeg"
      }
    }
  ];
  
  const result = await model.generateContent([
    "Analyze this real estate photo",
    ...imageParts
  ]);
  
  console.log('Analysis:', result.response.text());
}
```

## Pricing & Quotas

### Free Tier (AI Studio)
- **60 requests per minute**
- **32,000 tokens per minute**
- **1,500 requests per day**
- Perfect for development and testing

### Paid Tier (Google Cloud)
- **Analysis**: $0.00025 per image
- **Generation**: $0.002 per 1024x1024 image
- **Editing**: $0.001 per operation
- **Storage**: First 5GB free

### Cost Examples
```
Monthly Usage (Starter Plan):
- 100 photo analyses: $0.025
- 500 image generations: $1.00
- Total: ~$1.03/month

Monthly Usage (Professional Plan):
- 500 photo analyses: $0.125
- 2000 image generations: $4.00
- Total: ~$4.13/month
```

## Troubleshooting

### Common Issues

1. **"API key not valid"**
   ```bash
   # Check your key is correct
   echo $GEMINI_API_KEY
   
   # Ensure it's in .env.local
   cat .env.local | grep GEMINI_API_KEY
   ```

2. **"Quota exceeded"**
   ```javascript
   // Implement rate limiting
   const rateLimiter = {
     requests: 0,
     resetTime: Date.now() + 60000,
     
     async checkLimit() {
       if (Date.now() > this.resetTime) {
         this.requests = 0;
         this.resetTime = Date.now() + 60000;
       }
       
       if (this.requests >= 60) {
         const waitTime = this.resetTime - Date.now();
         await new Promise(resolve => setTimeout(resolve, waitTime));
       }
       
       this.requests++;
     }
   };
   ```

3. **"Model not found"**
   ```bash
   # Check available models
   gcloud ai models list --region=us-central1
   
   # Use correct model name
   GEMINI_VISION_MODEL=gemini-1.5-pro
   ```

## Security Best Practices

1. **Never commit API keys**
   ```bash
   # Add to .gitignore
   echo ".env.local" >> .gitignore
   echo "credentials/" >> .gitignore
   ```

2. **Use environment variables**
   ```javascript
   // Good
   const apiKey = process.env.GEMINI_API_KEY;
   
   // Bad
   const apiKey = "AIza...hardcoded";
   ```

3. **Implement rate limiting**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const geminiLimiter = rateLimit({
     windowMs: 60 * 1000, // 1 minute
     max: 60, // Gemini's limit
     message: 'Too many requests'
   });
   
   app.use('/api/hero-image', geminiLimiter);
   ```

4. **Monitor usage**
   ```javascript
   // Track API usage
   const usage = {
     daily: 0,
     monthly: 0,
     cost: 0,
     
     track(operation) {
       this.daily++;
       this.monthly++;
       this.cost += getCost(operation);
       
       if (this.cost > BUDGET_LIMIT) {
         notifyAdmin('Budget exceeded');
       }
     }
   };
   ```

## Migration from DALL-E

### Quick Switch
```javascript
// lib/features/heroImage/config.ts
export const HERO_IMAGE_CONFIG = {
  provider: 'gemini', // Change from 'openai' to 'gemini'
  // Rest of config remains the same
};
```

### API Differences
| DALL-E | Gemini |
|--------|--------|
| `openai.images.generate()` | `model.generateContent()` |
| `prompt` only | `prompt` + `negativePrompt` |
| `n` for count | `numImages` for count |
| `size` | `aspectRatio` |

## Support & Resources

- **Documentation**: https://ai.google.dev/docs
- **API Reference**: https://ai.google.dev/api/rest
- **Pricing**: https://ai.google.dev/pricing
- **Discord**: https://discord.gg/google-ai
- **Stack Overflow**: Tag with `google-gemini-api`

## Next Steps

1. ✅ Get API key
2. ✅ Add to .env.local
3. ✅ Test connection
4. 🚀 Start generating hero images!

The Gemini integration is now ready to use. Simply toggle `IMAGE_PROVIDER=gemini` in your `.env.local` file to switch from DALL-E to Gemini.