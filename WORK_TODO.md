
# WebGL AWSome 3D demo application

## Application synopsys

- A single Web page containing a WebGL micro application that makes the available AWS image PNG slowly rotating on a glossy glass 3D pane with mouse control (limitless 360° grab rotation, pan ,zoom). 
- A background image of a desert at night, clear sky with stars with fantastical colorful supernatural vegetals (w/o cacti, trees, shooting stars, mountains, giant plants or giant objects. **CRITICAL:** The skyline must be flat and free of any visual obstruction). 
- The clear sky must be animated with visualy appealing sparkling realistic shooting stars/meteor shower effect. 
- The ground must have a dynamic animated vapor particle system to create a surreal ambiance.
All design decisions must maximize Wow effect!

## Implementation constraints

All the visual components are displayed on top of each others in the order below:
- Background landscape (2D opaque layer - implemented as single CSS image covering the whole viewport, no 3D complexity)
- Shouting star (2D transparent layer - simulated meteors with 2D lines, no Three.js/WebGL use)
- Ground vapor (2D transparent layer - simulated vapor clouds with 2D textures and perspective simulation, no Three.js/WebGL use)
- AWS Logo & AMZN stock (transparent Three.js scene - single visual component using Three.js in the app)

Each visual component has its own HTML5 canvas.

**CRITICAL: Mouse control only apply to the AWS Logo/AMZN stock 3D scene**.

### Background landscape visual component

- Generated image is a simply a 2D fixed background always fitting the whole screen

### Shouting star visual component

- Shooting stars appear at random positions **always far above the viewer**
- All meteors flow toward a infinite-away vanishing point located in the middle of night sky area of the background image and in front of the camera position. Meteors explode, with a very small transient light burst, before to reach this vanishing point as they can not go out the atmosphere.
- Each meteor enters the atmosphere at different depths, creating varying trail thicknesses
- Shooting stars **MUST BE** implemented with light-emitting 2D lines, simulating a meteor point and its long alpha blended trail with realistic color variations.
- The meteor point is glowing; the meteor trail is bright but not glowing
- The meteor point and the start of the trail have same size.
- When the meteor point disappears (i.e. meteor explosion), its trail continues to move up to the meteor disappearance point then fade vanish also
- One shooting star spawns on average every 3 seconds

### Ground vapor visual component

- Make sure vapors are randomly appearing as morphing realistic highly-visible neon-colored originating from visible ground level with ground-hugging behavior.
- Use shape for vapor with texture-based rendering and prodedural blurred foggy shaders
- Make sure vapors are randomly appearing slowly and smoothly and finally disappear slowly and smoothly
- Make sure vapors are looming on the ground taking perpespective into account
- vapors have proper perspective scaling (distant vapors smaller than closer ones). 
- Each vapor has randomly selected target transparency and display duration.
- One vapor appears randomly on average every 2 seconds and last randomly around 15 seconds

### AWS Logo & AMZN stock visual component

- Under the AWS logo and rotating with it, place an **hardcoded (i.e. not real-time)** AMZN stock value in $.
- The AWS logo has strong metalness, slight roughness, is not transparent and is slightly emissive.
- AWS Logo PNG is placed on one side (i.e. **NOT inside**) of glass box
- AWS logo glass box depth is 1/10 of its width
- AWS Logo PNG is visible even from the backside
- AWS Logo PNG is placed in normal position (i.e. not back flip)
- The glass box is semi-transparent and allow vapor & shouting star to be seen if behind it
- The AMZN stock displayed with 3D reflective and slightly emissive shape using few pixel extruded font
- The logo and AMZN stock reflect the surrounding background scene
- The whole component has **4 sources of intense lighting** illuminating it, located:
* Left bottom (color of the left bottom ground)
* Right bottom (color of the left rigth ground)
* Upper (color of the sky dominant color)
- In the exact axis of the camera FoV (white color)



## Technical constraints
- Use Three.js framework. 
- Use a python extremely simple http server to serve the web page (port 8054 w/ TCP reuse option, HTTP header Cache-Control forbidding browser caching, NEVER use existing guess_type() method but returns a **simple and dumb** hard-coded mime-type string guessed from file extension). 
- Background image must fit automatically the web page size (real image size 1920x1088). 
- Put all CSS in the HTML page. 
- Put all Javascript in main.js, shouting_stars.js, ground_vapor.js and logo.js
- Design it for Chrome latest version browser.

## Testing / Debug

To test and debug the solution, you will start the webserver then use the browser tool and will leverage the Chrome Developper tools logs.
You will instrument the JavaScript code with logs to ease debugging.

## Build considerations and instructions for you

Use:
- Perplexity MCP Server to fetch the current AMZN stock value.
- Context7 MCP server for right usage (ES6 module import map and initialization, best-practices...) of latest version of Three.js and OrbitControl. **This is prefered source of truth for Three.js topics**
- AWS Nova canvas MCP server to generate images.
IMPORTANT: If you encounter integration issues with Three.js or OrbitControls, leverage Context7 & Perplexity MCP servers to enrich your reasoning.

**Do not use MCP servers in the application! There are only used by you!**

# Your tasks

Design, implement, test and debug this application.
Start by performing technical and academic research on Three.js for logo visual component and for vapor/shooting star 2D simulation best practices.
