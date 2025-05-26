# Phase 1: Asset Generation and Collection

This phase focuses on gathering the necessary assets for the WebGL AWS Logo Rotation application, specifically:
1. Generating the desert background image with colorful supernatural vegetation
2. Fetching the current AMZN stock value

## 1. Background Image Generation

### Requirements
- Desert landscape with colorful supernatural vegetation
- Resolution suitable for a web background (suggested 1920x1080)
- Format: PNG or JPEG

### Implementation Plan
We will use the Nova Canvas MCP server to generate the background image:

```javascript
// Implementation step 1: Use Nova Canvas to generate a desert background
const prompt = "Wide desert landscape with vibrant, colorful supernatural plants and vegetation, surreal digital art style, suitable as a website background, high definition";
const negativePrompt = "people, anatomy, hands, low quality, low resolution, low detail";

// Nova Canvas generation parameters
const params = {
  width: 1920,
  height: 1080,
  quality: "premium",
  cfg_scale: 7.5,
  seed: null, // Let it generate randomly for creative results
  number_of_images: 1,
  workspace_dir: "/home/jcjorel/demo/webgl" // Current working directory
};

// The image will be saved to the current working directory
// Expected output file: desert_background.png
```

### Expected Outcome
A high-quality background image that:
- Depicts a desert landscape with colorful supernatural vegetation
- Has appropriate dimensions for a web background
- Contains no human figures or low-quality elements
- Serves as an aesthetically pleasing backdrop for the rotating AWS logo

### Storage
The generated image will be saved in the project root directory as `desert_background.png` and will be referenced in the HTML/CSS.

## 2. AMZN Stock Value Fetching

### Requirements
- Current AMZN stock value in USD
- Format: numerical value with dollar sign (e.g., "$185.42")

### Implementation Plan
We will use the Perplexity MCP server to fetch the current AMZN stock value:

```javascript
// Implementation step 2: Use Perplexity to fetch current AMZN stock value
const query = "What is the current Amazon (AMZN) stock price in USD? Just provide the numerical value with $ sign.";
const recency = "day"; // Ensure we get the most recent stock value

// Expected response will contain the current stock value that we can parse
// The parsed value will be hardcoded into our application
```

### Expected Outcome
A current AMZN stock value in the format "$XXX.XX" that will be:
- Accurate as of the implementation date
- Displayed in the 3D scene
- Rotating along with the AWS logo

### Storage
The fetched stock value will be hardcoded into the JavaScript code as a constant:

```javascript
const AMZN_STOCK_VALUE = "$XXX.XX"; // Value from Perplexity MCP
```

## Success Criteria for Phase 1

1. ✅ Background image successfully generated and saved to project directory
2. ✅ Image meets requirements (desert theme, supernatural vegetation, appropriate resolution)
3. ✅ AMZN stock value successfully fetched and formatted
4. ✅ Both assets ready for integration into the WebGL application

## Next Steps

After completing this phase:
1. Update the progress tracking in `plan_progress.md`
2. Proceed to Phase 2: Application Structure Setup
3. Make the generated assets available to the application structure
