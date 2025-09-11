// ============================================================================
// MAIN.JS - Main Application Entry Point and Orchestration
// ============================================================================

/**
 * Main WebGL Application Class
 */
class WebGLApp {
    constructor() {
        // Managers
        this.sceneManager = null;
        this.animationManager = null;
        this.controlsManager = null;
        this.resourceManager = null;

        // Components
        this.components = {};

        // Application state
        this.isInitialized = false;
        this.isLoading = false;

        // DOM elements
        this.loadingElement = null;
    }

    /**
     * Initialize the entire application
     */
    async init() {
        try {
            this.isLoading = true;
            this.loadingElement = document.getElementById('loading');
            
            console.log('🚀 Starting WebGL AWS Logo Application...');
            
            // Check WebGL support
            if (!Utils.isWebGLSupported()) {
                throw new Error('WebGL is not supported in this browser');
            }

            // Update loading status
            this.updateLoadingStatus('Initializing Scene...');

            // Initialize managers in order
            await this.initializeManagers();

            // Update loading status
            this.updateLoadingStatus('Loading Assets...');

            // Load all required assets
            await this.loadAssets();

            // Update loading status
            this.updateLoadingStatus('Creating Components...');

            // Create all components
            await this.createComponents();

            // Update loading status
            this.updateLoadingStatus('Setting up Controls...');

            // Setup controls
            this.setupControls();

            // Update loading status
            this.updateLoadingStatus('Starting Animation...');

            // Start the animation loop
            this.startAnimation();

            // Application fully initialized
            this.isInitialized = true;
            this.isLoading = false;

            // Hide loading screen
            this.hideLoadingScreen();

            console.log('✅ WebGL AWS Logo Application initialized successfully!');

        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize all managers
     */
    async initializeManagers() {
        try {
            // Initialize scene manager
            this.sceneManager = new SceneManager();
            await this.sceneManager.init();

            // Initialize animation manager
            this.animationManager = new AnimationManager();

            // Initialize resource manager
            this.resourceManager = new ResourceManager();

            console.log('✓ All managers initialized');

        } catch (error) {
            throw new Error(`Manager initialization failed: ${error.message}`);
        }
    }

    /**
     * Load all required assets
     */
    async loadAssets() {
        try {
            // Define all assets to load
            const assetsToLoad = {
                awsLogo: CONFIG.ASSETS.AWS_LOGO,
                background: CONFIG.ASSETS.BACKGROUND
            };

            // Load all textures
            await this.resourceManager.loadTextures(assetsToLoad);

            console.log('✓ All assets loaded');

        } catch (error) {
            throw new Error(`Asset loading failed: ${error.message}`);
        }
    }

    /**
     * Create and initialize all components
     */
    async createComponents() {
        try {
            // Create background (must be first - renders behind everything)
            await this.createBackground();

            // Create logo group (contains glass pane and stock display)
            await this.createLogoGroup();

            // Create independent elements (not affected by controls)
            await this.createIndependentElements();

            console.log('✓ All components created');

        } catch (error) {
            throw new Error(`Component creation failed: ${error.message}`);
        }
    }

    /**
     * Create the background scene
     */
    async createBackground() {
        this.components.background = new BackgroundScene();
        await this.components.background.init();
        
        // Initialize background with fixed camera for proper scaling
        this.components.background.initWithCamera(this.sceneManager.backgroundCamera);
        
        // Add to BACKGROUND scene (fixed, not affected by OrbitControls)
        this.sceneManager.backgroundScene.add(this.components.background.mesh);
    }

    /**
     * Create the logo group (AWS logo + stock display)
     */
    async createLogoGroup() {
        // Create logo group container
        this.components.logoGroup = new THREE.Group();
        
        // Create glass pane with AWS logo
        this.components.glassPane = new GlassPane();
        await this.components.glassPane.init();
        this.components.logoGroup.add(this.components.glassPane.mesh);

        // Create stock display
        this.components.stockDisplay = new StockDisplay();
        this.components.stockDisplay.init();
        this.components.logoGroup.add(this.components.stockDisplay.mesh);

        // Add logo group to MAIN scene (affected by OrbitControls)
        this.sceneManager.scene.add(this.components.logoGroup);
    }

    /**
     * Create independent elements (shooting stars and vaporwave lines)
     */
    async createIndependentElements() {
        // Create shooting stars system
        this.components.shootingStars = new ShootingStars();
        this.components.shootingStars.init();
        
        // Add to INDEPENDENT scene (fixed, not affected by OrbitControls)
        this.sceneManager.independentScene.add(this.components.shootingStars.particleSystem);

        // Create vaporwave bubbles system
        this.components.vaporwaveBubbles = new VaporwaveBubbles();
        this.components.vaporwaveBubbles.init();
        
        // FIXED: Add vaporwave to INDEPENDENT scene (TC-005: not subject to mouse control)
        // This ensures vaporwave elements remain independent from OrbitControls camera movements
        this.sceneManager.independentScene.add(this.components.vaporwaveBubbles.group);
    }

    /**
     * Setup orbit controls
     */
    setupControls() {
        this.controlsManager = new ControlsManager(
            this.sceneManager.camera,
            this.sceneManager.renderer.domElement
        );
        this.controlsManager.init();
    }

    /**
     * Start the animation loop
     */
    startAnimation() {
        this.animationManager.start((deltaTime, elapsedTime) => {
            this.update(deltaTime, elapsedTime);
        });
    }

    /**
     * Main update loop - called every frame
     * @param {number} deltaTime - Time since last frame in seconds
     * @param {number} elapsedTime - Total elapsed time in seconds
     */
    update(deltaTime, elapsedTime) {
        try {
            // Update logo rotation (main requirement)
            if (this.components.logoGroup) {
                this.components.logoGroup.rotation.y += CONFIG.ANIMATION.LOGO_ROTATION_SPEED;
            }

            // Update independent animation systems
            if (this.components.shootingStars) {
                this.components.shootingStars.update(deltaTime);
            }

            // Update vaporwave bubbles
            if (this.components.vaporwaveBubbles) {
                this.components.vaporwaveBubbles.update(deltaTime, elapsedTime);
            }

            // Update controls (required for damping)
            if (this.controlsManager) {
                this.controlsManager.update();
            }

            // Update individual components
            Object.values(this.components).forEach(component => {
                if (component && typeof component.update === 'function') {
                    component.update(deltaTime, elapsedTime);
                }
            });

            // Render the scene
            this.sceneManager.render();

            // Performance monitoring (optional)
            this.monitorPerformance();

        } catch (error) {
            console.error('Update loop error:', error);
            this.handleRuntimeError(error);
        }
    }

    /**
     * Monitor performance and log warnings if needed
     */
    monitorPerformance() {
        const fps = this.animationManager.getFPS();
        
        // Log performance warnings
        if (fps < 30 && fps > 0) {
            Utils.debug.warn(`Low FPS detected: ${fps}`);
        }

        // Log performance info periodically (every 5 seconds)
        if (Math.floor(this.animationManager.getElapsedTime()) % 5 === 0) {
            Utils.debug.log(`Performance: ${fps} FPS`);
        }
    }

    /**
     * Update loading status display
     * @param {string} message - Loading message
     */
    updateLoadingStatus(message) {
        if (this.loadingElement) {
            this.loadingElement.textContent = message;
        }
        console.log(`📋 ${message}`);
    }

    /**
     * Hide the loading screen
     */
    hideLoadingScreen() {
        if (this.loadingElement) {
            this.loadingElement.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingElement && this.loadingElement.parentNode) {
                    this.loadingElement.style.display = 'none';
                }
            }, 500);
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - The error that occurred
     */
    handleInitializationError(error) {
        console.error('❌ Application initialization failed:', error);
        
        // Show error message to user
        if (this.loadingElement) {
            this.loadingElement.innerHTML = `
                <div style="color: #ff6b6b; text-align: center;">
                    <h2>❌ Application Failed to Load</h2>
                    <p>${error.message}</p>
                    <p style="font-size: 14px; margin-top: 20px;">
                        Please try refreshing the page or check the console for more details.
                    </p>
                </div>
            `;
        }

        this.isLoading = false;
    }

    /**
     * Handle runtime errors
     * @param {Error} error - The error that occurred
     */
    handleRuntimeError(error) {
        console.error('Runtime error occurred:', error);
        
        // For runtime errors, we don't stop the application but log for debugging
        Utils.debug.error('Runtime error in update loop:', error);
    }

    /**
     * Dispose of all resources and clean up
     */
    dispose() {
        try {
            // Stop animation
            if (this.animationManager) {
                this.animationManager.stop();
            }

            // Dispose components
            Object.values(this.components).forEach(component => {
                if (component && typeof component.dispose === 'function') {
                    component.dispose();
                }
            });

            // Dispose managers
            if (this.controlsManager) {
                this.controlsManager.dispose();
            }

            if (this.resourceManager) {
                this.resourceManager.dispose();
            }

            if (this.sceneManager) {
                this.sceneManager.dispose();
            }

            console.log('✓ Application disposed successfully');

        } catch (error) {
            console.error('Error during disposal:', error);
        }
    }

    /**
     * Get application state information
     * @returns {object} Current application state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            isLoading: this.isLoading,
            fps: this.animationManager ? this.animationManager.getFPS() : 0,
            elapsedTime: this.animationManager ? this.animationManager.getElapsedTime() : 0,
            cameraState: this.controlsManager ? this.controlsManager.getState() : null
        };
    }

    /**
     * Toggle debug mode
     * @param {boolean} enabled - Whether to enable debug mode
     */
    setDebugMode(enabled) {
        Utils.debug.enabled = enabled;
        console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
    }
}

/**
 * Application startup and DOM ready handling
 */
class AppBootstrap {
    constructor() {
        this.app = null;
    }

    /**
     * Initialize the application when DOM is ready
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startApp());
        } else {
            this.startApp();
        }
    }

    /**
     * Start the application
     */
    async startApp() {
        try {
            // Create and initialize the main application
            this.app = new WebGLApp();
            await this.app.init();

            // Setup global access for debugging
            window.app = this.app;

            // Setup development helpers
            this.setupDevHelpers();

        } catch (error) {
            console.error('Failed to start application:', error);
        }
    }

    /**
     * Setup development helpers and debugging tools
     */
    setupDevHelpers() {
        // Add keyboard shortcuts for debugging
        document.addEventListener('keydown', (event) => {
            switch (event.key.toLowerCase()) {
                case 'd':
                    if (event.ctrlKey || event.metaKey) {
                        event.preventDefault();
                        this.app.setDebugMode(!Utils.debug.enabled);
                    }
                    break;
                case 'r':
                    if (event.ctrlKey || event.metaKey) {
                        // Allow normal refresh, but log state
                        console.log('App state before refresh:', this.app.getState());
                    }
                    break;
            }
        });

        // Setup window beforeunload handler
        window.addEventListener('beforeunload', () => {
            if (this.app) {
                this.app.dispose();
            }
        });

        // Log helpful debugging info
        console.log('🛠️ Development helpers enabled:');
        console.log('   • Ctrl+D (or Cmd+D): Toggle debug mode');
        console.log('   • window.app: Access to main application instance');
        console.log('   • app.getState(): Get current application state');
        console.log('   • Utils.debug: Debug utilities');
        console.log('   • CONFIG: Configuration object');
    }
}

// Create and initialize the application
const appBootstrap = new AppBootstrap();
appBootstrap.init();

// Export for global access
window.WebGLApp = WebGLApp;
window.AppBootstrap = AppBootstrap;

console.log('✓ Main.js loaded successfully - Application ready to start');