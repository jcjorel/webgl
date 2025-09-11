// ============================================================================
// COMPONENTS.JS - All Visual Component Classes
// ============================================================================

/**
 * GlassPane - AWS logo on a glossy glass 3D pane
 */
class GlassPane {
    constructor() {
        this.mesh = null;
        this.material = null;
        this.geometry = null;
        this.texture = null;
    }

    /**
     * Initialize the glass pane with AWS logo
     * @returns {Promise<boolean>}
     */
    async init() {
        try {
            // Load AWS logo texture
            await this.loadTexture();
            
            // Create geometry
            this.createGeometry();
            
            // Create glass material
            this.createMaterial();
            
            // Create mesh
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            
            console.log('✓ GlassPane initialized successfully');
            return true;
            
        } catch (error) {
            console.error('✗ GlassPane initialization failed:', error);
            throw error;
        }
    }

    /**
     * Load the AWS logo texture
     */
    async loadTexture() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                CONFIG.ASSETS.AWS_LOGO,
                (texture) => {
                    this.texture = texture;
                    // Configure texture settings
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }

    /**
     * Create the plane geometry for the glass pane
     */
    createGeometry() {
        this.geometry = new THREE.PlaneGeometry(
            CONFIG.GLASS_PANE.WIDTH,
            CONFIG.GLASS_PANE.HEIGHT
        );
    }

    /**
     * Create the glass material with enhanced physical properties and environment mapping
     */
    createMaterial() {
        this.material = new THREE.MeshPhysicalMaterial({
            map: this.texture,
            // FIXED: Reduced transmission for better visibility (was 0.9)
            transmission: 0.6,
            opacity: CONFIG.GLASS_PANE.MATERIAL.OPACITY,
            // FIXED: Added metalness for metallic reflections (was 0)
            metalness: 0.3,
            // FIXED: Lower roughness for sharper reflections (was 0.1)
            roughness: 0.05,
            ior: CONFIG.GLASS_PANE.MATERIAL.IOR,
            thickness: CONFIG.GLASS_PANE.MATERIAL.THICKNESS,
            // FIXED: Enhanced clearcoat for glass-like finish
            clearcoat: 1.0,
            clearcoatRoughness: 0.02,
            // NEW: Environment mapping will be set asynchronously
            envMapIntensity: 1.0,
            side: THREE.DoubleSide,
            transparent: true
        });
        
        // FIXED: Create environment map after material is created
        this.createEnvironmentMap();
    }

    /**
     * Create environment map from background texture for reflections
     */
    createEnvironmentMap() {
        // Load the background texture as environment map
        const loader = new THREE.TextureLoader();
        loader.load(CONFIG.ASSETS.BACKGROUND, (backgroundTexture) => {
            // FIXED: Configure texture for proper environment mapping
            backgroundTexture.mapping = THREE.EquirectangularReflectionMapping;
            backgroundTexture.wrapS = THREE.RepeatWrapping;
            backgroundTexture.wrapT = THREE.ClampToEdgeWrapping;
            
            // Set as environment map
            this.envMap = backgroundTexture;
            
            // FIXED: Update material with environment map
            if (this.material) {
                this.material.envMap = this.envMap;
                this.material.envMapIntensity = 1.0;
                this.material.needsUpdate = true;
                console.log('✓ Environment map applied to glass material');
            }
        }, undefined, (error) => {
            console.warn('Could not load environment map:', error);
        });
    }

    /**
     * Update animation (called in main loop)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        // Glass pane doesn't need individual updates - rotation handled by parent group
    }

    /**
     * Dispose of resources including environment map
     */
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        if (this.texture) this.texture.dispose();
        if (this.envMap) this.envMap.dispose();
    }
}

/**
 * StockDisplay - AMZN stock value display
 */
class StockDisplay {
    constructor() {
        this.mesh = null;
        this.material = null;
        this.geometry = null;
        this.texture = null;
    }

    /**
     * Initialize the stock display
     */
    init() {
        try {
            this.createTextTexture();
            this.createGeometry();
            this.createMaterial();
            this.createMesh();
            
            console.log('✓ StockDisplay initialized successfully');
            return true;
            
        } catch (error) {
            console.error('✗ StockDisplay initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create texture from text using canvas
     */
    createTextTexture() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 512;
        canvas.height = 128;
        
        // Configure text styling
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 36px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Clear canvas with transparent background
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.fillText(CONFIG.STOCK_DISPLAY.TEXT, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        this.texture = new THREE.CanvasTexture(canvas);
        this.texture.needsUpdate = true;
    }

    /**
     * Create geometry for the text display
     */
    createGeometry() {
        this.geometry = new THREE.PlaneGeometry(3, 0.75);
    }

    /**
     * Create material for the text display
     */
    createMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
    }

    /**
     * Create the mesh
     */
    createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(
            CONFIG.STOCK_DISPLAY.POSITION.x,
            CONFIG.STOCK_DISPLAY.POSITION.y,
            CONFIG.STOCK_DISPLAY.POSITION.z
        );
    }

    /**
     * Update animation (called in main loop)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        // Stock display rotates with parent group, no individual updates needed
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        if (this.texture) this.texture.dispose();
    }
}

/**
 * ShootingStars - Animated meteor shower particle system
 * FIXED: Now implements lines instead of points as required by FR-009
 */
class ShootingStars {
    constructor() {
        this.particleSystem = null;
        this.geometry = null;
        this.material = null;
        this.particles = [];
        this.particleCount = CONFIG.SHOOTING_STARS.PARTICLE_COUNT;
        
        // Vanishing point for trajectories (FR-010: above and behind camera)
        this.vanishingPoint = { x: 0, y: 15, z: 20 };
        
        // Motion blur trail length (FR-009: motion blur effects)
        this.trailLength = 0.5;
    }

    /**
     * Initialize the shooting stars system
     */
    init() {
        try {
            this.createParticles();
            this.createGeometry();
            this.createMaterial();
            this.createParticleSystem();
            
            console.log('✓ ShootingStars initialized successfully');
            return true;
            
        } catch (error) {
            console.error('✗ ShootingStars initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create particle data
     */
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    /**
     * Create a single particle
     * FIXED: Now calculates proper trajectory toward vanishing point (FR-010)
     * @returns {object} Particle data
     */
    createParticle() {
        const config = CONFIG.SHOOTING_STARS;
        
        // Start position (few pixels above horizon line as per FR-010)
        const startX = Utils.randomBetween(-config.SPAWN_AREA.WIDTH / 2, config.SPAWN_AREA.WIDTH / 2);
        const startY = Utils.randomBetween(config.SPAWN_AREA.MIN_Y, config.SPAWN_AREA.MIN_Y + config.SPAWN_AREA.HEIGHT);
        const startZ = Utils.randomBetween(-config.SPAWN_AREA.Z_RANGE, 0);
        
        // FIXED: Calculate velocity toward vanishing point (FR-010)
        const directionX = this.vanishingPoint.x - startX;
        const directionY = this.vanishingPoint.y - startY;
        const directionZ = this.vanishingPoint.z - startZ;
        
        // Normalize direction vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY + directionZ * directionZ);
        const speed = Utils.randomBetween(config.SPEED_RANGE.min, config.SPEED_RANGE.max);
        
        const particle = {
            // Position
            x: startX,
            y: startY,
            z: startZ,
            
            // FIXED: Velocity toward vanishing point (FR-010)
            vx: (directionX / length) * speed,
            vy: (directionY / length) * speed,
            vz: (directionZ / length) * speed,
            
            // Properties
            alpha: Utils.randomBetween(0.5, 1.0),
            speed: speed,
            life: 1.0,
            
            // Motion blur trail positions (FR-009)
            prevX: startX,
            prevY: startY,
            prevZ: startZ
        };
        
        return particle;
    }

    /**
     * Create buffer geometry for line segments (FR-009: small white-colored lines)
     * FIXED: Now creates line geometry instead of point geometry
     */
    createGeometry() {
        this.geometry = new THREE.BufferGeometry();
        
        // Each particle needs 2 vertices for a line (current + previous position for motion blur)
        const positions = new Float32Array(this.particleCount * 6); // 2 vertices * 3 components each
        const colors = new Float32Array(this.particleCount * 6);     // 2 vertices * 3 components each
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.particles[i];
            const index = i * 6; // 6 components per particle (2 vertices * 3 coords)
            
            // Line start (previous position for motion blur)
            positions[index] = particle.prevX;
            positions[index + 1] = particle.prevY;
            positions[index + 2] = particle.prevZ;
            
            // Line end (current position)
            positions[index + 3] = particle.x;
            positions[index + 4] = particle.y;
            positions[index + 5] = particle.z;
            
            // Colors for both vertices (white)
            colors[index] = 1.0;
            colors[index + 1] = 1.0;
            colors[index + 2] = 1.0;
            colors[index + 3] = 1.0;
            colors[index + 4] = 1.0;
            colors[index + 5] = 1.0;
        }
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
    }

    /**
     * Create line material (FR-009: small white-colored lines with alpha blending)
     * FIXED: Now uses LineBasicMaterial instead of PointsMaterial
     */
    createMaterial() {
        this.material = new THREE.LineBasicMaterial({
            color: CONFIG.SHOOTING_STARS.MATERIAL.COLOR,
            blending: THREE.AdditiveBlending,
            transparent: true,
            vertexColors: true,
            linewidth: 2, // Note: linewidth may not work on all platforms, but we'll set it anyway
            opacity: 0.8
        });
        
    }

    /**
     * Create the line system (FR-009: rendered as lines, not points)
     * FIXED: Now uses LineSegments instead of Points
     */
    createParticleSystem() {
        this.particleSystem = new THREE.LineSegments(this.geometry, this.material);
    }

    /**
     * Update line system with motion blur and distance-based alpha (FR-009)
     * FIXED: Implements distance-based alpha and motion blur effects
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        const positions = this.geometry.attributes.position.array;
        const colors = this.geometry.attributes.color.array;
        
        let resetCount = 0;
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.particles[i];
            const posIndex = i * 6; // 6 components per particle (2 vertices * 3 coords)
            const colorIndex = i * 6; // 6 components per particle (2 vertices * 3 coords)
            
            // Store previous position for motion blur trail
            particle.prevX = particle.x;
            particle.prevY = particle.y;
            particle.prevZ = particle.z;
            
            // Update position
            particle.x += particle.vx * deltaTime * 60;
            particle.y += particle.vy * deltaTime * 60;
            particle.z += particle.vz * deltaTime * 60;
            
            // FIXED: Distance-based alpha calculation (FR-009)
            const distance = Math.sqrt(
                particle.x * particle.x +
                particle.y * particle.y +
                particle.z * particle.z
            );
            const maxDistance = 100;
            const distanceFactor = Math.max(0, 1 - (distance / maxDistance));
            
            // FIXED: Life-based fading combined with distance-based alpha (FR-009)
            particle.life *= CONFIG.SHOOTING_STARS.FADE_RATE;
            particle.alpha = particle.life * distanceFactor;
            
            // Reset particle if it's too far or too faded
            if (particle.z > this.vanishingPoint.z + 5 || particle.alpha < 0.01) {
                const newParticle = this.createParticle();
                Object.assign(particle, newParticle);
                resetCount++;
            }
            
            // FIXED: Update line segment positions (motion blur effect)
            // Line start (previous position - creates motion blur trail)
            positions[posIndex] = particle.prevX;
            positions[posIndex + 1] = particle.prevY;
            positions[posIndex + 2] = particle.prevZ;
            
            // Line end (current position)
            positions[posIndex + 3] = particle.x;
            positions[posIndex + 4] = particle.y;
            positions[posIndex + 5] = particle.z;
            
            // FIXED: Alpha-based color intensity for both vertices (distance simulation)
            const alpha = particle.alpha;
            colors[colorIndex] = alpha * 0.5;     // Previous position (dimmer)
            colors[colorIndex + 1] = alpha * 0.5;
            colors[colorIndex + 2] = alpha * 0.5;
            colors[colorIndex + 3] = alpha;       // Current position (brighter)
            colors[colorIndex + 4] = alpha;
            colors[colorIndex + 5] = alpha;
        }
        
        // Mark attributes for update
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
    }
}

/**
 * VaporwaveBubbles - Animated circular vapor bubbles (FR-011, FR-012, FR-016)
 * UPDATED: Changed from vertical lines to circular vapor bubbles
 */
class VaporwaveBubbles {
    constructor() {
        this.group = new THREE.Group();
        this.bubbles = [];
        this.maxBubbles = CONFIG.VAPORWAVE.MAX_LINES; // Reusing config but for bubbles now
        
        // Create shared bubble material (simpler than gradient shader)
        this.createBubbleMaterial();
    }

    /**
     * Initialize the vaporwave bubbles system
     */
    init() {
        try {
            console.log('✓ VaporwaveBubbles initialized successfully');
            return true;
            
        } catch (error) {
            console.error('✗ VaporwaveBubbles initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create bubble material with circular gradients and glowing effects (DC-003)
     * FIXED: Implements shader techniques as required
     */
    createBubbleMaterial() {
        // DC-003: Shader techniques for circular gradients and glowing effects
        const vertexShader = `
            varying vec2 vUv;
            varying float vDistance;
            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vDistance = distance(cameraPosition, worldPosition.xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uAlpha;
            uniform vec3 uColor;
            uniform float uTime;
            varying vec2 vUv;
            varying float vDistance;
            
            void main() {
                // DC-003: Circular gradient effect
                vec2 center = vec2(0.5, 0.5);
                float dist = distance(vUv, center);
                
                // Create circular gradient from center to edge
                float gradient = 1.0 - smoothstep(0.0, 0.5, dist);
                
                // DC-003: Glowing effect with pulsing animation
                float glow = gradient * gradient;
                float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
                
                // Combine gradient and glow
                float finalAlpha = gradient * uAlpha * pulse;
                
                // DC-003: Neon color intensity based on glow
                vec3 finalColor = uColor * (1.0 + glow * 0.5);
                
                gl_FragColor = vec4(finalColor, finalAlpha);
            }
        `;

        this.baseMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uAlpha: { value: 0.0 },
                uColor: { value: new THREE.Color(0xFF00FF) },
                uTime: { value: 0.0 }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
    }

    /**
     * Create a new vaporwave bubble with circular geometry and perspective scaling
     * FR-011: Circular vapor bubbles instead of vertical lines
     * FR-016: Bubbles start minimized and grow smoothly to full size
     * @returns {object} Bubble object
     */
    createBubble() {
        const color = Utils.getRandomVaporwaveColor();
        const targetAlpha = Utils.randomBetween(CONFIG.VAPORWAVE.ALPHA_RANGE.min, CONFIG.VAPORWAVE.ALPHA_RANGE.max);
        const lifetime = Utils.randomBetween(CONFIG.VAPORWAVE.LIFETIME_RANGE.min, CONFIG.VAPORWAVE.LIFETIME_RANGE.max);
        const x = Utils.randomBetween(-CONFIG.VAPORWAVE.SPAWN_AREA.X_RANGE / 2, CONFIG.VAPORWAVE.SPAWN_AREA.X_RANGE / 2);
        
        // FR-015: Position bubbles behind AWS logo (Z < 0, AWS logo is at z=0)
        const baseZ = CONFIG.VAPORWAVE.SPAWN_AREA.Z_POSITION;
        const zRange = CONFIG.VAPORWAVE.SPAWN_AREA.Z_RANGE;
        const z = Utils.randomBetween(baseZ - zRange/2, baseZ + zRange/2);

        // Ensure z is always negative (behind AWS logo at z=0)
        const safeZ = Math.min(z, -0.5);

        // Calculate perspective scaling based on z-depth (FR-013, TC-010)
        const perspectiveScale = this.calculatePerspectiveScale(safeZ);
        
        // Calculate target diameter with perspective scaling
        const baseDiameter = CONFIG.VAPORWAVE.LINE_HEIGHT; // Reusing line height as base bubble size
        const targetDiameter = baseDiameter * perspectiveScale.diameter;
        
        // FR-016: Start with minimal diameter that will grow to target diameter
        const startDiameter = CONFIG.VAPORWAVE.GROWTH_ANIMATION.MIN_HEIGHT;

        // FR-011: Create circular geometry (CircleGeometry for flat circles)
        const geometry = new THREE.CircleGeometry(startDiameter / 2, 16); // radius = diameter/2, 16 segments
        
        // Create unique material for this bubble with shader
        const material = this.baseMaterial.clone();
        material.uniforms.uColor.value = new THREE.Color(color);
        material.uniforms.uAlpha.value = 0; // FR-012: Start fully transparent
        material.uniforms.uTime.value = 0;

        // Create mesh for the circular bubble
        const mesh = new THREE.Mesh(geometry, material);
        
        // FR-011: Position bubble originating from ground level
        // Calculate ground level based on scene layout (stock display at y=-2.5, so ground ~-3.5)
        const groundLevel = -3.5;
        const y = groundLevel + Utils.randomBetween(0, 0.5); // Start near ground, slight variation
        
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = safeZ;

        const bubble = {
            mesh: mesh,
            material: material,
            geometry: geometry,
            lifetime: lifetime,
            age: 0,
            targetAlpha: targetAlpha, // FR-012: Target transparency to reach
            currentAlpha: 0, // FR-012: Start fully transparent
            color: color,
            z: safeZ, // Store z for debugging
            perspectiveScale: perspectiveScale, // Store scale for debugging
            id: Math.random().toString(36).substring(2, 8),
            // FR-016, TC-013: Growth animation properties
            currentDiameter: startDiameter,
            targetDiameter: targetDiameter,
            growthProgress: 0, // Progress from 0 to 1
            growthDuration: CONFIG.VAPORWAVE.GROWTH_ANIMATION.DURATION,
            // FR-012: Transparency animation properties
            transparencyProgress: 0, // Progress from fully transparent to semi-transparent
            // FIXED: Ground-hugging vapor physics - stays close to ground like fog
            initialY: y, // Store initial ground position
            velocity: {
                x: Utils.randomBetween(-0.8, 0.8), // More horizontal drift for ground fog
                y: Utils.randomBetween(0.05, 0.15), // Minimal upward movement (ground vapor)
                z: Utils.randomBetween(-0.3, 0.3) // Some depth movement
            }
        };

        this.bubbles.push(bubble);
        this.group.add(mesh);
        return bubble;
    }

    /**
     * Calculate perspective scaling with logarithmic depth buffer (TC-010, TC-012)
     * Implements: scaleFactor = nearPlane / (nearPlane + z-depth) with logarithmic scaling
     * @param {number} z - Z position of the bubble
     * @returns {object} Scale factors for diameter
     */
    calculatePerspectiveScale(z) {
        const config = CONFIG.VAPORWAVE.PERSPECTIVE;
        const nearPlane = config.NEAR_PLANE;
        const farPlane = 100.0; // For logarithmic calculation
        
        // TC-010, TC-012: Logarithmic depth buffer technique
        const distance = Math.abs(z);
        const logDepth = Math.log2(Math.max(distance, nearPlane)) / Math.log2(farPlane);
        
        // TC-010: Enhanced scaling with logarithmic depth
        const linearScale = nearPlane / (nearPlane + distance);
        const logScale = 1.0 - (logDepth * 0.8); // Logarithmic component
        const combinedScale = linearScale * logScale;
        
        // Apply scaling constraints
        const clampedScale = Utils.clamp(combinedScale, config.MIN_SCALE, config.MAX_SCALE);
        
        // FR-014: Ensure closest bubbles don't exceed 33% of screen height in diameter
        const maxPixelDiameter = window.innerHeight * config.MAX_HEIGHT_RATIO;
        const baseDiameter = CONFIG.VAPORWAVE.LINE_HEIGHT;
        const maxAllowedScale = maxPixelDiameter / baseDiameter;
        const diameterScale = Math.min(clampedScale, maxAllowedScale);
        
        return {
            diameter: diameterScale
        };
    }

    /**
     * Update vaporwave bubbles with growth and transparency animation (FR-012, FR-016)
     * @param {number} deltaTime - Time since last frame
     * @param {number} elapsedTime - Total elapsed time
     */
    update(deltaTime, elapsedTime) {
        var spawnRoll = Math.random();
        var shouldSpawn = spawnRoll < CONFIG.VAPORWAVE.SPAWN_RATE && this.bubbles.length < this.maxBubbles;

        // Spawn new bubbles randomly (FR-011: randomly appearing)
        if (shouldSpawn) {
            this.createBubble();
        }

        // Update existing bubbles
        for (var i = this.bubbles.length - 1; i >= 0; i--) {
            var bubble = this.bubbles[i];
            bubble.age += deltaTime * 1000; // Convert to milliseconds

            // FIXED: Ground-hugging vapor physics - stays near ground like fog
            // Apply velocity with stronger horizontal movement, minimal vertical
            bubble.mesh.position.x += bubble.velocity.x * deltaTime * 8;
            bubble.mesh.position.y += bubble.velocity.y * deltaTime * 3; // Reduced vertical speed
            bubble.mesh.position.z += bubble.velocity.z * deltaTime * 5;
            
            // Ground vapor behavior - gradually settles down
            bubble.velocity.y *= 0.98; // Slower deceleration
            bubble.velocity.x *= 0.995; // Horizontal friction

            // FR-016: Update growth animation (TC-013: using easing functions)
            if (bubble.growthProgress < 1) {
                // Calculate growth progress (0 to 1)
                bubble.growthProgress = Math.min(1, bubble.age / bubble.growthDuration);
                
                // Apply easing function for smooth growth (TC-013)
                var easedProgress = Utils.easing[CONFIG.VAPORWAVE.GROWTH_ANIMATION.EASING_FUNCTION](bubble.growthProgress);
                
                // Calculate current diameter based on eased progress
                bubble.currentDiameter = CONFIG.VAPORWAVE.GROWTH_ANIMATION.MIN_HEIGHT +
                    (bubble.targetDiameter - CONFIG.VAPORWAVE.GROWTH_ANIMATION.MIN_HEIGHT) * easedProgress;
                
                // Update geometry to reflect new diameter
                bubble.geometry.dispose(); // Dispose old geometry
                bubble.geometry = new THREE.CircleGeometry(bubble.currentDiameter / 2, 16);
                bubble.mesh.geometry = bubble.geometry;
            }

            // FR-012: Update transparency animation (start transparent → semi-transparent)
            if (bubble.transparencyProgress < 1) {
                // Calculate transparency progress (0 to 1)
                bubble.transparencyProgress = Math.min(1, bubble.age / (bubble.growthDuration * 1.5)); // Slower than growth
                
                // Calculate current alpha (from 0 to target alpha)
                bubble.currentAlpha = bubble.targetAlpha * bubble.transparencyProgress;
                
                // Update shader uniform for custom material
                if (bubble.material.uniforms && bubble.material.uniforms.uAlpha) {
                    bubble.material.uniforms.uAlpha.value = bubble.currentAlpha;
                }
            }

            // Update time uniform for pulsing glow effect
            if (bubble.material.uniforms && bubble.material.uniforms.uTime) {
                bubble.material.uniforms.uTime.value = elapsedTime;
            }

            // Calculate fade at end of life
            var lifeRatio = bubble.age / bubble.lifetime;
            if (lifeRatio > 0.8) { // Start fading in last 20% of life
                var fadeRatio = (lifeRatio - 0.8) / 0.2; // 0 to 1 in last 20%
                var fadedAlpha = bubble.currentAlpha * (1 - fadeRatio);
                
                // Update shader uniform for fade
                if (bubble.material.uniforms && bubble.material.uniforms.uAlpha) {
                    bubble.material.uniforms.uAlpha.value = fadedAlpha;
                }
            }

            // Remove bubbles that have drifted too far or expired (ground vapor behavior)
            var maxHeight = bubble.initialY + 2; // Stay close to ground (was 8)
            var tooHigh = bubble.mesh.position.y > maxHeight;
            var tooLow = bubble.mesh.position.y < bubble.initialY - 1; // Don't go below ground
            var tooFar = Math.abs(bubble.mesh.position.x) > 15; // Horizontal drift limit
            var expired = bubble.age >= bubble.lifetime;
            
            if (expired || tooHigh || tooLow || tooFar) {
                this.group.remove(bubble.mesh);
                bubble.geometry.dispose();
                bubble.material.dispose();
                this.bubbles.splice(i, 1);
            }
        }
    }

    /**
     * Dispose of resources
     */
    dispose() {
        // Dispose individual bubbles
        this.bubbles.forEach(bubble => {
            this.group.remove(bubble.mesh);
            bubble.geometry.dispose();
            bubble.material.dispose();
        });
        this.bubbles = [];
        
        // Dispose base material
        if (this.baseMaterial) {
            this.baseMaterial.dispose();
        }
    }
}

/**
 * BackgroundScene - Fixed desert night background
 */
class BackgroundScene {
    constructor() {
        this.mesh = null;
        this.material = null;
        this.geometry = null;
        this.texture = null;
    }

    /**
     * Initialize the background scene
     * @returns {Promise<boolean>}
     */
    async init() {
        try {
            await this.loadTexture();
            this.createGeometry();
            this.createMaterial();
            this.createMesh();
            
            console.log('✓ BackgroundScene initialized successfully');
            return true;
            
        } catch (error) {
            console.error('✗ BackgroundScene initialization failed:', error);
            throw error;
        }
    }

    /**
     * Initialize with camera for proper scaling
     * @param {THREE.Camera} camera - The camera to scale for
     */
    initWithCamera(camera) {
        this.camera = camera;
        this.updateGeometryForCamera();
    }

    /**
     * Update geometry dimensions based on camera
     */
    updateGeometryForCamera() {
        if (!this.camera) return;
        
        const imageAspectRatio = CONFIG.BACKGROUND.ORIGINAL_WIDTH / CONFIG.BACKGROUND.ORIGINAL_HEIGHT;
        const distance = Math.abs(CONFIG.BACKGROUND.POSITION.z);
        
        const scale = Utils.calculateBackgroundScale(this.camera, distance, imageAspectRatio);
        
        // Dispose old geometry if it exists
        if (this.geometry) {
            this.geometry.dispose();
        }
        
        // Create new geometry with calculated dimensions
        this.geometry = new THREE.PlaneGeometry(scale.width, scale.height);
        
        // Update the mesh geometry if it exists
        if (this.mesh) {
            this.mesh.geometry = this.geometry;
        }
    }

    /**
     * Load the background texture
     */
    async loadTexture() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                CONFIG.ASSETS.BACKGROUND,
                (texture) => {
                    this.texture = texture;
                    // Configure texture settings
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.minFilter = THREE.LinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    resolve(texture);
                },
                undefined,
                reject
            );
        });
    }

    /**
     * Create geometry for the background plane
     */
    createGeometry() {
        // Start with default size - will be updated when camera is available
        this.geometry = new THREE.PlaneGeometry(
            CONFIG.BACKGROUND.SCALE.x,
            CONFIG.BACKGROUND.SCALE.y
        );
    }

    /**
     * Create material for the background
     */
    createMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            side: THREE.FrontSide,
            transparent: false
        });
    }

    /**
     * Create the background mesh
     */
    createMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(
            CONFIG.BACKGROUND.POSITION.x,
            CONFIG.BACKGROUND.POSITION.y,
            CONFIG.BACKGROUND.POSITION.z
        );
        
        // Ensure background is not affected by controls
        this.mesh.matrixAutoUpdate = false;
        this.mesh.updateMatrix();
    }

    /**
     * Update (background is static, no updates needed)
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime) {
        // Background remains static
    }

    /**
     * Dispose of resources
     */
    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
        if (this.texture) this.texture.dispose();
    }
}

// Export components to global scope
window.GlassPane = GlassPane;
window.StockDisplay = StockDisplay;
window.ShootingStars = ShootingStars;
window.VaporwaveBubbles = VaporwaveBubbles;
window.BackgroundScene = BackgroundScene;

console.log('✓ Components.js loaded successfully');