# Phase 2: Application Structure Setup

This phase focuses on establishing the basic structure of the WebGL application, including:
1. Creating the HTML file structure
2. Setting up Three.js boilerplate
3. Configuring the WebGL scene

## 1. HTML File Structure

### Requirements
- Single HTML file (`index.html`)
- Responsive design that works well in Chrome
- Proper metadata and viewport settings
- Links to required external libraries (Three.js)
- Embedded CSS for styling
- JavaScript either embedded or linked separately

### Implementation Plan

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Logo 3D Rotation</title>
    
    <!-- Three.js library from CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    
    <!-- OrbitControls for mouse interaction -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    
    <style>
        /* CSS will go here */
        body {
            margin: 0;
            overflow: hidden; /* No scrollbars */
            font-family: Arial, sans-serif;
        }
        
        canvas {
            display: block; /* Remove default canvas inline display */
        }
        
        #info {
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
            color: white;
            font-size: 14px;
            z-index: 100;
            pointer-events: none; /* Allow click-through */
        }
    </style>
</head>
<body>
    <!-- WebGL canvas will be created by Three.js -->
    
    <!-- Optional info div for debugging or additional information -->
    <div id="info"></div>
    
    <script>
        // JavaScript code will go here or be included from an external file
    </script>
</body>
</html>
```

### Expected Outcome
A well-structured HTML file that:
- Loads Three.js and required dependencies
- Has appropriate styling for fullscreen WebGL content
- Provides a container for the 3D scene
- Is ready for JavaScript implementation

## 2. Three.js Boilerplate

### Requirements
- Initialize Three.js scene, camera, and renderer
- Set up responsive canvas sizing
- Create the animation loop
- Handle window resize events
- Prepare for asset loading

### Implementation Plan

```javascript
// Global Three.js variables
let scene, camera, renderer;
let controls;
let clock = new THREE.Clock();

// Setup function to initialize the Three.js environment
function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,                                     // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1,                                    // Near clipping plane
        1000                                    // Far clipping plane
    );
    camera.position.z = 5; // Position camera
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000); // Black background by default (will be replaced with image)
    document.body.appendChild(renderer.domElement);
    
    // Add OrbitControls for mouse interaction
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add smooth damping effect
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Load assets and add objects to the scene
    loadAssets();
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Asset loading function (placeholder)
function loadAssets() {
    // This will be implemented in Phase 3
    // It will load the AWS logo texture and create the 3D object
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update any animations
    // (This will be expanded in Phase 3)
    
    // Render the scene
    renderer.render(scene, camera);
}

// Start the application
init();
animate();
```

### Expected Outcome
A solid Three.js boilerplate that:
- Creates the core Three.js objects (scene, camera, renderer)
- Handles window resizing for responsive design
- Sets up OrbitControls for mouse interaction
- Implements a standard animation loop
- Prepares placeholders for asset loading
- Is ready for specific 3D object creation and animation

## 3. WebGL Scene Configuration

### Requirements
- Configure the scene with appropriate lighting
- Prepare for background image implementation
- Set up initial camera position and controls limits
- Configure renderer settings for optimal performance

### Implementation Plan

```javascript
// Scene configuration function (to be called from within init())
function configureScene() {
    // Add ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Configure renderer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Smoother shadows
    
    // Configure controls
    controls.enablePan = false; // Disable panning
    controls.minDistance = 3; // Minimum zoom distance
    controls.maxDistance = 10; // Maximum zoom distance
    
    // Prepare for background image (will be loaded in Phase 3)
    // scene.background = new THREE.Color(0x3a3a3a); // Temporary gray background
}
```

### Expected Outcome
A well-configured Three.js scene that:
- Has appropriate lighting for good 3D visualization
- Has control limits to prevent user navigation issues
- Has optimized rendering settings
- Is prepared for background image implementation
- Is ready for 3D object creation and animation

## Success Criteria for Phase 2

1. ✅ HTML structure created with proper viewport settings
2. ✅ Three.js library and dependencies loaded successfully
3. ✅ CSS styling in place for fullscreen application
4. ✅ Three.js scene, camera, and renderer initialized
5. ✅ Animation loop and resize handling implemented
6. ✅ Scene configured with appropriate lighting and settings
7. ✅ All code is validated and free of syntax errors

## Next Steps

After completing this phase:
1. Update the progress tracking in `plan_progress.md`
2. Proceed to Phase 3: Core Functionality Implementation
3. Integrate the scene structure with the assets generated in Phase 1
