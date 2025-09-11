// ============================================================================
// UTILS.JS - Constants and Utility Functions
// ============================================================================

// Application Configuration Constants
const CONFIG = {
    // Scene Configuration
    SCENE: {
        FOG_COLOR: 0x000033,
        FOG_NEAR: 100,
        FOG_FAR: 500,
        BACKGROUND_COLOR: 0x000033
    },

    // Camera Configuration
    CAMERA: {
        FOV: 75,
        ASPECT: window.innerWidth / window.innerHeight,
        NEAR: 0.1,
        FAR: 1000,
        INITIAL_POSITION: { x: 0, y: 0, z: 5 }
    },

    // Renderer Configuration
    RENDERER: {
        ALPHA: true,
        ANTIALIAS: true,
        PRESERVE_DRAWING_BUFFER: true,
        SHADOW_MAP_ENABLED: true,
        SHADOW_MAP_TYPE: 'PCFSoftShadowMap'
    },

    // Animation Configuration
    ANIMATION: {
        LOGO_ROTATION_SPEED: 0.005,
        TARGET_FPS: 60
    },

    // AWS Logo Glass Pane Configuration
    GLASS_PANE: {
        WIDTH: 4,
        HEIGHT: 2,
        MATERIAL: {
            TRANSMISSION: 0.9,
            OPACITY: 1,
            METALNESS: 0,
            ROUGHNESS: 0.1,
            IOR: 1.5,
            THICKNESS: 0.5,
            CLEARCOAT: 1,
            CLEARCOAT_ROUGHNESS: 0,
            SIDE: 'DoubleSide'
        }
    },

    // Stock Display Configuration
    STOCK_DISPLAY: {
        TEXT: 'AMZN: $230.34 USD',
        POSITION: { x: 0, y: -2.5, z: 0 },
        FONT_SIZE: 0.3,
        COLOR: 0xFFFFFF
    },

    // Shooting Stars Configuration
    SHOOTING_STARS: {
        PARTICLE_COUNT: 100,
        SPAWN_AREA: {
            WIDTH: 100,
            HEIGHT: 20,
            MIN_Y: 10,
            Z_RANGE: 50
        },
        SPEED_RANGE: { min: 0.5, max: 1.5 },
        MATERIAL: {
            COLOR: 0xFFFFFF,
            SIZE: 2,
            BLENDING: 'AdditiveBlending'
        },
        FADE_RATE: 0.98
    },

    // Vaporwave Lines Configuration
    VAPORWAVE: {
        MAX_LINES: 20,
        SPAWN_RATE: 0.1,
        LINE_WIDTH: 0.3, // FIXED: Base width - will be scaled by perspective
        LINE_HEIGHT: 1.5, // FIXED: Reduced height by half as requested
        LIFETIME_RANGE: { min: 3000, max: 6000 },
        SPAWN_AREA: {
            X_RANGE: 20, // Wider spread for better distribution
            Z_POSITION: 3, // Position between main camera (Z=5) and AWS logo (Z=0) as per FR-006
            Z_RANGE: 6 // FIXED: Larger depth range (Z=0 to Z=6) for proper foreground/background distribution
        },
        COLORS: [
            0xFF00FF, // Magenta (vaporwave aesthetic)
            0x00FFFF, // Cyan (vaporwave aesthetic)
            0x0080FF, // Electric blue (vaporwave aesthetic)
            0xFF0080, // Hot pink
            0x8000FF  // Purple
        ],
        ALPHA_RANGE: { min: 0.6, max: 0.9 },
        // FIXED: Perspective scaling configuration (FR-013, TC-010, TC-011)
        PERSPECTIVE: {
            NEAR_PLANE: 0.5, // Increased for less aggressive scaling
            MAX_HEIGHT_RATIO: 0.33, // FR-014: max 33% screen height for closest lines
            SCALE_FACTOR_FORMULA: 'nearPlane / (nearPlane + zDepth)', // TC-010 scaling formula
            MIN_SCALE: 0.3, // Increased minimum scale for better visibility
            MAX_SCALE: 3.0  // Increased maximum scale for more prominence
        }
    },

    // Background Configuration
    BACKGROUND: {
        POSITION: { x: 0, y: 0, z: -100 },
        SCALE: { x: 200, y: 113, z: 1 }, // Will be dynamically calculated
        TEXTURE_PATH: 'assets/desert-night.png',
        // Original image dimensions for aspect ratio calculation
        ORIGINAL_WIDTH: 1920,
        ORIGINAL_HEIGHT: 1088
    },

    // OrbitControls Configuration
    CONTROLS: {
        ENABLE_DAMPING: true,
        DAMPING_FACTOR: 0.05,
        ENABLE_PAN: true,
        ENABLE_ROTATE: true,
        ENABLE_ZOOM: true,
        MIN_DISTANCE: 2,
        MAX_DISTANCE: 20,
        MIN_POLAR_ANGLE: 0,
        MAX_POLAR_ANGLE: Math.PI,
        ROTATE_SPEED: 1.0,
        ZOOM_SPEED: 1.0,
        PAN_SPEED: 1.0
    },

    // Asset Paths
    ASSETS: {
        AWS_LOGO: 'assets/aws-logo.png',
        BACKGROUND: 'assets/desert-night.png'
    }
};

// Utility Functions
const Utils = {
    
    /**
     * Load a texture with error handling
     * @param {string} url - Path to texture image
     * @param {function} onLoad - Success callback
     * @param {function} onError - Error callback
     * @returns {THREE.Texture}
     */
    loadTexture: function(url, onLoad, onError) {
        const loader = new THREE.TextureLoader();
        
        return loader.load(
            url,
            function(texture) {
                console.log(`✓ Texture loaded: ${url}`);
                if (onLoad) onLoad(texture);
            },
            function(progress) {
                console.log(`Loading texture: ${url} - ${Math.round((progress.loaded / progress.total) * 100)}%`);
            },
            function(error) {
                console.error(`✗ Error loading texture: ${url}`, error);
                if (onError) onError(error);
            }
        );
    },

    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    randomBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Generate random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} Angle in radians
     */
    degToRad: function(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Convert radians to degrees
     * @param {number} radians - Angle in radians
     * @returns {number} Angle in degrees
     */
    radToDeg: function(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Linear interpolation between two values
     * @param {number} a - Start value
     * @param {number} b - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number}
     */
    lerp: function(a, b, t) {
        return a + (b - a) * t;
    },

    /**
     * Check if device supports WebGL
     * @returns {boolean}
     */
    isWebGLSupported: function() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    },

    /**
     * Get random color from vaporwave palette
     * @returns {number} Color as hex number
     */
    getRandomVaporwaveColor: function() {
        const colors = CONFIG.VAPORWAVE.COLORS;
        return colors[Math.floor(Math.random() * colors.length)];
    },

    /**
     * Handle window resize events
     * @param {THREE.Camera} camera - Three.js camera
     * @param {THREE.WebGLRenderer} renderer - Three.js renderer
     */
    handleResize: function(camera, renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    },

    /**
     * Create a simple text geometry for stock display
     * @param {string} text - Text to display
     * @param {number} size - Font size
     * @returns {THREE.Group} Group containing text meshes
     */
    createTextDisplay: function(text, size = 0.3) {
        const group = new THREE.Group();
        
        // For simplicity, we'll create individual planes for each character
        // In a production app, you might use TextGeometry or CSS2DRenderer
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 512;
        canvas.height = 128;
        
        // Configure text styling
        context.fillStyle = '#FFFFFF';
        context.font = '48px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Draw text
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        // Create material and geometry
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1
        });
        
        const geometry = new THREE.PlaneGeometry(4, 1);
        const mesh = new THREE.Mesh(geometry, material);
        
        group.add(mesh);
        return group;
    },

    /**
     * Performance monitoring utility
     */
    performance: {
        lastTime: performance.now(),
        frameCount: 0,
        fps: 0,

        update: function() {
            const currentTime = performance.now();
            this.frameCount++;
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
            }
        },

        getFPS: function() {
            return this.fps;
        }
    },

    /**
     * Debug logging utility
     */
    debug: {
        enabled: false,

        log: function(message, ...args) {
            if (this.enabled) {
                console.log(`[DEBUG] ${message}`, ...args);
            }
        },

        warn: function(message, ...args) {
            if (this.enabled) {
                console.warn(`[DEBUG] ${message}`, ...args);
            }
        },

        error: function(message, ...args) {
            console.error(`[DEBUG] ${message}`, ...args);
        }
    },

    /**
     * Calculate background plane dimensions that properly cover the viewport
     * @param {THREE.Camera} camera - The camera to calculate for
     * @param {number} distance - Distance from camera to background plane
     * @param {number} imageAspectRatio - Aspect ratio of the background image
     * @returns {object} Object with width and height for the background plane
     */
    calculateBackgroundScale: function(camera, distance, imageAspectRatio) {
        // Calculate the visible height at the background distance
        const vFOV = camera.fov * Math.PI / 180; // Convert to radians
        const visibleHeight = 2 * Math.tan(vFOV / 2) * Math.abs(distance);
        const visibleWidth = visibleHeight * camera.aspect;
        
        // Calculate scaling to ensure the background covers the entire viewport
        // We want to cover the viewport completely, so we scale to the larger dimension
        const scaleByWidth = visibleWidth / (visibleHeight * imageAspectRatio);
        const scaleByHeight = visibleHeight / (visibleWidth / imageAspectRatio);
        
        let finalWidth, finalHeight;
        
        if (scaleByWidth >= 1) {
            // Scale by width (image is taller relative to viewport)
            finalWidth = visibleWidth;
            finalHeight = visibleWidth / imageAspectRatio;
        } else {
            // Scale by height (image is wider relative to viewport)
            finalHeight = visibleHeight;
            finalWidth = visibleHeight * imageAspectRatio;
        }
        
        // Add a small margin to ensure no gaps
        const margin = 1.05;
        finalWidth *= margin;
        finalHeight *= margin;
        
        return { width: finalWidth, height: finalHeight };
    }
};

// WebGL capability detection
if (!Utils.isWebGLSupported()) {
    console.error('WebGL is not supported in this browser!');
    document.addEventListener('DOMContentLoaded', function() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.textContent = 'WebGL not supported in this browser!';
            loading.style.color = '#FF0000';
        }
    });
}

// Export for global access
window.CONFIG = CONFIG;
window.Utils = Utils;

console.log('✓ Utils.js loaded successfully');