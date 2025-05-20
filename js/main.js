// Main WebGL application using Three.js
document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const AMZN_STOCK_PRICE = 206.09; // Hardcoded AMZN stock price as of May 19, 2025
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('webgl-container').appendChild(renderer.domElement);
    
    // Camera position
    camera.position.z = 5;
    
    // Create a group to hold both logo and text
    const group = new THREE.Group();
    scene.add(group);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Load AWS logo texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('Amazon_Web_Services_Logo.png', (texture) => {
        // Calculate aspect ratio to maintain image proportions
        const imageAspect = texture.image.width / texture.image.height;
        const planeWidth = 3;
        const planeHeight = planeWidth / imageAspect;
        
        // Create logo mesh
        const logoGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const logoMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
        
        // Add logo to the group
        group.add(logoMesh);
        
        // Create text for AMZN stock price
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        // Draw text to canvas
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'bold 64px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`$${AMZN_STOCK_PRICE}`, canvas.width / 2, canvas.height / 2);
        
        // Convert canvas to texture
        const textTexture = new THREE.CanvasTexture(canvas);
        
        // Create text mesh
        const textGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight / 4);
        const textMaterial = new THREE.MeshStandardMaterial({
            map: textTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.y = -planeHeight / 1.5; // Position below logo
        
        // Add text to group
        group.add(textMesh);
    });
    
    // Variables for rotation
    let autoRotate = true;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    const rotationSpeed = 0.005;
    
    // Mouse events for rotation control
    document.addEventListener('mousedown', () => {
        autoRotate = false;
    });
    
    document.addEventListener('mouseup', () => {
        autoRotate = true;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!autoRotate) {
            mouseX = (event.clientX - window.innerWidth / 2) / 100;
            mouseY = (event.clientY - window.innerHeight / 2) / 100;
            
            targetRotationY = mouseX * 0.5;
            targetRotationX = mouseY * 0.5;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotate) {
            // Automatic rotation when mouse is not controlling
            group.rotation.y += rotationSpeed;
            group.rotation.x = Math.sin(Date.now() * 0.001) * 0.1; // Subtle up-down motion
        } else {
            // Interactive rotation based on mouse position
            group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
            group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;
        }
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
});
