/**
 * Shooting Star / Meteor System
 * 
 * Features:
 * - Realistic meteor atmospheric entry simulation
 * - 3D modeled sky and atmosphere with proper perspective
 * - Parallel meteor trajectories with ~20° entry angle
 * - Alpha-blended trails with distance-based length
 * - Realistic color variations and glowing effects
 * - Random spawning with burst patterns
 * - Coordinate system integration for skyline respect
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class ShootingStarSystem {
    constructor(renderer, coordinateSystem) {
        this.renderer = renderer;
        this.coordinateSystem = coordinateSystem;
        
        // Create shared camera that integrates with main coordinate system
        this.camera = new THREE.PerspectiveCamera(
            60,  // FOV
            window.innerWidth / window.innerHeight,  // Aspect
            0.1,   // Near
            100    // Far
        );
        this.setupCameraPosition();
        
        // Shooting star configuration based on WORK_TODO.md requirements
        this.config = {
            maxMeteors: 25,             // 25 simultaneous meteors max
            spawnRate: 2.0,             // Average 1 meteor every 0.5 seconds (2/sec)
            burstChance: 0.1,           // 10% chance for burst spawning
            burstCount: 5,              // 3-7 meteors in a burst
            
            // Meteor entry physics
            entryAngle: -20,            // Flat angle ~20° from horizontal
            entrySpeed: 25,             // Fast atmospheric entry
            speedVariation: 10,         // ±10 speed variation
            
            // Atmosphere and sky boundaries
            skyHeight: 25,              // Maximum spawn height
            atmosphereDepth: 30,        // Depth of atmosphere effect
            disintegrationHeight: 8,    // Height above ground where meteors burn up
            
            // Visual properties
            meteorSize: 0.8,            // Base meteor point size (increased for better visibility)
            trailLength: 160,           // Base trail segment count 
            trailSegments: 80,          // Number of trail segments
            
            // Colors (realistic meteor spectrum)
            meteorColors: [
                new THREE.Color(0xFFFFFF), // White (hottest)
                new THREE.Color(0xFFEE88), // Yellow-white
                new THREE.Color(0xFF8844), // Orange
                new THREE.Color(0xFF4422), // Red-orange
                new THREE.Color(0x8844FF), // Blue (rare, very hot)
                new THREE.Color(0x44FF88)  // Green (magnesium)
            ]
        };
        
        // System state
        this.scene = null;
        this.meteors = [];
        this.activeMeteors = 0;
        this.lastSpawnTime = 0;
        this.burstTimer = 0;
        this.time = 0;
        
        // Rendering objects
        this.meteorMesh = null;
        this.trailSystem = null;
        
        // Shader uniforms
        this.meteorUniforms = null;
        this.trailUniforms = null;
        
        this.initialized = false;
        this.init();
    }
    
    setupCameraPosition() {
        // Position camera to look at the sky area where meteors appear
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 15, -10); // Look up at sky
        
        // Integrate with coordinate system boundaries
        const skyHeight = this.coordinateSystem.SKY_CEILING || 25;
        this.camera.far = skyHeight * 3; // Ensure we can see all meteors
    }
    
    init() {
        console.log('🌠 Initializing Shooting Star System...');
        
        try {
            this.setupScene();
            this.createMeteorSystem();
            this.createTrailSystem();
            this.initializeMeteors();
            
            this.initialized = true;
            console.log('✅ Shooting Star System ready');
            
        } catch (error) {
            console.error('❌ Failed to initialize Shooting Star System:', error);
            throw error;
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        // Transparent background for layered rendering
        this.scene.background = null;
        
        // Setup atmosphere lighting for meteor visibility
        const ambientLight = new THREE.AmbientLight(0x001122, 0.1);
        this.scene.add(ambientLight);
        
        // Setup HDR Bloom Post-processing
        this.setupHDRBloom();
    }
    
    setupHDRBloom() {
        // Note: HDR Bloom with EffectComposer breaks transparency for layered rendering
        // Using enhanced shader-based glow instead to maintain transparent architecture
        console.log('✨ Enhanced shader-based glow initialized (preserving transparency)');
    }
    
    createMeteorSystem() {
        // Use Points geometry for better glow effects
        const meteorGeometry = new THREE.BufferGeometry();
        
        // Create positions for all possible meteors
        const positions = new Float32Array(this.config.maxMeteors * 3);
        const colors = new Float32Array(this.config.maxMeteors * 3);
        const sizes = new Float32Array(this.config.maxMeteors);
        const intensities = new Float32Array(this.config.maxMeteors);
        
        // Initialize all meteors as inactive (off-screen)
        for (let i = 0; i < this.config.maxMeteors; i++) {
            const i3 = i * 3;
            positions[i3] = 0;
            positions[i3 + 1] = -100; // Off-screen
            positions[i3 + 2] = 0;
            
            colors[i3] = 1.0;
            colors[i3 + 1] = 1.0;
            colors[i3 + 2] = 1.0;
            
            sizes[i] = 0.0;
            intensities[i] = 0.0;
        }
        
        meteorGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        meteorGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        meteorGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        meteorGeometry.setAttribute('intensity', new THREE.BufferAttribute(intensities, 1));
        
        // Enhanced meteor shader uniforms with realistic scaling
        this.meteorUniforms = {
            time: { value: 0.0 },
            atmosphereHeight: { value: this.config.skyHeight },
            glowIntensity: { value: 4.0 }, // Increased for better visibility
            pointScale: { value: 20.0 } // Realistic point size scaling
        };
        
        // Meteor shader material using Points
        const meteorMaterial = new THREE.ShaderMaterial({
            uniforms: this.meteorUniforms,
            vertexShader: this.getMeteorVertexShader(),
            fragmentShader: this.getMeteorFragmentShader(),
            
            transparent: true,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        this.meteorMesh = new THREE.Points(meteorGeometry, meteorMaterial);
        this.meteorMesh.renderOrder = 2; // Above vapor, below logo
        this.meteorMesh.frustumCulled = false;
        
        this.scene.add(this.meteorMesh);
    }
    
    createTrailSystem() {
        // Create simple line-based trail system for better visibility
        const trailGeometry = new THREE.BufferGeometry();
        
        // Create positions for trail lines (each meteor has multiple trail points)
        const trailPointsPerMeteor = 15; // Trail segments per meteor
        const totalPoints = this.config.maxMeteors * trailPointsPerMeteor;
        
        const positions = new Float32Array(totalPoints * 3);
        const colors = new Float32Array(totalPoints * 3);
        const alphas = new Float32Array(totalPoints); // Custom alpha channel
        
        // Initialize all trail points as inactive (off-screen)
        for (let i = 0; i < totalPoints; i++) {
            const i3 = i * 3;
            positions[i3] = 0;
            positions[i3 + 1] = -100; // Off-screen
            positions[i3 + 2] = 0;
            
            colors[i3] = 1.0;
            colors[i3 + 1] = 1.0;
            colors[i3 + 2] = 1.0;
            
            alphas[i] = 0.0; // Transparent
        }
        
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        trailGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        trailGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        
        // Trail shader uniforms
        this.trailUniforms = {
            time: { value: 0.0 },
            trailSegments: { value: 15.0 } // Segments per meteor trail
        };
        
        // Trail material using custom shaders for proper alpha gradient
        const trailMaterial = new THREE.ShaderMaterial({
            uniforms: this.trailUniforms,
            vertexShader: this.getTrailVertexShader(),
            fragmentShader: this.getTrailFragmentShader(),
            
            transparent: true,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });
        
        this.trailSystem = new THREE.LineSegments(trailGeometry, trailMaterial);
        this.trailSystem.renderOrder = 1; // Below meteors
        this.trailSystem.frustumCulled = false;
        
        // Store trail configuration
        this.trailConfig = {
            pointsPerMeteor: trailPointsPerMeteor,
            totalPoints: totalPoints
        };
        
        this.scene.add(this.trailSystem);
        
        console.log(`🌟 Trail system: ${this.config.maxMeteors} meteors × ${trailPointsPerMeteor} points = ${totalPoints} trail points`);
    }
    
    getMeteorVertexShader() {
        return `
            // Built-in attributes (don't redefine)
            // attribute vec3 position; - provided by Three.js
            // attribute vec3 color; - provided by Three.js when vertexColors = true
            
            // Custom attributes
            attribute float size;
            attribute float intensity;
            
            // Built-in uniforms (don't redefine)
            // uniform mat4 modelViewMatrix; - provided by Three.js
            // uniform mat4 projectionMatrix; - provided by Three.js
            
            // Custom uniforms
            uniform float time;
            uniform float atmosphereHeight;
            uniform float glowIntensity;
            uniform float pointScale;
            
            // Varying to fragment shader
            varying vec3 vColor;
            varying float vIntensity;
            varying float vSize;
            
            void main() {
                // Skip inactive meteors
                if (size <= 0.0 || intensity <= 0.0) {
                    gl_Position = vec4(0, 0, 0, 0);
                    gl_PointSize = 0.0;
                    return;
                }
                
                // Calculate atmospheric effects based on altitude
                float altitude = clamp(position.y / atmosphereHeight, 0.0, 1.0);
                float atmosphericGlow = 1.0 + altitude * glowIntensity * 0.3;
                
                // World position using built-in uniforms
                vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * worldPosition;
                
                // Calculate realistic point size with atmospheric glow and distance scaling
                float distance = length(worldPosition.xyz);
                float sizeScale = size * atmosphericGlow * pointScale / (1.0 + distance * 0.05);
                gl_PointSize = clamp(sizeScale, 1.0, 25.0); // Realistic meteor point size range
                
                // Pass to fragment shader
                vColor = color;  // Built-in color attribute
                vIntensity = intensity * atmosphericGlow;
                vSize = gl_PointSize;
            }
        `;
    }
    
    getMeteorFragmentShader() {
        return `
            precision highp float;
            
            varying vec3 vColor;
            varying float vIntensity;
            varying float vSize;
            
            // Color temperature conversion for realistic meteor heating
            vec3 blackbody(float temperature) {
                temperature = clamp(temperature, 3000.0, 8000.0);
                
                if (temperature < 6600.0) {
                    float t = temperature / 100.0;
                    return vec3(
                        1.0,
                        clamp(0.39 * log(t) - 0.63, 0.0, 1.0),
                        t < 19.0 ? 0.0 : clamp(0.54 * log(t - 10.0) - 1.2, 0.0, 1.0)
                    );
                } else {
                    float t = temperature / 100.0;
                    return vec3(
                        clamp(1.29 * pow(t - 60.0, -0.13), 0.0, 1.0),
                        clamp(1.13 * pow(t - 60.0, -0.08), 0.0, 1.0),
                        1.0
                    );
                }
            }
            
            void main() {
                // Skip inactive meteors
                if (vIntensity <= 0.0) {
                    discard;
                }
                
                // Create realistic meteor with multiple glow layers
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord) * 2.0; // Scale to fill point
                
                // Multi-layer glow for realistic appearance
                float core = exp(-dist * 12.0) * vIntensity;        // Hot center
                float innerGlow = exp(-dist * 6.0) * vIntensity * 0.7;  // Inner atmosphere
                float outerGlow = exp(-dist * 2.5) * vIntensity * 0.4;  // Outer atmosphere
                float halo = exp(-dist * 1.0) * vIntensity * 0.15;      // Atmospheric halo
                
                // Combine all layers
                float totalIntensity = core + innerGlow + outerGlow + halo;
                
                // Dynamic color temperature based on intensity (hotter = whiter/bluer)
                float temperature = 4000.0 + vIntensity * 2500.0;
                vec3 heatColor = blackbody(temperature);
                
                // Blend meteor color with heating effects
                vec3 finalColor = mix(vColor, heatColor, vIntensity * 0.6);
                
                // Add atmospheric scattering (blue shift at edges)
                finalColor += vec3(0.1, 0.2, 0.4) * outerGlow * 0.5;
                
                // Boost brightness for visibility and realism
                finalColor *= (1.0 + vIntensity * 1.5);
                
                // Calculate final alpha
                float alpha = totalIntensity * clamp(vIntensity, 0.0, 1.0);
                
                gl_FragColor = vec4(finalColor, alpha);
                
                if (alpha < 0.02) discard;
            }
        `;
    }
    
    getTrailVertexShader() {
        return `
            // Built-in attributes
            // attribute vec3 position; - provided by Three.js
            // attribute vec3 color; - provided by Three.js when vertexColors = true
            
            // Custom attributes for trail alpha
            attribute float alpha;
            
            // Built-in uniforms
            // uniform mat4 modelViewMatrix; - provided by Three.js
            // uniform mat4 projectionMatrix; - provided by Three.js
            
            // Custom uniforms
            uniform float time;
            uniform float trailSegments;
            
            // Varying to fragment shader
            varying vec3 vColor;
            varying float vAlpha;
            varying float vDistanceAlongTrail;
            
            void main() {
                // Skip inactive trail segments (alpha = 0)
                if (alpha <= 0.0) {
                    gl_Position = vec4(0, 0, 0, 0);
                    return;
                }
                
                // Transform position
                vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * worldPosition;
                
                // Calculate distance along trail for gradient effect
                // Use vertex index to determine position in trail
                vDistanceAlongTrail = alpha; // Alpha already contains fade value from updateTrailData
                
                // Pass to fragment shader
                vColor = color;  // Built-in color attribute
                vAlpha = alpha;
            }
        `;
    }
    
    getTrailFragmentShader() {
        return `
            precision highp float;
            
            // From vertex shader
            varying vec3 vColor;
            varying float vAlpha;
            varying float vDistanceAlongTrail;
            
            void main() {
                // Skip inactive trail segments
                if (vAlpha <= 0.0) {
                    discard;
                }
                
                // Enhanced trail with multiple glow layers for realistic meteor trail
                // Core trail - bright center line
                float coreTrail = 1.0;
                
                // Atmospheric glow - softer outer glow
                float glowTrail = 0.7;
                
                // Combine trail layers with alpha fade
                float trailIntensity = coreTrail + glowTrail;
                
                // Apply the alpha gradient (strong at meteor head, fading to tail)
                float alpha = vAlpha * trailIntensity;
                
                // Enhanced trail brightness for visibility
                vec3 finalColor = vColor * (1.5 + alpha * 0.5);
                
                // Add slight atmospheric scattering for realism
                finalColor += vec3(0.1, 0.15, 0.3) * alpha * 0.3;
                
                gl_FragColor = vec4(finalColor, alpha);
                
                // Discard very faint fragments for performance
                if (alpha < 0.01) discard;
            }
        `;
    }
    
    initializeMeteors() {
        this.meteors = [];
        
        for (let i = 0; i < this.config.maxMeteors; i++) {
            this.meteors.push({
                active: false,
                state: 0, // 0=inactive, 1=active, 2=disintegrating
                
                // Position and movement
                position: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                
                // Timing
                age: 0,
                lifetime: 0,
                disintegrationTimer: 0,
                
                // Visual properties
                size: 0,
                intensity: 0,
                color: new THREE.Color(),
                
                // Trail properties
                trailLength: 0,
                trailIntensity: 0,
                trailHistory: [], // Initialize empty trail history array
                
                // Physics
                atmosphericDrag: 0.98,
                heatingFactor: 1.0
            });
        }
        
        this.activeMeteors = 0;
    }
    
    spawnMeteor() {
        // Find inactive meteor
        const meteorIndex = this.meteors.findIndex(m => !m.active);
        if (meteorIndex === -1) return;
        
        const meteor = this.meteors[meteorIndex];
        
        // Generate spawn position at top of sky, always visible from screen top
        const spawnRadius = 25; // Wide spawn area
        const angle = Math.random() * Math.PI * 2;
        
        // Spawn at sky height, positioned to be visible
        meteor.position.set(
            Math.cos(angle) * spawnRadius,
            this.config.skyHeight + Math.random() * 5, // Above sky ceiling
            Math.sin(angle) * spawnRadius
        );
        
        // Create parallel trajectory with ~20° entry angle
        const entryAngleRad = THREE.MathUtils.degToRad(this.config.entryAngle);
        const speed = this.config.entrySpeed + (Math.random() - 0.5) * this.config.speedVariation;
        
        meteor.velocity.set(
            (Math.random() - 0.5) * 2,  // Small horizontal variation
            Math.sin(entryAngleRad) * speed,  // Downward trajectory
            Math.cos(entryAngleRad) * speed   // Forward movement
        );
        
        // Initialize meteor properties
        meteor.active = true;
        meteor.state = 1; // active
        meteor.age = 0;
        meteor.lifetime = 3 + Math.random() * 2; // 3-5 seconds visible
        
        meteor.size = this.config.meteorSize * (0.5 + Math.random() * 1.5);
        meteor.intensity = 0.8 + Math.random() * 0.4;
        
        // Random meteor color based on composition
        const colorIndex = Math.floor(Math.random() * this.config.meteorColors.length);
        meteor.color.copy(this.config.meteorColors[colorIndex]);
        
        // Trail properties based on altitude
        const altitude = meteor.position.y / this.config.skyHeight;
        meteor.trailLength = this.config.trailLength * (0.5 + altitude * 1.5);
        meteor.trailIntensity = meteor.intensity;
        
        // Atmospheric properties
        meteor.atmosphericDrag = 0.995 + Math.random() * 0.004;
        meteor.heatingFactor = 1.0 + altitude * 0.5;
        
        this.activeMeteors++;
        this.updateMeteorInstanceData(meteorIndex, meteor);
        
        console.log(`🌟 Meteor spawned at altitude ${meteor.position.y.toFixed(1)} with ${meteor.trailLength.toFixed(0)} trail length`);
    }
    
    updateMeteorInstanceData(index, meteor) {
        // Update meteor head using new Points geometry
        const positions = this.meteorMesh.geometry.attributes.position.array;
        const colors = this.meteorMesh.geometry.attributes.color.array;
        const sizes = this.meteorMesh.geometry.attributes.size.array;
        const intensities = this.meteorMesh.geometry.attributes.intensity.array;
        
        const i3 = index * 3;
        
        // Position
        positions[i3 + 0] = meteor.position.x;
        positions[i3 + 1] = meteor.position.y;
        positions[i3 + 2] = meteor.position.z;
        
        // Color
        colors[i3 + 0] = meteor.color.r;
        colors[i3 + 1] = meteor.color.g;
        colors[i3 + 2] = meteor.color.b;
        
        // Size and intensity (0 = inactive) - realistic meteor point size
        sizes[index] = meteor.active ? meteor.size : 0; // Realistic size without excessive scaling
        intensities[index] = meteor.active ? meteor.intensity : 0;
        
        // Update trail if it exists
        if (this.trailSystem && meteor.active) {
            this.updateTrailData(index, meteor);
        }
    }
    
    updateTrailData(index, meteor) {
        if (!this.trailSystem || !meteor.active) return;
        
        // Check if trail geometry attributes exist
        const geometry = this.trailSystem.geometry;
        if (!geometry.attributes.position || !geometry.attributes.color) {
            return; // Skip trail update if geometry not ready
        }
        
        // Ensure trail history exists
        if (!meteor.trailHistory) {
            meteor.trailHistory = [];
        }
        
        // Add current position to trail history
        meteor.trailHistory.unshift({
            position: meteor.position.clone(),
            age: meteor.age
        });
        
        // Limit trail length
        const maxTrailLength = this.trailConfig.pointsPerMeteor;
        if (meteor.trailHistory.length > maxTrailLength) {
            meteor.trailHistory.splice(maxTrailLength);
        }
        
        // Check if arrays are accessible
        if (!geometry.attributes.position.array || !geometry.attributes.color.array) {
            console.warn('Trail geometry arrays not accessible');
            return;
        }
        
        // Update trail geometry with line segments and alpha gradient
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const alphas = geometry.attributes.alpha.array;
        
        const startIndex = index * maxTrailLength;
        
        // Update trail points for line segments
        for (let i = 0; i < maxTrailLength - 1; i++) {
            const segmentIndex = startIndex + i;
            const i6 = segmentIndex * 6; // 2 points per segment, 3 coords per point
            const i2 = segmentIndex * 2; // 2 alpha values per segment
            
            if (i < meteor.trailHistory.length - 1) {
                const point1 = meteor.trailHistory[i];
                const point2 = meteor.trailHistory[i + 1];
                
                // Line segment start point
                positions[i6 + 0] = point1.position.x;
                positions[i6 + 1] = point1.position.y;
                positions[i6 + 2] = point1.position.z;
                
                // Line segment end point
                positions[i6 + 3] = point2.position.x;
                positions[i6 + 4] = point2.position.y;
                positions[i6 + 5] = point2.position.z;
                
                // Alpha gradient: strong at meteor head (1.0), fading to tail (0.0)
                const alpha1 = Math.max(0, 1.0 - (i / maxTrailLength)) * meteor.trailIntensity;
                const alpha2 = Math.max(0, 1.0 - ((i + 1) / maxTrailLength)) * meteor.trailIntensity;
                
                // Colors for both points (maintain brightness)
                colors[i6 + 0] = meteor.color.r;
                colors[i6 + 1] = meteor.color.g;
                colors[i6 + 2] = meteor.color.b;
                
                colors[i6 + 3] = meteor.color.r;
                colors[i6 + 4] = meteor.color.g;
                colors[i6 + 5] = meteor.color.b;
                
                // Alpha values for gradient effect
                alphas[i2 + 0] = alpha1; // Start point alpha
                alphas[i2 + 1] = alpha2; // End point alpha
                
            } else {
                // Inactive segment - move off-screen
                for (let j = 0; j < 6; j++) {
                    positions[i6 + j] = (j % 3 === 1) ? -100 : 0; // Y = -100, X,Z = 0
                    colors[i6 + j] = 0;
                }
                
                // Set alpha to 0 for inactive segments
                alphas[i2 + 0] = 0.0;
                alphas[i2 + 1] = 0.0;
            }
        }
    }
    
    update(deltaTime, elapsedTime) {
        if (!this.initialized) return;
        
        this.time = elapsedTime;
        this.meteorUniforms.time.value = this.time;
        
        // Update trail uniforms
        if (this.trailUniforms) {
            this.trailUniforms.time.value = this.time;
        }
        
        // Update camera position for LOD calculations (removed - not needed for Points system)
        // this.meteorUniforms.cameraPosition.value.copy(this.camera.position);
        
        // Handle spawning (with burst capability)
        this.handleSpawning(deltaTime, elapsedTime);
        
        // Update all active meteors
        let needsUpdate = false;
        
        for (let i = 0; i < this.meteors.length; i++) {
            const meteor = this.meteors[i];
            if (!meteor.active) continue;
            
            // Update meteor physics and state
            this.updateMeteorPhysics(meteor, deltaTime);
            
            // Check for disintegration or removal
            if (this.shouldDisintegrate(meteor) || meteor.age >= meteor.lifetime) {
                this.disintegrateMeteor(meteor);
                this.activeMeteors--;
                needsUpdate = true;
            }
            
            // Update instance data
            this.updateMeteorInstanceData(i, meteor);
            needsUpdate = true;
        }
        
        // Mark geometry for update
        if (needsUpdate) {
            this.meteorMesh.geometry.attributes.position.needsUpdate = true;
            this.meteorMesh.geometry.attributes.color.needsUpdate = true;
            this.meteorMesh.geometry.attributes.size.needsUpdate = true;
            this.meteorMesh.geometry.attributes.intensity.needsUpdate = true;
            
            if (this.trailSystem) {
                this.trailSystem.geometry.attributes.position.needsUpdate = true;
                this.trailSystem.geometry.attributes.color.needsUpdate = true;
                if (this.trailSystem.geometry.attributes.alpha) {
                    this.trailSystem.geometry.attributes.alpha.needsUpdate = true;
                }
            }
        }
    }
    
    handleSpawning(deltaTime, elapsedTime) {
        const spawnInterval = 1.0 / this.config.spawnRate;
        
        // Check for regular spawning
        if (elapsedTime - this.lastSpawnTime > spawnInterval) {
            if (this.activeMeteors < this.config.maxMeteors) {
                this.spawnMeteor();
                this.lastSpawnTime = elapsedTime;
                
                // Check for burst spawning
                if (Math.random() < this.config.burstChance) {
                    const burstCount = Math.floor(Math.random() * 4) + 2; // 2-5 meteors
                    console.log(`💥 Meteor burst! Spawning ${burstCount} meteors`);
                    
                    for (let i = 0; i < burstCount && this.activeMeteors < this.config.maxMeteors; i++) {
                        setTimeout(() => this.spawnMeteor(), i * 100); // Stagger burst spawning
                    }
                }
            }
        }
    }
    
    updateMeteorPhysics(meteor, deltaTime) {
        // Update age
        meteor.age += deltaTime;
        
        // Apply atmospheric drag
        meteor.velocity.multiplyScalar(meteor.atmosphericDrag);
        
        // Update position
        meteor.position.add(
            meteor.velocity.clone().multiplyScalar(deltaTime)
        );
        
        // Atmospheric heating increases brightness as meteor descends
        const altitude = meteor.position.y / this.config.skyHeight;
        meteor.intensity = Math.min(2.0, meteor.intensity * (1 + (1 - altitude) * deltaTime));
        
        // Trail length decreases with altitude
        meteor.trailLength = this.config.trailLength * (0.3 + altitude * 1.2);
        meteor.trailIntensity = meteor.intensity * 0.8;
    }
    
    shouldDisintegrate(meteor) {
        // Disintegrate when reaching disintegration height or below skyline
        const skylineWorldY = this.config.disintegrationHeight;
        return meteor.position.y <= skylineWorldY;
    }
    
    disintegrateMeteor(meteor) {
        console.log(`💥 Meteor disintegrated at height ${meteor.position.y.toFixed(1)}`);
        
        // Create disintegration flash effect
        this.createDisintegrationFlash(meteor.position.clone());
        
        meteor.active = false;
        meteor.state = 0;
        meteor.intensity = 0;
        meteor.trailIntensity = 0;
        
        // Clear trail history safely
        if (meteor.trailHistory) {
            meteor.trailHistory.length = 0; // Clear array contents
        } else {
            meteor.trailHistory = []; // Initialize if missing
        }
    }
    
    createDisintegrationFlash(position) {
        // Create simple particle burst for disintegration flash
        const flashGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });
        
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        flash.position.copy(position);
        this.scene.add(flash);
        
        // Animate flash - quick expand and fade
        const startTime = this.time;
        const flashDuration = 0.2; // 200ms flash
        
        const animateFlash = () => {
            const elapsed = this.time - startTime;
            const progress = elapsed / flashDuration;
            
            if (progress >= 1.0) {
                this.scene.remove(flash);
                flashGeometry.dispose();
                flashMaterial.dispose();
                return;
            }
            
            // Scale expansion with fade out
            const scale = 1 + progress * 3; // Expand to 4x size
            flash.scale.setScalar(scale);
            flashMaterial.opacity = 1.0 - progress; // Fade out
            
            requestAnimationFrame(animateFlash);
        };
        
        animateFlash();
    }
    
    render() {
        if (!this.initialized) return;
        
        // Render with our integrated camera
        this.renderer.render(this.scene, this.camera);
    }
    
    // Handle window resize for bloom composer
    handleResize(width, height) {
        if (this.composer) {
            this.composer.setSize(width, height);
        }
        
        if (this.bloomPass) {
            this.bloomPass.resolution.set(width, height);
        }
    }
    
    // Handle window resize
    handleResize(width, height) {
        if (this.camera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
        
        if (this.meteorUniforms && this.meteorUniforms.pointScale) {
            this.meteorUniforms.pointScale.value = 20.0; // Fixed realistic scale
        }
    }
    
    // Debug and info methods
    getInfo() {
        return {
            initialized: this.initialized,
            activeMeteors: this.activeMeteors,
            maxMeteors: this.config.maxMeteors,
            meteorCount: this.activeMeteors // For debug display
        };
    }
    
    dispose() {
        if (this.meteorMesh) {
            this.meteorMesh.geometry.dispose();
            this.meteorMesh.material.dispose();
        }
        
        if (this.trailSystem) {
            this.trailSystem.geometry.dispose();
            this.trailSystem.material.dispose();
        }
        
        console.log('🗑️ Shooting Star System disposed');
    }
}