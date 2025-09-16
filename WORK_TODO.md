
Tasks:
- Create a single Web page containing a WebGL micro application that makes the available AWS image PNG slowly rotating on a glossy glass 3D pane with mouse control. 
- Generate a background image of a desert at night, clear sky with stars with fantastical colorful supernatural vegetals (w/o cacti, trees, shooting stars, mountains, giant plants or giant objects). 
- The clear sky must be animated with visualy appealing sparkling realistic shooting stars/meteor shower effect. 
- The ground must have a dynamic animated vapor particle system to create a surreal ambiance.

Implementation constraints:
- Under the AWS logo and rotating with it, place an **hardcoded (i.e. not real-time)** AMZN stock value in $.
- The AWS logo has strong metalness, is not transparent and reflect the surrounding background scene
- Generated image is a fixed background (i.e. not rotating with the logo or mouse controled)

- Shooting stars scene, ground vapor particles 3D scene and AWS Logo/AMZN stock 3D one MUST be independents.
- Mouse control only apply to the AWS Logo/AMZN stock 3D scene.
- Shooting stars appear at random positions above the horizon line in front of the viewer
- Each meteor enters the atmosphere at different depths, creating varying trail thicknesses
- All meteors flow toward a vanishing point located behind the camera position (off-screen in high-altitude atmosphere): This creates the effect of meteors streaming toward the viewer, not toward a visible point in the sky
- Shooting stars are light-emitting glowing 3D lines, simulating the metor point and its long alpha blended trail with realistic color variations.

- Make sure vapors are randomly appearing as animated realistic highly-visible neon-colored cloudy foggy vapor originating from ground level with ground-hugging behavior (do not use geometric based representation, use only textures and fragment shaders with blury noise). 
- Make sure vapors are randomly appearing, are minimized and grow smoothly to their final size, positioned behind the AWS logo with proper perspective scaling (distant vapor smaller than closer ones). Each vapor cloud has randomly selected target transparency and display duration.
- Make sure that vapors sticks close to the ground always below the skyline.
- **Only once at design time (i.e not in the app)**, you will need to open and analyze the generated Nova Canvas image to locate the skyline coordinates to know where the shooting stars must appear

Technical constraints:
- Use Three.js framework. 
- Use a python simple http server to serve the web page (port 8054 w/ TCP reuse option, HTTP header Cache-Control forbidding browser caching, simple hard-coded mime-type guessing from file extension). 
- Background image must fit automatically the web page size (real image size 1920x1088). 
- Put all Javascript and CSS in the HTML page
- Design it for Chrome latest version browser.

To test the solution, you will use the browser tool and will leverage the Chrome Developper tool logs. 
At build time, use:
- Perplexity MCP Server to fetch the current AMZN stock value.
- Context7 MCP server for right usage (ES6 module import map and initialization, best-practices...) of latest version of Three.js and OrbitControl.
- AWS Nova canvas MCP server to generate images.
IMPORTANT: If you encounter integration issues with Three.js or OrbitControl, leverage Context7 & Perplexity to enrich your reasoning.

Ask questions to clarify ambiguities.