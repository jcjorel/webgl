/**
 * WebGL AWSome 3D Demo - Main Application Entry Point
 * 
 * Multi-layered WebGL application with:
 * - Background landscape (CSS layer)
 * - Ground vapor particles (WebGL layer)
 * - Shooting stars/meteors (WebGL layer)
 * - AWS Logo & AMZN stock (WebGL layer with OrbitControls)
 */

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

// Import visual components
import { VaporSystem } from './vapor.js';
import { ShootingStarSystem } from './shooting_star.js';
import { AWSLogoScene } from './logo.js';

// ===================================================================
// COORDINATE SYSTEM MAPPING (Based on background image analysis)
// ===================================================================

const COORDINATE_SYSTEM = {
    // Screen dimensions (1920x1088 background image)
    SCREEN_WIDTH: 1920,
    SCREEN_HEIGHT: 1088,
    
    // Critical boundaries from background image analysis
    HORIZON_Y: 725,        // Skyline boundary (66.7% from top)
    GROUND_Y: 625,         // Ground level start (57.4% from top)
    VANISHING_POINT: { x: 960, y: 725 },
    
    // 3D World boundaries
    WORLD_WIDTH: 40,       // 3D world units
    WORLD_HEIGHT: 30,      // 3D world units
    GROUND_LEVEL: 0,       // Y=0 in 3D space
    SKY_CEILING: 25,       // Maximum height for meteors
    
    // Convert screen coordinates to 3D world coordinates
    screenTo3D: function(screenX, screenY) {
        const normalizedX = (screenX / this.SCREEN_WIDTH - 0.5);
        const normalizedY = Math.max(0, (this.HORIZON_Y - screenY) / (this.HORIZON_Y - this.GROUND_Y));
        
        return {
            x: normalizedX * this.WORLD_WIDTH,
            y: normalizedY * 10, // Scale to reasonable 3D height
            z: -20 + normalizedY * 20 // Depth based on perspective
        };
    },
    
    // Convert 3D world coordinates to screen coordinates
    worldToScreen: function(worldX, worldY) {
        return {
            x: (worldX / this.WORLD_WIDTH + 0.5) * this.SCREEN_WIDTH,
            y: this.HORIZON_Y - (worldY / 10) * (this.HORIZON_Y - this.GROUND_Y)
        };
    }
};

// ===================================================================
// APPLICATION STATE
// ===================================================================

const AppState = {
    isLoading: true,
    loadingProgress: 0,
    debug: false,
    
    // Renderers for each layer
    renderers: {
        vapor: null,
        stars: null, 
        logo: null
    },
    
    // Visual systems
    systems: {
        vapor: null,
        stars: null,
        logo: null
    },
    
    // Performance monitoring
    stats: null,
    frameCount: 0,
    lastFPSUpdate: 0,
    
    // Debug logging system
    debugLogging: {
        startup: true,
        coordinates: false,
        renderLoop: false,
        performance: false,
        errors: true,
        logBuffer: [],
        maxLogEntries: 100
    }
};

// ===================================================================
// INITIALIZATION
// ===================================================================

class WebGLApplication {
    constructor() {
        this.clock = new THREE.Clock();
        this.setupEventListeners();
        this.init();
    }
    
    async init() {
        this.logStartup('🚀 WebGL AWSome 3D Demo - Initializing...');
        this.logStartup(`🖥️ Browser: ${navigator.userAgent}`);
        this.logStartup(`📱 Screen: ${screen.width}x${screen.height}, Window: ${window.innerWidth}x${window.innerHeight}`);
        this.logStartup(`🎮 WebGL Support: ${window.WebGLRenderingContext ? 'Yes' : 'No'}`);
        
        try {
            // Update loading status
            this.updateLoadingStatus('Initializing WebGL contexts...', 10);
            
            // Setup WebGL renderers for each layer
            await this.setupRenderers();
            this.logStartup('✅ WebGL renderers configured');
            this.updateLoadingStatus('WebGL contexts ready', 30);
            
            // Setup coordinate system
            this.setupCoordinateSystem();
            this.logStartup('✅ Coordinate system configured');
            this.updateLoadingStatus('Coordinate system configured', 40);
            
            // Setup performance monitoring
            this.setupStats();
            this.logStartup('✅ Performance monitoring ready');
            this.updateLoadingStatus('Performance monitoring ready', 50);
            
            // Initialize visual systems
            await this.initializeSystems();
            this.logStartup('✅ Visual systems initialized');
            this.updateLoadingStatus('Visual systems initialized', 80);
            
            // Setup debugging
            this.setupDebugOverlay();
            this.logStartup('✅ Debug systems ready');
            this.updateLoadingStatus('Debug systems ready', 90);
            
            // Start animation loop
            this.startAnimationLoop();
            this.logStartup('✅ Animation loop started');
            this.updateLoadingStatus('Launch complete!', 100);
            
            // Hide loading screen
            setTimeout(() => this.hideLoadingScreen(), 500);
            
            this.logStartup('🎉 WebGL AWSome 3D Demo - Ready!');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Failed to initialize WebGL application: ' + error.message);
        }
    }
    
    setupRenderers() {
        this.logStartup('🔧 Setting up WebGL renderers...');
        
        // Get canvas elements
        const vaporCanvas = document.getElementById('vapor-canvas');
        const starsCanvas = document.getElementById('stars-canvas');
        const logoCanvas = document.getElementById('logo-canvas');
        
        if (!vaporCanvas || !starsCanvas || !logoCanvas) {
            throw new Error('Canvas elements not found');
        }
        
        // Common renderer settings for transparent layers
        const rendererSettings = {
            canvas: null, // Will be set individually
            antialias: true,
            alpha: true, // Critical for transparent layers
            premultipliedAlpha: false,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance"
        };
        
        // Vapor renderer
        AppState.renderers.vapor = new THREE.WebGLRenderer({
            ...rendererSettings,
            canvas: vaporCanvas
        });
        this.configureRenderer(AppState.renderers.vapor, 'vapor');
        
        // Shooting stars renderer
        AppState.renderers.stars = new THREE.WebGLRenderer({
            ...rendererSettings,
            canvas: starsCanvas
        });
        this.configureRenderer(AppState.renderers.stars, 'stars');
        
        // AWS Logo renderer (with different settings for OrbitControls)
        AppState.renderers.logo = new THREE.WebGLRenderer({
            ...rendererSettings,
            canvas: logoCanvas
        });
        this.configureRenderer(AppState.renderers.logo, 'logo');
        
        // Setup resize handling
        this.setupResizeHandling();
        
        this.logStartup('✅ WebGL renderers configured');
    }
    
    configureRenderer(renderer, type) {
        // Set pixel ratio for crisp rendering
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Set size to match window
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Configure for transparent rendering
        renderer.setClearColor(0x000000, 0); // Transparent background
        
        // WebGL2 specific optimizations
        if (renderer.capabilities.isWebGL2) {
            console.log(`✅ WebGL2 detected for ${type} renderer`);
        } else {
            console.warn(`⚠️ WebGL2 not available for ${type} renderer, falling back to WebGL1`);
        }
        
        // Shadow mapping (for logo scene primarily)
        if (type === 'logo') {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        // HDR tone mapping for enhanced visuals
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
    }
    
    setupCoordinateSystem() {
        this.logStartup('🗺️ Coordinate system configuration:');
        this.logStartup(`  - Screen: ${COORDINATE_SYSTEM.SCREEN_WIDTH}x${COORDINATE_SYSTEM.SCREEN_HEIGHT}`);
        this.logStartup(`  - Horizon: Y=${COORDINATE_SYSTEM.HORIZON_Y}px`);
        this.logStartup(`  - Ground: Y=${COORDINATE_SYSTEM.GROUND_Y}px`);
        this.logStartup(`  - 3D World: ${COORDINATE_SYSTEM.WORLD_WIDTH}x${COORDINATE_SYSTEM.WORLD_HEIGHT} units`);
        
        // Test coordinate conversion with detailed logging
        const testScreen = { x: 960, y: 725 }; // Vanishing point
        const test3D = COORDINATE_SYSTEM.screenTo3D(testScreen.x, testScreen.y);
        const testBack = COORDINATE_SYSTEM.worldToScreen(test3D.x, test3D.y);
        
        this.logStartup('🧪 Coordinate system validation:');
        this.logStartup(`  Screen → 3D: (${testScreen.x}, ${testScreen.y}) → (${test3D.x.toFixed(2)}, ${test3D.y.toFixed(2)}, ${test3D.z.toFixed(2)})`);
        this.logStartup(`  3D → Screen: (${test3D.x.toFixed(2)}, ${test3D.y.toFixed(2)}) → (${testBack.x.toFixed(2)}, ${testBack.y.toFixed(2)})`);
        
        // Instrument coordinate conversion functions for runtime logging
        this.instrumentCoordinateSystem();
        
        // Store globally for other modules
        window.COORDINATE_SYSTEM = COORDINATE_SYSTEM;
    }
    
    setupStats() {
        this.logStartup('📊 Setting up performance monitoring...');
        
        AppState.stats = new Stats();
        AppState.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.getElementById('stats').appendChild(AppState.stats.dom);
        
        this.logStartup('✅ Performance monitoring ready');
    }
    
    async initializeSystems() {
        this.logStartup('🎭 Initializing visual systems...');
        
        // Initialize AWS Logo Scene
        try {
            const startTime = performance.now();
            AppState.systems.logo = new AWSLogoScene(
                AppState.renderers.logo,
                COORDINATE_SYSTEM
            );
            const initTime = performance.now() - startTime;
            this.logStartup(`✅ AWS Logo Scene initialized (${initTime.toFixed(2)}ms)`);
        } catch (error) {
            this.logError('❌ Failed to initialize AWS Logo Scene:', error);
            AppState.systems.logo = { initialized: false, error: error.message };
        }
        
        // Initialize Ground Vapor System
        try {
            const startTime = performance.now();
            AppState.systems.vapor = new VaporSystem(
                AppState.renderers.vapor,
                COORDINATE_SYSTEM
            );
            const initTime = performance.now() - startTime;
            this.logStartup(`✅ Ground Vapor System initialized (${initTime.toFixed(2)}ms)`);
        } catch (error) {
            this.logError('❌ Failed to initialize Ground Vapor System:', error);
            AppState.systems.vapor = { initialized: false, error: error.message, particleCount: 0 };
        }
        
        // Initialize Shooting Star System
        try {
            const startTime = performance.now();
            AppState.systems.stars = new ShootingStarSystem(
                AppState.renderers.stars,
                COORDINATE_SYSTEM
            );
            const initTime = performance.now() - startTime;
            this.logStartup(`✅ Shooting Star System initialized (${initTime.toFixed(2)}ms)`);
        } catch (error) {
            this.logError('❌ Failed to initialize Shooting Star System:', error);
            AppState.systems.stars = { initialized: false, error: error.message, meteorCount: 0 };
        }
        
        this.logStartup('✅ Visual systems initialization complete');
    }
    
    setupDebugOverlay() {
        // Enable debug overlay with 'D' key
        window.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'd') {
                AppState.debug = !AppState.debug;
                const debugOverlay = document.getElementById('debug-overlay');
                debugOverlay.style.display = AppState.debug ? 'block' : 'none';
                console.log(`🔍 Debug overlay: ${AppState.debug ? 'ON' : 'OFF'}`);
            }
        });
        
        console.log('🔍 Debug overlay ready (Press "D" to toggle)');
    }
    
    setupResizeHandling() {
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Update all renderers
            Object.values(AppState.renderers).forEach(renderer => {
                if (renderer) {
                    renderer.setSize(width, height);
                }
            });
            
            // Update camera aspect ratios for systems
            if (AppState.systems.logo && AppState.systems.logo.handleResize) {
                AppState.systems.logo.handleResize(width, height);
            }
            
            // Update HDR bloom composer for shooting stars
            if (AppState.systems.stars && AppState.systems.stars.handleResize) {
                AppState.systems.stars.handleResize(width, height);
            }
            
            console.log(`📐 Resized to ${width}x${height}`);
        });
    }
    
    setupEventListeners() {
        // Prevent context menu on right click
        window.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle page visibility changes for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('⏸️ Page hidden - pausing animations');
            } else {
                console.log('▶️ Page visible - resuming animations');
            }
        });
    }
    
    startAnimationLoop() {
        console.log('🎬 Starting animation loop...');
        
        const animate = () => {
            requestAnimationFrame(animate);
            
            // Update performance stats
            AppState.stats.begin();
            
            const deltaTime = this.clock.getDelta();
            const elapsedTime = this.clock.getElapsedTime();
            
            // Update systems (placeholder)
            this.updateSystems(deltaTime, elapsedTime);
            
            // Render all layers
            this.renderLayers();
            
            // Update debug info
            this.updateDebugInfo(deltaTime);
            
            AppState.stats.end();
            AppState.frameCount++;
        };
        
        animate();
        console.log('✅ Animation loop started');
    }
    
    updateSystems(deltaTime, elapsedTime) {
        // Update AWS Logo Scene
        if (AppState.systems.logo && AppState.systems.logo.update) {
            AppState.systems.logo.update(deltaTime, elapsedTime);
        }
        
        // Placeholder system updates for other components
        if (AppState.systems.vapor && AppState.systems.vapor.update) {
            AppState.systems.vapor.update(deltaTime, elapsedTime);
        }
        
        if (AppState.systems.stars && AppState.systems.stars.update) {
            AppState.systems.stars.update(deltaTime, elapsedTime);
        }
    }
    
    renderLayers() {
        // Clear all renderers with transparent background
        Object.values(AppState.renderers).forEach(renderer => {
            if (renderer) {
                renderer.clear();
            }
        });
        
        // Render Ground Vapor System (bottom 3D layer)
        if (AppState.systems.vapor && AppState.systems.vapor.render) {
            AppState.systems.vapor.render();
        }
        
        // Render Shooting Stars (middle 3D layer)
        if (AppState.systems.stars && AppState.systems.stars.render) {
            AppState.systems.stars.render();
        }
        
        // Render AWS Logo Scene (top 3D layer)
        if (AppState.systems.logo && AppState.systems.logo.render) {
            AppState.systems.logo.render();
        }
        
        // Note: Layers render in z-order automatically due to CSS positioning
    }
    
    updateDebugInfo(deltaTime) {
        if (AppState.debug) {
            const now = performance.now();
            if (now - AppState.lastFPSUpdate > 500) { // Update every 500ms
                const fps = Math.round(1 / deltaTime);
                document.getElementById('fps-info').textContent = `${fps} FPS`;
                document.getElementById('coord-info').textContent = 'Active';
                document.getElementById('vapor-count').textContent = AppState.systems.vapor?.getInfo ? AppState.systems.vapor.getInfo().particleCount : 0;
                document.getElementById('stars-count').textContent = AppState.systems.stars?.getInfo ? AppState.systems.stars.getInfo().meteorCount : 0;
                document.getElementById('logo-status').textContent = AppState.systems.logo?.initialized ? 'Ready' : 'Loading';
                
                AppState.lastFPSUpdate = now;
            }
        }
    }
    
    updateLoadingStatus(status, progress) {
        AppState.loadingProgress = progress;
        document.getElementById('loading-status').textContent = status;
        document.getElementById('loading-bar').style.width = `${progress}%`;
        this.logStartup(`📋 Loading: ${progress}% - ${status}`);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            AppState.isLoading = false;
            this.logStartup('🎉 Loading screen hidden - Application ready!');
        }, 500);
    }
    
    showError(message) {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.innerHTML = `
            <div style="color: #ff4444;">
                <div>❌ Error</div>
                <div style="margin-top: 20px; font-size: 14px;">${message}</div>
                <div style="margin-top: 20px; font-size: 12px;">Check console for details</div>
            </div>
        `;
    }
    
    // ===================================================================
    // DEBUGGING AND LOGGING SYSTEM
    // ===================================================================
    
    logStartup(message) {
        if (AppState.debugLogging.startup) {
            console.log(`[STARTUP] ${message}`);
            this.addToLogBuffer('STARTUP', message);
        }
    }
    
    logError(message, error) {
        if (AppState.debugLogging.errors) {
            console.error(`[ERROR] ${message}`, error);
            this.addToLogBuffer('ERROR', `${message} ${error ? error.message : ''}`);
        }
    }
    
    logCoordinates(message) {
        if (AppState.debugLogging.coordinates) {
            console.log(`[COORDS] ${message}`);
            this.addToLogBuffer('COORDS', message);
        }
    }
    
    logRenderLoop(message) {
        if (AppState.debugLogging.renderLoop) {
            console.log(`[RENDER] ${message}`);
            this.addToLogBuffer('RENDER', message);
        }
    }
    
    logPerformance(message) {
        if (AppState.debugLogging.performance) {
            console.log(`[PERF] ${message}`);
            this.addToLogBuffer('PERF', message);
        }
    }
    
    addToLogBuffer(category, message) {
        const logEntry = {
            timestamp: performance.now(),
            category: category,
            message: message,
            frame: AppState.frameCount
        };
        
        AppState.debugLogging.logBuffer.push(logEntry);
        
        // Keep buffer size manageable
        if (AppState.debugLogging.logBuffer.length > AppState.debugLogging.maxLogEntries) {
            AppState.debugLogging.logBuffer.shift();
        }
    }
    
    instrumentCoordinateSystem() {
        // Add logging to coordinate conversion functions
        const originalScreenTo3D = COORDINATE_SYSTEM.screenTo3D;
        const originalWorldToScreen = COORDINATE_SYSTEM.worldToScreen;
        
        COORDINATE_SYSTEM.screenTo3D = (screenX, screenY) => {
            const result = originalScreenTo3D.call(COORDINATE_SYSTEM, screenX, screenY);
            this.logCoordinates(`Screen→3D: (${screenX}, ${screenY}) → (${result.x.toFixed(2)}, ${result.y.toFixed(2)}, ${result.z.toFixed(2)})`);
            return result;
        };
        
        COORDINATE_SYSTEM.worldToScreen = (worldX, worldY) => {
            const result = originalWorldToScreen.call(COORDINATE_SYSTEM, worldX, worldY);
            this.logCoordinates(`3D→Screen: (${worldX.toFixed(2)}, ${worldY.toFixed(2)}) → (${result.x.toFixed(2)}, ${result.y.toFixed(2)})`);
            return result;
        };
        
        this.logStartup('🔧 Coordinate system instrumented for debug logging');
    }
    
    getDebugLog() {
        return {
            logBuffer: AppState.debugLogging.logBuffer,
            settings: AppState.debugLogging,
            stats: {
                totalEntries: AppState.debugLogging.logBuffer.length,
                categories: this.getLogCategoryCounts(),
                memoryUsage: this.estimateLogMemoryUsage()
            }
        };
    }
    
    getLogCategoryCounts() {
        const counts = {};
        AppState.debugLogging.logBuffer.forEach(entry => {
            counts[entry.category] = (counts[entry.category] || 0) + 1;
        });
        return counts;
    }
    
    estimateLogMemoryUsage() {
        return AppState.debugLogging.logBuffer.reduce((total, entry) => {
            return total + JSON.stringify(entry).length;
        }, 0);
    }
}

// ===================================================================
// APPLICATION STARTUP
// ===================================================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    console.log('[STARTUP] 🌟 WebGL AWSome 3D Demo - Starting up...');
    
    // Check WebGL support
    if (!window.WebGLRenderingContext) {
        console.error('[ERROR] ❌ WebGL not supported');
        document.getElementById('loading-screen').innerHTML = `
            <div style="color: #ff4444;">
                <div>❌ WebGL Not Supported</div>
                <div style="margin-top: 20px;">Your browser does not support WebGL</div>
            </div>
        `;
        return;
    }
    
    // Create and start the application
    try {
        window.webglApp = new WebGLApplication();
    } catch (error) {
        console.error('[ERROR] ❌ Failed to create application:', error);
    }
}

// Export for debugging
export { COORDINATE_SYSTEM, AppState };