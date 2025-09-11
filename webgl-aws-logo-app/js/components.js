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
 * VaporwaveLines - Animated vertical gradient lines (FR-011, FR-012)
 */
class VaporwaveLines {
    constructor() {
        this.group = new THREE.Group();
        this.lines = [];
        this.maxLines = CONFIG.VAPORWAVE.MAX_LINES;
        
        // Create shared gradient shader material
        this.createGradientShaderMaterial();
    }

    /**
     * Initialize the vaporwave lines system
     */
    init() {
        try {
            console.log('✓ VaporwaveLines initialized successfully');
            return true;
            
        } catch (error) {
            console.error('✗ VaporwaveLines initialization failed:', error);
            throw error;
        }
    }

    /**
     * Create gradient shader material as per FR-012
     */
    createGradientShaderMaterial() {
        // FIXED: Implement proper gradient shader as specified in FR-012
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float uAlpha;
            uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
                // FR-012: Gradient fully transparent at bottom, semi-transparent at top
                float gradient = vUv.y; // 0 at bottom, 1 at top
                float alpha = gradient * uAlpha;
                gl_FragColor = vec4(uColor, alpha);
            }
        `;

        this.gradientMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uAlpha: { value: 1.0 },
                uColor: { value: new THREE.Color(0xFF00FF) }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
    }

    /**
     * Create a new vaporwave line with proper gradient implementation and perspective scaling
     * FR-016: Lines start minimized and grow smoothly to full size
     * @returns {object} Line object
     */
    createLine() {
        const color = Utils.getRandomVaporwaveColor();
        const alpha = Utils.randomBetween(CONFIG.VAPORWAVE.ALPHA_RANGE.min, CONFIG.VAPORWAVE.ALPHA_RANGE.max);
        const lifetime = Utils.randomBetween(CONFIG.VAPORWAVE.LIFETIME_RANGE.min, CONFIG.VAPORWAVE.LIFETIME_RANGE.max);
        const x = Utils.randomBetween(-CONFIG.VAPORWAVE.SPAWN_AREA.X_RANGE / 2, CONFIG.VAPORWAVE.SPAWN_AREA.X_RANGE / 2);
        
        // FIXED: Position for proper foreground/background distribution (FR-015)
        const baseZ = CONFIG.VAPORWAVE.SPAWN_AREA.Z_POSITION;
        const zRange = CONFIG.VAPORWAVE.SPAWN_AREA.Z_RANGE;
        const z = Utils.randomBetween(baseZ - zRange/2, baseZ + zRange/2);

        // Z-ordering fix: All vaporwave lines now correctly positioned behind AWS logo (Z < 0)

        // FIXED: Calculate perspective scaling based on z-depth (FR-013, TC-010)
        const perspectiveScale = this.calculatePerspectiveScale(z);
        
        // FIXED: Apply perspective scaling to line dimensions
        const scaledWidth = CONFIG.VAPORWAVE.LINE_WIDTH * perspectiveScale.width;
        const targetHeight = CONFIG.VAPORWAVE.LINE_HEIGHT * perspectiveScale.height; // FR-016: This is the target height
        
        // FR-016: Start with minimal height that will grow to target height
        const startHeight = CONFIG.VAPORWAVE.GROWTH_ANIMATION.MIN_HEIGHT;

        // Create geometry with minimal height initially (FR-016)
        const geometry = new THREE.PlaneGeometry(scaledWidth, startHeight);
        
        // FIXED: Clone gradient material and set unique color/alpha per FR-012
        const material = this.gradientMaterial.clone();
        material.uniforms.uColor.value = new THREE.Color(color);
        material.uniforms.uAlpha.value = alpha;

        // Create mesh for the vertical line
        const mesh = new THREE.Mesh(geometry, material);
        
        // Calculate ground level position based on scene layout
        // Camera is at y=0, stock display is at y=-2.5, so ground level is at y=-3.5
        const groundLevel = -3.5;
        
        // FR-016: Position lines starting from ground level with minimal height
        // Offset by half of current height so bottom of line touches ground
        const yPosition = groundLevel + (startHeight / 2);
        
        mesh.position.x = x;
        mesh.position.y = yPosition;
        mesh.position.z = z;

        const line = {
            mesh: mesh,
            material: material,
            geometry: geometry,
            lifetime: lifetime,
            age: 0,
            initialAlpha: alpha,
            color: color,
            z: z, // Store z for debugging
            perspectiveScale: perspectiveScale, // Store scale for debugging
            id: Math.random().toString(36).substring(2, 8),
            // FR-016, TC-013: Growth animation properties
            currentHeight: startHeight,
            targetHeight: targetHeight,
            growthProgress: 0, // Progress from 0 to 1
            growthDuration: CONFIG.VAPORWAVE.GROWTH_ANIMATION.DURATION,
            groundLevel: groundLevel,
            scaledWidth: scaledWidth
        };

        this.lines.push(line);
        this.group.add(mesh);
        return line;
    }

    /**
     * Calculate perspective scaling based on z-depth (FR-013, TC-010, TC-011)
     * Implements: scaleFactor = nearPlane / (nearPlane + z-depth)
     * @param {number} z - Z position of the line
     * @returns {object} Scale factors for width and height
     */
    calculatePerspectiveScale(z) {
        const config = CONFIG.VAPORWAVE.PERSPECTIVE;
        const nearPlane = config.NEAR_PLANE;
        
        // TC-010: scaleFactor = nearPlane / (nearPlane + z-depth)
        const distance = Math.abs(z); // Distance from camera (at z=5, so relative distance)
        const scaleFactor = nearPlane / (nearPlane + distance);
        
        // Apply scaling constraints
        const clampedScale = Utils.clamp(scaleFactor, config.MIN_SCALE, config.MAX_SCALE);
        
        // FR-014: Ensure closest lines don't exceed 33% of screen height
        const maxHeightScale = config.MAX_HEIGHT_RATIO * (window.innerHeight / CONFIG.VAPORWAVE.LINE_HEIGHT);
        const heightScale = Math.min(clampedScale, maxHeightScale);
        
        return {
            width: clampedScale,
            height: heightScale
        };
    }

    /**
     * Update vaporwave lines with proper shader uniform updates (FR-012) and growth animation (FR-016)
     * @param {number} deltaTime - Time since last frame
     * @param {number} elapsedTime - Total elapsed time
     */
    update(deltaTime, elapsedTime) {
        var frameCheckInterval = 120; // Check every 2 seconds at 60fps
        
        var spawnRoll = Math.random();
        var shouldSpawn = spawnRoll < CONFIG.VAPORWAVE.SPAWN_RATE && this.lines.length < this.maxLines;

        // Spawn new lines randomly (FR-011: randomly appearing)
        if (shouldSpawn) {
            this.createLine();
        }

        // Update existing lines
        for (var i = this.lines.length - 1; i >= 0; i--) {
            var line = this.lines[i];
            line.age += deltaTime * 1000; // Convert to milliseconds

            // FR-016: Update growth animation (TC-013: using easing functions)
            if (line.growthProgress < 1) {
                // Calculate progress (0 to 1)
                line.growthProgress = Math.min(1, line.age / line.growthDuration);
                
                // Apply easing function for smooth growth (TC-013)
                var easedProgress = Utils.easing[CONFIG.VAPORWAVE.GROWTH_ANIMATION.EASING_FUNCTION](line.growthProgress);
                
                // Calculate current height based on eased progress
                line.currentHeight = CONFIG.VAPORWAVE.GROWTH_ANIMATION.MIN_HEIGHT +
                    (line.targetHeight - CONFIG.VAPORWAVE.GROWTH_ANIMATION.MIN_HEIGHT) * easedProgress;
                
                // Update geometry to reflect new height
                line.geometry.dispose(); // Dispose old geometry
                line.geometry = new THREE.PlaneGeometry(line.scaledWidth, line.currentHeight);
                line.mesh.geometry = line.geometry;
                
                // Update Y position to keep bottom at ground level
                line.mesh.position.y = line.groundLevel + (line.currentHeight / 2);
            }

            // FIXED: Calculate fade based on age (FR-012: randomly selected display duration)
            var lifeRatio = line.age / line.lifetime;
            var alpha = line.initialAlpha * (1 - lifeRatio);

            // FIXED: Update shader uniform instead of material opacity
            if (line.material.uniforms && line.material.uniforms.uAlpha) {
                line.material.uniforms.uAlpha.value = Math.max(0, alpha);
            }

            // Remove expired lines
            if (line.age >= line.lifetime) {
                this.group.remove(line.mesh);
                line.geometry.dispose();
                line.material.dispose();
                this.lines.splice(i, 1);
            }
        }
    }

    /**
     * Dispose of resources including gradient shader
     */
    dispose() {
        // Dispose individual lines
        this.lines.forEach(line => {
            this.group.remove(line.mesh);
            line.geometry.dispose();
            line.material.dispose();
        });
        this.lines = [];
        
        // Dispose shared gradient material
        if (this.gradientMaterial) {
            this.gradientMaterial.dispose();
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
window.VaporwaveLines = VaporwaveLines;
window.BackgroundScene = BackgroundScene;

console.log('✓ Components.js loaded successfully');