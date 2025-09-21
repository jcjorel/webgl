/**
 * AWS Logo & AMZN Stock 3D Scene
 * 
 * Features:
 * - AWS logo on glass box with metallic materials
 * - AMZN stock price display ($231.48)
 * - OrbitControls for 360° rotation, pan, zoom
 * - 4-point lighting system
 * - Background environment reflection
 * - Isolated scene for mouse interaction
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export class AWSLogoScene {
    constructor(renderer, coordinateSystem) {
        this.renderer = renderer;
        this.coordinateSystem = coordinateSystem;
        this.canvas = renderer.domElement;
        
        // Scene components
        this.scene = null;
        this.camera = null;
        this.controls = null;
        
        // 3D objects
        this.logoGroup = null;
        this.glassBox = null;
        this.awsLogo = null;
        this.stockText = null;
        
        // Materials
        this.logoMaterial = null;
        this.glassMaterial = null;
        this.stockMaterial = null;
        
        // Lighting
        this.lights = {};
        
        // Assets
        this.logoTexture = null;
        this.environmentTexture = null;
        this.font = null;
        
        // State
        this.initialized = false;
        this.rotationSpeed = 0.005;
        
        this.init();
    }
    
    async init() {
        console.log('🎨 Initializing AWS Logo Scene...');
        
        try {
            this.setupScene();
            this.setupCamera();
            this.setupControls();
            await this.loadAssets();
            this.setupLighting();
            this.create3DComponents();
            this.setupEnvironmentReflection();
            
            this.initialized = true;
            console.log('✅ AWS Logo Scene ready');
            
        } catch (error) {
            console.error('❌ Failed to initialize AWS Logo Scene:', error);
            throw error;
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        // Transparent background for layered rendering
        this.scene.background = null;
    }
    
    setupCamera() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
        
        // Position camera for optimal view of the logo group
        this.camera.position.set(5, 3, 8);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupControls() {
        // OrbitControls for mouse interaction (360° rotation, pan, zoom)
        this.controls = new OrbitControls(this.camera, this.canvas);
        
        // Configure controls for smooth interaction
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        
        // Set constraints for better user experience
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 1.5; // Limit bottom view
        
        // Auto-rotate when not interacting
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        
        console.log('🖱️ OrbitControls configured');
    }
    
    async loadAssets() {
        console.log('📦 Loading AWS Logo assets...');
        
        const loader = new THREE.TextureLoader();
        const fontLoader = new FontLoader();
        
        // Load AWS logo texture
        try {
            this.logoTexture = await new Promise((resolve, reject) => {
                loader.load(
                    './Amazon_Web_Services_Logo.png',
                    resolve,
                    undefined,
                    reject
                );
            });
            
            // Configure logo texture
            this.logoTexture.colorSpace = THREE.SRGBColorSpace;
            this.logoTexture.flipY = false;
            console.log('✅ AWS Logo texture loaded');
            
        } catch (error) {
            console.error('❌ Failed to load AWS Logo texture:', error);
            // Create fallback texture
            this.logoTexture = new THREE.CanvasTexture(this.createFallbackLogoCanvas());
        }
        
        // Load font for AMZN stock text
        try {
            this.font = await new Promise((resolve, reject) => {
                fontLoader.load(
                    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
                    resolve,
                    undefined,
                    reject
                );
            });
            console.log('✅ Font loaded for stock text');
            
        } catch (error) {
            console.warn('⚠️ Font loading failed, using fallback');
            this.font = null;
        }
    }
    
    createFallbackLogoCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        // Create simple AWS text as fallback
        ctx.fillStyle = '#FF9900';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AWS', canvas.width / 2, canvas.height / 2 + 16);
        
        return canvas;
    }
    
    setupLighting() {
        console.log('💡 Setting up 4-point lighting system...');
        
        // Get background dominant colors for lighting (simplified)
        const groundLeftColor = new THREE.Color(0xff0088);  // Magenta from background
        const groundRightColor = new THREE.Color(0x8800ff); // Purple from background
        const skyColor = new THREE.Color(0x0088ff);         // Blue from background
        
        // Light 1: Left bottom (ground left bottom dominant color)
        this.lights.leftBottom = new THREE.DirectionalLight(groundLeftColor, 1.5);
        this.lights.leftBottom.position.set(-10, -5, 5);
        this.scene.add(this.lights.leftBottom);
        
        // Light 2: Right bottom (ground right bottom dominant color)  
        this.lights.rightBottom = new THREE.DirectionalLight(groundRightColor, 1.5);
        this.lights.rightBottom.position.set(10, -5, 5);
        this.scene.add(this.lights.rightBottom);
        
        // Light 3: Upper (sky dominant color)
        this.lights.upper = new THREE.DirectionalLight(skyColor, 2.0);
        this.lights.upper.position.set(0, 15, 0);
        this.scene.add(this.lights.upper);
        
        // Light 4: Camera axis (white, positioned along camera viewing direction)
        this.lights.camera = new THREE.DirectionalLight(0xffffff, 1.0);
        this.scene.add(this.lights.camera);
        
        // Add ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        console.log('✅ Lighting system configured');
    }
    
    create3DComponents() {
        console.log('🔧 Creating 3D components...');
        
        // Create main group that will contain all components
        this.logoGroup = new THREE.Group();
        
        // Create glass box
        this.createGlassBox();
        
        // Create AWS logo plane
        this.createAWSLogo();
        
        // Create AMZN stock text
        this.createStockText();
        
        // Add group to scene
        this.scene.add(this.logoGroup);
        
        console.log('✅ 3D components created');
    }
    
    createGlassBox() {
        // Glass box dimensions (depth is 1/10 of width as specified)
        const width = 4;
        const height = 2;
        const depth = width / 10; // 1/10 of width as required
        
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        // Semi-transparent glass material
        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            transmission: 0.95,
            thickness: 0.5,
            roughness: 0.05,
            metalness: 0.0,
            reflectivity: 0.9,
            envMapIntensity: 1.0,
            side: THREE.DoubleSide // Visible from both sides
        });
        
        this.glassBox = new THREE.Mesh(geometry, this.glassMaterial);
        this.logoGroup.add(this.glassBox);
    }
    
    createAWSLogo() {
        // Create plane geometry for logo (placed ON one side, not inside)
        const logoWidth = 3;
        const logoHeight = 1.5;
        const geometry = new THREE.PlaneGeometry(logoWidth, logoHeight);
        
        // Logo material with strong metalness and mild roughness
        this.logoMaterial = new THREE.MeshPhysicalMaterial({
            map: this.logoTexture,
            transparent: true,
            opacity: 1.0, // Fully opaque as specified
            metalness: 0.8, // Strong metalness
            roughness: 0.3, // Mild roughness
            emissive: new THREE.Color(0x111111), // Slightly emissive
            envMapIntensity: 1.5,
            side: THREE.DoubleSide // Visible from backside as required
        });
        
        this.awsLogo = new THREE.Mesh(geometry, this.logoMaterial);
        
        // Position logo on front face of glass box (not inside)
        const glassDepth = 4 / 10; // Glass box depth
        this.awsLogo.position.z = glassDepth / 2 + 0.05; // Just in front
        
        this.logoGroup.add(this.awsLogo);
    }
    
    createStockText() {
        const stockValue = '$231.48'; // AMZN stock value from Perplexity
        
        if (this.font) {
            // Create 3D text geometry
            const textGeometry = new TextGeometry(stockValue, {
                font: this.font,
                size: 0.3,
                depth: 0.02, // Non-extruded as specified (very thin) - Updated for Three.js r164
                curveSegments: 12,
                bevelEnabled: false
            });
            
            // Center the text
            textGeometry.computeBoundingBox();
            const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
            textGeometry.translate(-textWidth / 2, 0, 0);
            
            // Reflective and slightly emissive material
            this.stockMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x00ff88, // Neon green color
                metalness: 0.9,
                roughness: 0.1,
                emissive: new THREE.Color(0x002211), // Slightly emissive
                envMapIntensity: 1.2
            });
            
            this.stockText = new THREE.Mesh(textGeometry, this.stockMaterial);
            
        } else {
            // Fallback: create simple plane with canvas texture
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(stockValue, canvas.width / 2, canvas.height / 2 + 8);
            
            const texture = new THREE.CanvasTexture(canvas);
            const geometry = new THREE.PlaneGeometry(1.5, 0.4);
            const material = new THREE.MeshBasicMaterial({ 
                map: texture, 
                transparent: true 
            });
            
            this.stockText = new THREE.Mesh(geometry, material);
        }
        
        // Position stock text below the AWS logo
        this.stockText.position.y = -1.2;
        this.stockText.position.z = 0.1; // Slightly in front of logo
        
        this.logoGroup.add(this.stockText);
    }
    
    setupEnvironmentReflection() {
        // Create environment map from background image for reflections
        const loader = new THREE.TextureLoader();
        
        loader.load('./output/desert_night_background.png', (texture) => {
            // Set equirectangular reflection mapping for environment reflections
            texture.mapping = THREE.EquirectangularReflectionMapping;
            
            // Apply to reflective materials
            this.logoMaterial.envMap = texture;
            this.glassMaterial.envMap = texture;
            if (this.stockMaterial) {
                this.stockMaterial.envMap = texture;
            }
            
            console.log('✅ Environment reflection setup complete');
        }, undefined, (error) => {
            console.warn('⚠️ Could not load environment texture for reflections:', error);
        });
    }
    
    update(deltaTime, elapsedTime) {
        if (!this.initialized) return;
        
        // Update OrbitControls
        this.controls.update();
        
        // Update camera-aligned light position
        this.lights.camera.position.copy(this.camera.position);
        this.lights.camera.lookAt(0, 0, 0);
        
        // Optional: Add subtle animation to the logo group
        if (!this.controls.enabled || this.controls.autoRotate) {
            this.logoGroup.rotation.y += this.rotationSpeed * deltaTime;
        }
    }
    
    render() {
        if (!this.initialized) return;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    
    dispose() {
        // Clean up resources
        if (this.logoTexture) this.logoTexture.dispose();
        if (this.logoMaterial) this.logoMaterial.dispose();
        if (this.glassMaterial) this.glassMaterial.dispose();
        if (this.stockMaterial) this.stockMaterial.dispose();
        
        this.controls.dispose();
        
        console.log('🗑️ AWS Logo Scene disposed');
    }
    
    // Debug helpers
    getInfo() {
        return {
            initialized: this.initialized,
            triangles: this.renderer.info.render.triangles,
            geometries: this.renderer.info.memory.geometries,
            textures: this.renderer.info.memory.textures,
            camera: {
                position: this.camera.position,
                rotation: this.camera.rotation
            },
            controls: {
                autoRotate: this.controls.autoRotate,
                enabled: this.controls.enabled
            }
        };
    }
}