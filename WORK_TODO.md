
# WebGL AWSome 3D demo application

## Application synopsys

- Create a single Web page containing a WebGL micro application that makes the available AWS image PNG slowly rotating on a glossy glass 3D pane with mouse control (limitless 360° grab rotation, pan ,zoom). 
- Generate a background image of a desert at night, clear sky with stars with fantastical colorful supernatural vegetals (w/o cacti, trees, shooting stars, mountains, giant plants or giant objects. **CRITICAL:** The skyline must be free of any visual obstruction). 
- The clear sky must be animated with visualy appealing sparkling realistic shooting stars/meteor shower effect. 
- The ground must have a dynamic animated vapor particle system to create a surreal ambiance.
All design decisions must maximize Wow effect!

## Implementation constraints

All the 3D scenes are displayed on top of each others in the order below:
- Background landscape scene (opaque)
- Shouting star scene (transparent)
- Ground vapor scene (transparent)
- AWS Logo & AMZN stock scene (transparent)

For the sake of simplicty, all the 3D scenes use their own optimized 3D coordinate system.

3D scenes (Shooting stars, ground vapor particles and AWS Logo/AMZN stock) MUST be independents.
- Mouse control only apply to the AWS Logo/AMZN stock 3D scene.

### Background landscape scene

- Generated image is a simply a 2D fixed background (i.e. not rotating with the logo or mouse controled) always fitting the whole screen

### Shouting star scene

- Shooting stars appear at random positions above the skyline in front of the viewer
- Each meteor enters the atmosphere at different depths, creating varying trail thicknesses
- All meteors flow toward a vanishing point located behind the camera position (off-screen in high-altitude atmosphere): This creates the effect of meteors streaming toward the viewer, not toward a visible point in the sky
- Shooting stars are light-emitting glowing 3D lines, simulating the metor point and its long alpha blended trail with realistic color variations.

### Ground vapor scene

- Make sure vapors are randomly appearing as animated realistic highly-visible neon-colored vapor originating from ground level with ground-hugging behavior.
- Vapor do not use geometric based representation, but use only textures and fragment shaders of cloudy foggy material. If vapor rendering uses noise generation, it must be then blured to avoid a "bee swarm" effect. 
- Make sure vapors are randomly appearing slowly and smoothly and finally disappear slowly and smoothly
- Vapor have proper perspective scaling (distant vapors smaller than closer ones). 
- Each vapor cloud has randomly selected target transparency and display duration.
- Make sure that vapors sticks close to the ground always below the skyline.
- **Only once at design time (i.e not in the app)**, you will need to open and analyze the generated Nova Canvas image to locate the skyline coordinates to know where the shooting stars must appear

### AWS Logo & AMZN stock scene

- Under the AWS logo and rotating with it, place an **hardcoded (i.e. not real-time)** AMZN stock value in $.
- The AWS logo has strong metalness, is not transparent and reflect the surrounding background scene


## Technical constraints
- Use Three.js framework. 
- Use a python simple http server to serve the web page (port 8054 w/ TCP reuse option, HTTP header Cache-Control forbidding browser caching, simple hard-coded mime-type guessing from file extension). 
- Background image must fit automatically the web page size (real image size 1920x1088). 
- Put all Javascript and CSS in the HTML page
- Design it for Chrome latest version browser.

## Testing / Debig
To test and debug the solution, you will start the webserver then use the browser tool and will leverage the Chrome Developper tools logs. 

## Build considerations

At build time, **so not part of the application codebase!**, we will use:
- Perplexity MCP Server to fetch the current AMZN stock value.
- Context7 MCP server for right usage (ES6 module import map and initialization, best-practices...) of latest version of Three.js and OrbitControl.
- AWS Nova canvas MCP server to generate images.
IMPORTANT: If you encounter integration issues with Three.js or OrbitControl, leverage Context7 & Perplexity to enrich your reasoning.

## Developper interactions

Ask questions to clarify ambiguities.