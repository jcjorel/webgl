// ============================================================================
// MANAGERS.JS - Scene, Animation, and Controls Management
// ============================================================================

/**
 * SceneManager - Handles Three.js scene, camera, and renderer setup
 */
class SceneManager {
    constructor() {
        // Main scene for AWS logo and stock display (affected by OrbitControls)
        this.scene = null;
        this.camera = null;
        
        // Fixed background scene (not affected by controls)
        this.backgroundScene = null;
        this.backgroundCamera = null;
        
        // Fixed independent scene for shooting stars and vaporwave (not affected by controls)
        this.independentScene = null;
        this.independentCamera = null;
        
        this.renderer = null;
        this.canvasContainer = null;
    }

    /**
     * Initialize the Three.js scene, camera, and renderer
     */
    async init() {
        try {
            // Get canvas container
            this.canvasContainer = document.getElementById('canvas-container');
            if (!this.canvasContainer) {
                throw new Error('Canvas container not found');
            }

            // Create main scene for logo and stock (affected by OrbitControls)
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(
                CONFIG.SCENE.FOG_COLOR,
                CONFIG.SCENE.FOG_NEAR,
                CONFIG.SCENE.FOG_FAR
            );

            // Create background scene (fixed, not affected by controls)
            this.backgroundScene = new THREE.Scene();
            
            // Create independent scene for shooting stars and vaporwave (fixed, not affected by controls)
            this.independentScene = new THREE.Scene();

            // Create main camera (controlled by OrbitControls)
            this.camera = new THREE.PerspectiveCamera(
                CONFIG.CAMERA.FOV,
                CONFIG.CAMERA.ASPECT,
                CONFIG.CAMERA.NEAR,
                CONFIG.CAMERA.FAR
            );
            
            this.camera.position.set(
                CONFIG.CAMERA.INITIAL_POSITION.x,
                CONFIG.CAMERA.INITIAL_POSITION.y,
                CONFIG.CAMERA.INITIAL_POSITION.z
            );
            
            // Create fixed background camera (never moves)
            this.backgroundCamera = new THREE.PerspectiveCamera(
                CONFIG.CAMERA.FOV,
                CONFIG.CAMERA.ASPECT,
                CONFIG.CAMERA.NEAR,
                CONFIG.CAMERA.FAR
            );
            this.backgroundCamera.position.set(0, 0, 0); // Fixed at origin
            
            // Create fixed independent camera (never moves)
            this.independentCamera = new THREE.PerspectiveCamera(
                CONFIG.CAMERA.FOV,
                CONFIG.CAMERA.ASPECT,
                CONFIG.CAMERA.NEAR,
                CONFIG.CAMERA.FAR
            );
            // FIXED: Position at same location as main camera to see shooting stars properly
            this.independentCamera.position.set(
                CONFIG.CAMERA.INITIAL_POSITION.x,
                CONFIG.CAMERA.INITIAL_POSITION.y,
                CONFIG.CAMERA.INITIAL_POSITION.z
            ); // Fixed at (0, 0, 5) to match main camera view

            // Create renderer
            this.renderer = new THREE.WebGLRenderer({
                alpha: CONFIG.RENDERER.ALPHA,
                antialias: CONFIG.RENDERER.ANTIALIAS,
                preserveDrawingBuffer: CONFIG.RENDERER.PRESERVE_DRAWING_BUFFER
            });

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);

            // Configure shadows
            if (CONFIG.RENDERER.SHADOW_MAP_ENABLED) {
                this.renderer.shadowMap.enabled = true;
                this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            }

            // Set renderer background color
            this.renderer.setClearColor(CONFIG.SCENE.BACKGROUND_COLOR, 1);

            // Add renderer to DOM
            this.canvasContainer.appendChild(this.renderer.domElement);

            // Add lights
            this.setupLights();

            // Handle window resize
            this.setupResizeHandler();

            console.log('✓ SceneManager initialized successfully');
            return true;

        } catch (error) {
            console.error('✗ SceneManager initialization failed:', error);
            throw error;
        }
    }

    /**
     * Setup scene lighting
     */
    setupLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light for main illumination
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        
        // Configure shadow properties
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        
        this.scene.add(directionalLight);

        // Point light for additional accent lighting
        const pointLight = new THREE.PointLight(0x8080FF, 0.5, 30);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);

        Utils.debug.log('Lights setup complete');
    }

    /**
     * Setup window resize handler
     */
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            // Update all cameras
            Utils.handleResize(this.camera, this.renderer);
            
            if (this.backgroundCamera) {
                this.backgroundCamera.aspect = window.innerWidth / window.innerHeight;
                this.backgroundCamera.updateProjectionMatrix();
            }
            
            if (this.independentCamera) {
                this.independentCamera.aspect = window.innerWidth / window.innerHeight;
                this.independentCamera.updateProjectionMatrix();
            }
        });
    }

    /**
     * Render all scenes in proper order
     */
    render() {
        // Enable auto-clear for the first render
        this.renderer.autoClear = true;
        
        // 1. Render background scene first (furthest back, fixed position)
        this.renderer.render(this.backgroundScene, this.backgroundCamera);
        
        // Disable auto-clear for subsequent renders to layer them
        this.renderer.autoClear = false;
        this.renderer.clearDepth = false;
        
        // 2. Render independent elements (shooting stars, vaporwave) layered on background
        this.renderer.render(this.independentScene, this.independentCamera);
        
        // 3. Render main scene (AWS logo, stock display) layered on top with OrbitControls camera
        this.renderer.render(this.scene, this.camera);
        
        // Reset auto-clear for next frame
        this.renderer.autoClear = true;
        this.renderer.clearDepth = true;
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.canvasContainer && this.renderer) {
            this.canvasContainer.removeChild(this.renderer.domElement);
        }
    }
}

/**
 * AnimationManager - Handles the main animation loop and frame timing
 */
class AnimationManager {
    constructor() {
        this.animationId = null;
        this.isRunning = false;
        this.updateCallback = null;
        this.lastTime = 0;
        this.deltaTime = 0;
        this.elapsedTime = 0;
        this.frameCount = 0;
    }

    /**
     * Start the animation loop
     * @param {function} updateCallback - Function to call each frame
     */
    start(updateCallback) {
        if (this.isRunning) {
            console.warn('AnimationManager is already running');
            return;
        }

        this.updateCallback = updateCallback;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.animate();

        console.log('✓ AnimationManager started');
    }

    /**
     * Stop the animation loop
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isRunning = false;
        console.log('AnimationManager stopped');
    }

    /**
     * Main animation loop
     */
    animate() {
        if (!this.isRunning) return;

        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.elapsedTime += this.deltaTime;
        this.lastTime = currentTime;
        this.frameCount++;

        // Update performance monitoring
        Utils.performance.update();

        // Call update callback
        if (this.updateCallback) {
            this.updateCallback(this.deltaTime, this.elapsedTime);
        }

        // Schedule next frame
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Get current frame rate
     * @returns {number} Current FPS
     */
    getFPS() {
        return Utils.performance.getFPS();
    }

    /**
     * Get delta time
     * @returns {number} Time since last frame in seconds
     */
    getDeltaTime() {
        return this.deltaTime;
    }

    /**
     * Get elapsed time
     * @returns {number} Total elapsed time in seconds
     */
    getElapsedTime() {
        return this.elapsedTime;
    }
}

/**
 * ControlsManager - Handles OrbitControls setup and interaction
 */
class ControlsManager {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;
        this.controls = null;
        this.isEnabled = true;
    }

    /**
     * Initialize OrbitControls
     */
    init() {
        try {
            console.log('[DIAGNOSTIC] Checking OrbitControls availability...');
            console.log('[DIAGNOSTIC] THREE object exists:', typeof THREE !== 'undefined');
            console.log('[DIAGNOSTIC] THREE.OrbitControls exists:', typeof THREE.OrbitControls !== 'undefined');
            console.log('[DIAGNOSTIC] window.OrbitControls exists:', typeof window.OrbitControls !== 'undefined');
            console.log('[DIAGNOSTIC] OrbitControls in global scope:', typeof OrbitControls !== 'undefined');
            
            // Check what's available in THREE namespace
            console.log('[DIAGNOSTIC] THREE keys:', Object.keys(THREE).filter(key => key.includes('Orbit')));
            
            // Check if OrbitControls is available
            if (typeof THREE.OrbitControls === 'undefined') {
                console.error('[DIAGNOSTIC] THREE.OrbitControls is undefined');
                throw new Error('OrbitControls not loaded - THREE.OrbitControls is undefined');
            }

            // Create OrbitControls instance
            this.controls = new THREE.OrbitControls(this.camera, this.domElement);

            // Configure controls
            this.setupControls();

            console.log('✓ ControlsManager initialized successfully');
            return true;

        } catch (error) {
            console.error('✗ ControlsManager initialization failed:', error);
            console.error('[DIAGNOSTIC] Error details:', {
                message: error.message,
                stack: error.stack,
                threeExists: typeof THREE !== 'undefined',
                orbitControlsExists: typeof THREE?.OrbitControls !== 'undefined'
            });
            throw error;
        }
    }

    /**
     * Configure OrbitControls settings
     */
    setupControls() {
        const config = CONFIG.CONTROLS;

        // Enable damping for smooth movement
        this.controls.enableDamping = config.ENABLE_DAMPING;
        this.controls.dampingFactor = config.DAMPING_FACTOR;

        // Configure interaction options
        this.controls.enablePan = config.ENABLE_PAN;
        this.controls.enableRotate = config.ENABLE_ROTATE;
        this.controls.enableZoom = config.ENABLE_ZOOM;

        // Set distance limits
        this.controls.minDistance = config.MIN_DISTANCE;
        this.controls.maxDistance = config.MAX_DISTANCE;

        // Set rotation limits
        this.controls.minPolarAngle = config.MIN_POLAR_ANGLE;
        this.controls.maxPolarAngle = config.MAX_POLAR_ANGLE;

        // Set control speeds
        this.controls.rotateSpeed = config.ROTATE_SPEED;
        this.controls.zoomSpeed = config.ZOOM_SPEED;
        this.controls.panSpeed = config.PAN_SPEED;

        // Set initial target (look at origin)
        this.controls.target.set(0, 0, 0);

        // Update controls to apply settings
        this.controls.update();

        // Add event listeners
        this.setupEventListeners();

        Utils.debug.log('OrbitControls configured');
    }

    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        this.controls.addEventListener('start', () => {
            Utils.debug.log('Interaction started');
        });

        this.controls.addEventListener('change', () => {
            Utils.debug.log('Camera position changed');
        });

        this.controls.addEventListener('end', () => {
            Utils.debug.log('Interaction ended');
        });
    }

    /**
     * Update controls (must be called in animation loop if damping is enabled)
     */
    update() {
        if (this.controls && this.isEnabled) {
            this.controls.update();
        }
    }

    /**
     * Enable/disable controls
     * @param {boolean} enabled - Whether controls should be enabled
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (this.controls) {
            this.controls.enabled = enabled;
        }
    }

    /**
     * Reset controls to initial state
     */
    reset() {
        if (this.controls) {
            this.controls.reset();
        }
    }

    /**
     * Set controls target
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z coordinate
     */
    setTarget(x, y, z) {
        if (this.controls) {
            this.controls.target.set(x, y, z);
            this.controls.update();
        }
    }

    /**
     * Get current controls state
     * @returns {object} Current state information
     */
    getState() {
        if (!this.controls) return null;

        return {
            target: this.controls.target.clone(),
            position: this.camera.position.clone(),
            azimuthAngle: this.controls.getAzimuthalAngle(),
            polarAngle: this.controls.getPolarAngle(),
            distance: this.controls.getDistance()
        };
    }

    /**
     * Dispose of controls
     */
    dispose() {
        if (this.controls) {
            this.controls.dispose();
        }
    }
}

/**
 * ResourceManager - Handles loading and management of textures and other resources
 */
class ResourceManager {
    constructor() {
        this.textures = new Map();
        this.loadingPromises = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
    }

    /**
     * Load a texture
     * @param {string} name - Texture name/key
     * @param {string} url - Texture URL
     * @returns {Promise<THREE.Texture>}
     */
    loadTexture(name, url) {
        // Return existing texture if already loaded
        if (this.textures.has(name)) {
            return Promise.resolve(this.textures.get(name));
        }

        // Return existing promise if currently loading
        if (this.loadingPromises.has(name)) {
            return this.loadingPromises.get(name);
        }

        // Create new loading promise
        const promise = new Promise((resolve, reject) => {
            const texture = Utils.loadTexture(
                url,
                (loadedTexture) => {
                    this.textures.set(name, loadedTexture);
                    this.loadedCount++;
                    resolve(loadedTexture);
                },
                (error) => {
                    reject(error);
                }
            );
        });

        this.loadingPromises.set(name, promise);
        this.totalCount++;
        return promise;
    }

    /**
     * Load multiple textures
     * @param {object} textureMap - Map of name: url pairs
     * @returns {Promise<object>} Map of loaded textures
     */
    async loadTextures(textureMap) {
        const promises = Object.entries(textureMap).map(([name, url]) => 
            this.loadTexture(name, url).then(texture => ({ name, texture }))
        );

        const results = await Promise.all(promises);
        const textureResults = {};
        
        results.forEach(({ name, texture }) => {
            textureResults[name] = texture;
        });

        return textureResults;
    }

    /**
     * Get a loaded texture
     * @param {string} name - Texture name
     * @returns {THREE.Texture|null}
     */
    getTexture(name) {
        return this.textures.get(name) || null;
    }

    /**
     * Get loading progress
     * @returns {number} Progress as percentage (0-100)
     */
    getProgress() {
        if (this.totalCount === 0) return 100;
        return (this.loadedCount / this.totalCount) * 100;
    }

    /**
     * Check if all resources are loaded
     * @returns {boolean}
     */
    isAllLoaded() {
        return this.loadedCount === this.totalCount;
    }

    /**
     * Dispose of all textures
     */
    dispose() {
        this.textures.forEach(texture => {
            texture.dispose();
        });
        this.textures.clear();
        this.loadingPromises.clear();
    }
}

// Export managers to global scope
window.SceneManager = SceneManager;
window.AnimationManager = AnimationManager;
window.ControlsManager = ControlsManager;
window.ResourceManager = ResourceManager;

console.log('✓ Managers.js loaded successfully');