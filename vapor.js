/**
 * Ground Vapor Particle System
 * 
 * Features:
 * - Realistic ground-hugging vapor behavior with terrain-following
 * - Morphing neon-colored vapors with mitosis effects (splitting/merging)
 * - InstancedBufferGeometry for efficient particle rendering
 * - GLSL shaders with Perlin noise for organic morphology
 * - Coordinate system integration with 2D background perspective
 */

import * as THREE from 'three';

export class VaporSystem {
    constructor(renderer, coordinateSystem) {
        this.renderer = renderer;
        this.coordinateSystem = coordinateSystem;
        
        // Vapor configuration based on WORK_TODO.md requirements
        this.config = {
            maxParticles: 15,           // 15 simultaneous particles (1 spawn/sec, 15s lifetime)
            spawnRate: 1.0,             // Average 1 vapor every 1 second
            baseLifetime: 15.0,         // Base lifetime of 15 seconds
            lifetimeVariation: 5.0,     // ±5 seconds variation
            
            // Vapor appearance
            baseSize: 2.0,              // Base particle size
            sizeVariation: 1.0,         // Size randomization
            neonColors: [               // Neon color palette
                new THREE.Color(0x00ff88), // Neon green
                new THREE.Color(0xff0088), // Neon magenta
                new THREE.Color(0x0088ff), // Neon blue
                new THREE.Color(0x88ff00), // Neon lime
                new THREE.Color(0xff8800), // Neon orange
                new THREE.Color(0x8800ff)  // Neon purple
            ],
            
            // Enhanced Physics for better movement visibility
            windSpeed: 2.0,             // Increased wind speed for visible movement
            windDirection: new THREE.Vector3(0.3, 0, 0.15), // Stronger wind direction
            groundHugging: 0.8,         // Slightly less aggressive ground hugging
            mitosisChance: 0.02,        // 2% chance per second for mitosis
        };
        
        // System state
        this.scene = null;
        this.particles = [];
        this.activeParticles = 0;
        this.lastSpawnTime = 0;
        this.time = 0;
        
        // Rendering objects
        this.instancedMesh = null;
        this.geometry = null;
        this.material = null;
        
        // Shader uniforms
        this.uniforms = null;
        
        this.initialized = false;
        this.init();
    }
    
    init() {
        console.log('🌫️ Initializing Ground Vapor System...');
        
        try {
            this.setupScene();
            this.createGeometry();
            this.createMaterial();
            this.createInstancedMesh();
            this.initializeParticles();
            
            this.initialized = true;
            console.log('✅ Ground Vapor System ready');
            
        } catch (error) {
            console.error('❌ Failed to initialize Ground Vapor System:', error);
            throw error;
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        // Transparent background for layered rendering
        this.scene.background = null;
    }
    
    createGeometry() {
        // Use plane geometry for vapor particles (billboards)
        this.geometry = new THREE.InstancedBufferGeometry();
        
        // Base quad geometry
        const baseGeometry = new THREE.PlaneGeometry(1, 1, 4, 4);
        this.geometry.index = baseGeometry.index;
        this.geometry.attributes = baseGeometry.attributes;
        
        // Instance attributes for each vapor particle
        const instanceCount = this.config.maxParticles;
        
        // Position (x, y, z)
        const instancePositions = new Float32Array(instanceCount * 3);
        
        // Scale and rotation (scale, rotationZ, age, lifetime)
        const instanceData = new Float32Array(instanceCount * 4);
        
        // Color and opacity (r, g, b, opacity)
        const instanceColor = new Float32Array(instanceCount * 4);
        
        // Velocity and state (vx, vy, vz, state)
        // State: 0=inactive, 1=spawning, 2=growing, 3=stable, 4=mitosis, 5=fading
        const instanceVelocity = new Float32Array(instanceCount * 4);
        
        // Initialize with inactive particles
        for (let i = 0; i < instanceCount; i++) {
            const i3 = i * 3;
            const i4 = i * 4;
            
            // Position (initially off-screen)
            instancePositions[i3 + 0] = 0;
            instancePositions[i3 + 1] = -100; // Below ground
            instancePositions[i3 + 2] = 0;
            
            // Data (scale, rotation, age, lifetime)
            instanceData[i4 + 0] = 0; // scale
            instanceData[i4 + 1] = 0; // rotation
            instanceData[i4 + 2] = 0; // age
            instanceData[i4 + 3] = 0; // lifetime
            
            // Color (transparent)
            instanceColor[i4 + 0] = 1;
            instanceColor[i4 + 1] = 1;
            instanceColor[i4 + 2] = 1;
            instanceColor[i4 + 3] = 0; // opacity
            
            // Velocity and state (inactive)
            instanceVelocity[i4 + 0] = 0; // vx
            instanceVelocity[i4 + 1] = 0; // vy  
            instanceVelocity[i4 + 2] = 0; // vz
            instanceVelocity[i4 + 3] = 0; // state (inactive)
        }
        
        this.geometry.setAttribute('instancePosition', new THREE.InstancedBufferAttribute(instancePositions, 3));
        this.geometry.setAttribute('instanceData', new THREE.InstancedBufferAttribute(instanceData, 4));
        this.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(instanceColor, 4));
        this.geometry.setAttribute('instanceVelocity', new THREE.InstancedBufferAttribute(instanceVelocity, 4));
    }
    
    createMaterial() {
        // Shader uniforms
        this.uniforms = {
            time: { value: 0.0 },
            windDirection: { value: this.config.windDirection.clone() },
            groundLevel: { value: this.coordinateSystem.GROUND_LEVEL },
            noiseScale: { value: 0.02 },
            morphingSpeed: { value: 2.0 }
        };
        
        // Custom shader material for vapor effects
        this.material = new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            
            // Enhanced transparency settings for better visibility
            transparent: true,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending, // Better visibility than AdditiveBlending
            side: THREE.DoubleSide,
            alphaTest: 0.01 // Discard very transparent pixels
        });
        
        console.log('🎨 Vapor material configured with NormalBlending for enhanced visibility');
    }
    
    getVertexShader() {
        return `
            precision highp float;
            
            // Base geometry attributes
            attribute vec3 position;
            attribute vec2 uv;
            
            // Instance attributes
            attribute vec3 instancePosition;
            attribute vec4 instanceData; // scale, rotation, age, lifetime
            attribute vec4 instanceColor; // r, g, b, opacity
            attribute vec4 instanceVelocity; // vx, vy, vz, state
            
            // Uniforms
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform float time;
            uniform vec3 windDirection;
            uniform float groundLevel;
            uniform float noiseScale;
            uniform float morphingSpeed;
            
            // Varyings
            varying vec2 vUv;
            varying vec4 vColor;
            varying float vAge;
            varying float vNoiseValue;
            
            // Perlin noise function (simplified)
            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            }
            
            float perlinNoise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                
                f = f * f * (3.0 - 2.0 * f);
                
                float n000 = noise(i + vec3(0.0, 0.0, 0.0));
                float n100 = noise(i + vec3(1.0, 0.0, 0.0));
                float n010 = noise(i + vec3(0.0, 1.0, 0.0));
                float n110 = noise(i + vec3(1.0, 1.0, 0.0));
                float n001 = noise(i + vec3(0.0, 0.0, 1.0));
                float n101 = noise(i + vec3(1.0, 0.0, 1.0));
                float n011 = noise(i + vec3(0.0, 1.0, 1.0));
                float n111 = noise(i + vec3(1.0, 1.0, 1.0));
                
                float nx00 = mix(n000, n100, f.x);
                float nx10 = mix(n010, n110, f.x);
                float nx01 = mix(n001, n101, f.x);
                float nx11 = mix(n011, n111, f.x);
                
                float ny0 = mix(nx00, nx10, f.y);
                float ny1 = mix(nx01, nx11, f.y);
                
                return mix(ny0, ny1, f.z);
            }
            
            void main() {
                // Get instance data
                float scale = instanceData.x;
                float rotation = instanceData.y;
                float age = instanceData.z;
                float lifetime = instanceData.w;
                float state = instanceVelocity.w;
                
                // Skip inactive particles
                if (state == 0.0 || scale <= 0.0) {
                    gl_Position = vec4(0, 0, 0, 0);
                    return;
                }
                
                // Calculate age factor (0 to 1)
                vAge = age / max(lifetime, 0.001);
                
                // Apply morphing with noise
                vec3 noisePos = instancePosition * noiseScale + time * morphingSpeed;
                vNoiseValue = perlinNoise(noisePos);
                
                // Create morphing effect
                vec3 morphOffset = vec3(
                    sin(time + instancePosition.x) * 0.3,
                    0.0, // Keep ground-hugging
                    cos(time + instancePosition.z) * 0.3
                ) * vNoiseValue * scale;
                
                // Ground-hugging behavior
                vec3 worldPos = instancePosition + morphOffset;
                worldPos.y = max(worldPos.y, groundLevel + 0.1); // Stay above ground
                
                // Apply wind effect
                vec3 windOffset = windDirection * age * 0.5;
                worldPos += windOffset;
                
                // Rotation matrix for billboard
                float cosR = cos(rotation);
                float sinR = sin(rotation);
                mat2 rotMatrix = mat2(cosR, -sinR, sinR, cosR);
                
                // Apply scale and rotation to vertex position
                vec3 vertexPos = position * scale;
                vertexPos.xz = rotMatrix * vertexPos.xz;
                
                // Final world position
                vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
                mvPosition.xyz += vertexPos;
                
                gl_Position = projectionMatrix * mvPosition;
                
                // Pass data to fragment shader
                vUv = uv;
                vColor = instanceColor;
            }
        `;
    }
    
    getFragmentShader() {
        return `
            precision highp float;
            
            varying vec2 vUv;
            varying vec4 vColor;
            varying float vAge;
            varying float vNoiseValue;
            
            uniform float time;
            
            // Fractal Brownian Motion for complex vapor patterns
            float fbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;
                for (int i = 0; i < 4; i++) {
                    value += amplitude * fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                    p *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
            
            void main() {
                // Create circular vapor shape with soft edges
                vec2 center = vUv - 0.5;
                float dist = length(center);
                
                // Enhanced circular falloff for better visibility
                float circle = 1.0 - smoothstep(0.2, 0.6, dist);
                
                // Add noise for organic shape
                vec2 noisePos = vUv * 6.0 + time * 0.3;
                float noise = fbm(noisePos) * 0.4;
                circle = circle + noise - 0.1;
                circle = max(0.0, circle);
                
                // Enhanced glow effect for visibility
                float glow = exp(-dist * 2.0) * 1.2;
                
                // Combine shape and glow with higher intensity
                float alpha = (circle * 0.8 + glow * 0.5) * vColor.a;
                
                // More gradual age-based fade
                if (vAge < 0.15) {
                    alpha *= vAge / 0.15; // Slower fade in
                } else if (vAge > 0.85) {
                    alpha *= (1.0 - vAge) / 0.15; // Slower fade out
                }
                
                // Enhanced color with stronger neon brightness
                vec3 finalColor = vColor.rgb * 2.5; // Stronger boost for better visibility
                
                gl_FragColor = vec4(finalColor, alpha);
                
                // Lower threshold for discarding pixels
                if (alpha < 0.005) discard;
            }
        `;
    }
    
    createInstancedMesh() {
        this.instancedMesh = new THREE.InstancedMesh(
            this.geometry,
            this.material,
            this.config.maxParticles
        );
        
        // Apply significant scaling based on Three.js best practices
        this.instancedMesh.scale.set(10, 10, 10); // Scale up particles for visibility
        
        // Set render order for proper transparency
        this.instancedMesh.renderOrder = 1;
        this.instancedMesh.frustumCulled = false; // Don't cull particles
        
        console.log('🔧 Vapor mesh scaled by 10x for visibility');
        
        this.scene.add(this.instancedMesh);
    }
    
    initializeParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.maxParticles; i++) {
            this.particles.push({
                active: false,
                state: 0, // 0=inactive, 1=spawning, 2=growing, 3=stable, 4=mitosis, 5=fading
                age: 0,
                lifetime: 0,
                position: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                scale: 0,
                targetScale: 1,
                rotation: 0,
                rotationSpeed: 0,
                color: new THREE.Color(),
                opacity: 0,
                targetOpacity: 0.7,
                mitosisTimer: 0
            });
        }
        
        this.activeParticles = 0;
    }
    
    spawnVapor() {
        // Find inactive particle
        const particleIndex = this.particles.findIndex(p => !p.active);
        if (particleIndex === -1) return; // No free particles
        
        const particle = this.particles[particleIndex];
        
        // Use coordinate system for proper 2D to 3D mapping
        const screenRadius = 800; // Screen space radius for spawning
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * screenRadius;
        
        // Generate screen coordinates for ground level
        const screenX = this.coordinateSystem.SCREEN_WIDTH/2 + Math.cos(angle) * radius;
        const screenY = this.coordinateSystem.GROUND_Y + Math.random() * 50; // Near ground level
        
        // DEBUG: Log coordinate system boundaries
        console.log(`🔍 [VAPOR DEBUG] Coordinate system: GROUND_Y=${this.coordinateSystem.GROUND_Y}, HORIZON_Y=${this.coordinateSystem.HORIZON_Y}, GROUND_LEVEL=${this.coordinateSystem.GROUND_LEVEL}`);
        console.log(`🔍 [VAPOR DEBUG] Input screen coords: (${screenX.toFixed(0)}, ${screenY.toFixed(0)})`);
        
        // Convert to 3D world coordinates
        const world3D = this.coordinateSystem.screenTo3D(screenX, screenY);
        
        // DEBUG: Check if coordinate conversion is working correctly
        const expectedGroundY = this.coordinateSystem.GROUND_LEVEL; // Should be 0
        console.log(`🔍 [VAPOR DEBUG] Converted 3D coords: (${world3D.x.toFixed(2)}, ${world3D.y.toFixed(2)}, ${world3D.z.toFixed(2)}), expected ground Y: ${expectedGroundY}`);
        
        particle.position.set(
            world3D.x,
            Math.max(this.coordinateSystem.GROUND_LEVEL, world3D.y),
            world3D.z
        );
        
        // DEBUG: Log final particle position
        console.log(`🔍 [VAPOR DEBUG] Final particle position after Math.max: (${particle.position.x.toFixed(2)}, ${particle.position.y.toFixed(2)}, ${particle.position.z.toFixed(2)})`);
        
        console.log(`🌫️ Spawning vapor ${particleIndex} at screen(${screenX.toFixed(0)}, ${screenY.toFixed(0)}) -> 3D(${world3D.x.toFixed(2)}, ${world3D.y.toFixed(2)}, ${world3D.z.toFixed(2)})`);
        
        // Initialize particle properties
        particle.active = true;
        particle.state = 1; // spawning
        particle.age = 0;
        particle.lifetime = this.config.baseLifetime + 
            (Math.random() - 0.5) * this.config.lifetimeVariation;
        
        particle.scale = 0.1;
        particle.targetScale = this.config.baseSize + 
            (Math.random() - 0.5) * this.config.sizeVariation;
        
        particle.rotation = Math.random() * Math.PI * 2;
        particle.rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        // Random neon color
        const colorIndex = Math.floor(Math.random() * this.config.neonColors.length);
        particle.color.copy(this.config.neonColors[colorIndex]);
        
        particle.opacity = 0;
        particle.targetOpacity = 0.8 + Math.random() * 0.7; // Much higher opacity for visibility
        
        // Small random velocity
        particle.velocity.set(
            (Math.random() - 0.5) * 0.1,
            0,
            (Math.random() - 0.5) * 0.1
        );
        
        particle.mitosisTimer = Math.random() * 5; // Random mitosis timing
        
        this.activeParticles++;
        this.updateInstanceData(particleIndex, particle);
    }
    
    updateInstanceData(index, particle) {
        const positions = this.geometry.attributes.instancePosition.array;
        const data = this.geometry.attributes.instanceData.array;
        const colors = this.geometry.attributes.instanceColor.array;
        const velocities = this.geometry.attributes.instanceVelocity.array;
        
        const i3 = index * 3;
        const i4 = index * 4;
        
        // Position
        positions[i3 + 0] = particle.position.x;
        positions[i3 + 1] = particle.position.y;
        positions[i3 + 2] = particle.position.z;
        
        // Data (scale, rotation, age, lifetime)
        data[i4 + 0] = particle.scale;
        data[i4 + 1] = particle.rotation;
        data[i4 + 2] = particle.age;
        data[i4 + 3] = particle.lifetime;
        
        // Color
        colors[i4 + 0] = particle.color.r;
        colors[i4 + 1] = particle.color.g;
        colors[i4 + 2] = particle.color.b;
        colors[i4 + 3] = particle.opacity;
        
        // Velocity and state
        velocities[i4 + 0] = particle.velocity.x;
        velocities[i4 + 1] = particle.velocity.y;
        velocities[i4 + 2] = particle.velocity.z;
        velocities[i4 + 3] = particle.state;
    }
    
    update(deltaTime, elapsedTime) {
        if (!this.initialized) return;
        
        this.time = elapsedTime;
        this.uniforms.time.value = this.time;
        
        // Debug logging every 5 seconds
        if (Math.floor(elapsedTime) % 5 === 0 && Math.floor(elapsedTime) !== Math.floor(elapsedTime - deltaTime)) {
            console.log(`🌫️ Vapor System Status: ${this.activeParticles}/${this.config.maxParticles} active particles`);
            console.log(`🌫️ Wind direction: (${this.config.windDirection.x}, ${this.config.windDirection.y}, ${this.config.windDirection.z}), speed: ${this.config.windSpeed}`);
        }
        
        // Spawn new vapors based on spawn rate
        if (this.time - this.lastSpawnTime > 1.0 / this.config.spawnRate) {
            if (this.activeParticles < this.config.maxParticles) {
                this.spawnVapor();
                this.lastSpawnTime = this.time;
            }
        }
        
        // Update all active particles
        let needsUpdate = false;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            if (!particle.active) continue;
            
            // Update age
            particle.age += deltaTime;
            
            // Check if particle should die
            if (particle.age >= particle.lifetime) {
                particle.active = false;
                particle.state = 0;
                particle.scale = 0;
                particle.opacity = 0;
                this.activeParticles--;
                needsUpdate = true;
                this.updateInstanceData(i, particle);
                continue;
            }
            
            // Update particle state and properties
            this.updateParticleState(particle, deltaTime);
            
            // Apply physics
            this.applyPhysics(particle, deltaTime);
            
            // Update instance data
            this.updateInstanceData(i, particle);
            needsUpdate = true;
        }
        
        // Mark geometry for update
        if (needsUpdate) {
            this.geometry.attributes.instancePosition.needsUpdate = true;
            this.geometry.attributes.instanceData.needsUpdate = true;
            this.geometry.attributes.instanceColor.needsUpdate = true;
            this.geometry.attributes.instanceVelocity.needsUpdate = true;
        }
    }
    
    updateParticleState(particle, deltaTime) {
        const ageRatio = particle.age / particle.lifetime;
        
        // State transitions based on age
        if (ageRatio < 0.1 && particle.state === 1) {
            // Spawning: grow scale and opacity
            particle.scale = THREE.MathUtils.lerp(particle.scale, particle.targetScale, deltaTime * 5);
            particle.opacity = THREE.MathUtils.lerp(particle.opacity, particle.targetOpacity, deltaTime * 3);
            
            if (particle.scale > particle.targetScale * 0.8) {
                particle.state = 2; // growing
            }
        } else if (ageRatio < 0.8 && particle.state === 2) {
            // Growing/stable phase
            particle.scale = THREE.MathUtils.lerp(particle.scale, particle.targetScale, deltaTime * 2);
            particle.state = 3; // stable
            
            // Check for mitosis
            particle.mitosisTimer -= deltaTime;
            if (particle.mitosisTimer <= 0 && Math.random() < this.config.mitosisChance * deltaTime) {
                this.attemptMitosis(particle);
                particle.mitosisTimer = 3 + Math.random() * 5; // Reset timer
            }
        } else if (ageRatio >= 0.8) {
            // Fading phase
            particle.state = 5;
            const fadeProgress = (ageRatio - 0.8) / 0.2;
            particle.opacity = particle.targetOpacity * (1 - fadeProgress);
            particle.scale = particle.targetScale * (1 - fadeProgress * 0.5);
        }
        
        // Update rotation
        particle.rotation += particle.rotationSpeed * deltaTime;
    }
    
    applyPhysics(particle, deltaTime) {
        // Apply enhanced wind force
        const windForce = this.config.windDirection.clone()
            .multiplyScalar(this.config.windSpeed * deltaTime);
        particle.velocity.add(windForce);
        
        // Apply velocity with visible movement
        particle.position.add(
            particle.velocity.clone().multiplyScalar(deltaTime)
        );
        
        // Enhanced ground hugging with more natural variation
        const groundVariation = Math.sin(this.time * 0.5 + particle.position.x) * 0.5 +
                               Math.cos(this.time * 0.3 + particle.position.z) * 0.3;
        const targetY = this.coordinateSystem.GROUND_LEVEL + 0.2 + groundVariation;
        
        particle.position.y = THREE.MathUtils.lerp(
            particle.position.y,
            targetY,
            this.config.groundHugging * deltaTime
        );
        
        // Less aggressive damping for more visible movement
        particle.velocity.multiplyScalar(0.95);
        
        // Log position updates for debugging (every 50th frame to avoid spam)
        if (Math.random() < 0.02) { // 2% chance to log
            console.log(`🌊 Particle physics: pos(${particle.position.x.toFixed(2)}, ${particle.position.y.toFixed(2)}, ${particle.position.z.toFixed(2)}), vel(${particle.velocity.x.toFixed(3)}, ${particle.velocity.y.toFixed(3)}, ${particle.velocity.z.toFixed(3)})`);
        }
    }
    
    attemptMitosis(particle) {
        // Find another particle for splitting effect
        // This is a simplified mitosis - in reality it would create new particles
        console.log('🧬 Vapor mitosis effect triggered');
        
        // Add some visual variation to simulate splitting
        particle.rotationSpeed += (Math.random() - 0.5) * 0.01;
        particle.targetScale *= 0.8; // Shrink slightly after "split"
    }
    
    render() {
        if (!this.initialized) return;
        this.renderer.render(this.scene, this.getCamera());
    }
    
    getCamera() {
        // Use perspective camera matching main coordinate system
        const camera = new THREE.PerspectiveCamera(
            50,  // FOV matching other systems
            window.innerWidth / window.innerHeight,  // aspect ratio
            0.1,   // near
            1000   // far
        );
        
        // Position camera to match main coordinate system perspective
        camera.position.set(0, 15, 20);
        camera.lookAt(0, this.coordinateSystem.GROUND_LEVEL, 0);
        
        console.log('🎥 Vapor camera positioned at:', camera.position, 'looking at ground level:', this.coordinateSystem.GROUND_LEVEL);
        
        return camera;
    }
    
    // Debug and info methods
    getInfo() {
        return {
            initialized: this.initialized,
            activeParticles: this.activeParticles,
            maxParticles: this.config.maxParticles,
            particleCount: this.activeParticles // For debug display
        };
    }
    
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        console.log('🗑️ Ground Vapor System disposed');
    }
}