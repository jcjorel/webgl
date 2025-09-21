
# WebGL AWSome 3D demo application

## Application synopsys

- A single Web page containing a WebGL micro application that makes the available AWS image PNG slowly rotating on a glossy glass 3D pane with mouse control (limitless 360° grab rotation, pan ,zoom). 
- An static image displayed in the background, of a desert at night, clear starry sky and fantastical colorful supernatural vegetals (w/o cacti, trees, shooting stars, mountains, giant plants or giant objects. **CRITICAL:** The skyline must be flat and free of any visual obstruction). 
- On top of this static image, the clear starry sky is animated with visualy appealing sparkling realistic shooting stars/meteor shower effect. 
- The ground must have laso a dynamic animated vapor particle system to create a surreal ambiance.
All design decisions must maximize Wow effect!

## Implementation constraints

All the visual components are displayed on top of each others in the z-order below:
- Background landscape (2D layer - implemented as single CSS image covering the whole viewport, no 3D complexity)
- Ground vapor (3D layer)
- shooting star (3D layer)
- AWS Logo & AMZN stock (Three.js scene 3D layer)

CRITICAL: Take great care to build a consistent 2D (i.e. background image perspective) to 3D world mapping.

CRITICAL: Each visual component has its own HTML5 canvas **THAT MUST BE ALWAYS TRANSPARENT BY DESIGN**.

**CRITICAL: Mouse control only apply to the AWS Logo/AMZN stock 3D scene**.

### Background landscape visual component

- Generated image is a simply a 2D fixed background always fitting the whole screen

### shooting star visual component

Note: A shooting star is a meteor point and its long alpha blended trail.
- Shooting stars are part of a 3D modeled sky and atmosphere
- Shooting stars fly in the 3D model from above the top of viewer position
- Shooting stars respect the perspective of the background scene
- Shooting stars appear at random positions **always visible from top of the screen**
- Meteors desintegrate, at random positions **above the skyline**.
- Meteors desintegrate with a tiny flash
- All meteors have strictly parallel (w/ flat angle ~20°) trajectory entry in the 3D modeled atmosphere
- Shooting stars fly with 3D sky and atmosphere vectors that align with viewer perspective, to be visible
- Shooting stars are flying in the 3D sky and never reach the background image skyline
- Shooting stars **MUST** simulate realisticly a meteor point and its **long gradient-alpha blended** trail
- Shooting stars have realistic color variations.
- Shooting star trail length depends on the meteor point altitude (i.e. longer trail for higher altitude)
- The meteor point is strongly glowing; the glowing get quickly weaker along the trail until it vanishes at the end of the trail.
- One shooting star spawns on average every 0.5 seconds with transient spawn burst.

### Ground vapor visual component

- Vapors are randomly appearing as **morphing realistic highly-visible** neon-colored originating from visible ground level.
- Vapors have **realistic** terrain-following ground-hugging behavior.
- Vapors move slowly and smoothly in the small wind direction.
- Vapors are doing frequent mitosis effects (vapor splitting/merging) with smooth morphosis
- Vapors are randomly appearing slowly and smoothly and finally disappear slowly and smoothly
- Vapors have proper perspective scaling (distant vapors smaller than closer ones). 
- Each vapor has randomly selected target transparency and display duration.
- One vapor appears randomly on average every 1 seconds and last randomly around 15 seconds

### AWS Logo & AMZN stock visual component

- Under the AWS logo and rotating with it, place an AMZN stock value in $.
- The AMZN stock value is **hardcoded (i.e. not real-time)**
- The AWS logo has strong metalness, mild roughness, is fully opaque and slightly emissive.
- AWS Logo PNG is placed on one side (i.e. **NOT inside**) of glass box
- AWS logo glass box depth is 1/10 of its width
- AWS Logo PNG is visible even from the backside
- AWS Logo PNG is placed in normal position (i.e. not back flip)
- The glass box is semi-transparent and allow vapors, shooting stars and AWS logo to be seen if behind it
- The AMZN stock is rendered with a 3D reflective and slightly emissive non-extruded shape
- The AWS logo, glass box and AMZN stock are strictly tied together and rotate together
- The AWS logo and AMZN stock reflect the surrounding background image
- The whole component has **4 sources of intense lighting** illuminating it, located:
* Light 1: Left bottom (color: ground left bottom dominant color)
* Light 2: Right bottom (color: ground right bottom dominant color)  
* Light 3: Upper (color: sky dominant color)
* Light 4: Camera axis (color: white, positioned along camera viewing direction)
**CRITICAL:** To limit impacts of OrbitControls camera movements, the AWS Logo and AMZN stock group must be an isolated scene from all others of the app.



## Technical constraints
- Use `Three.js` JavaScript library.
- Use a python extremely simple http server to serve the web page (port 8054 w/ TCP reuse option, HTTP header Cache-Control forbidding browser caching). **CRITICAL:** **NEVER* override `http.server.SimpleHTTPRequestHandler:guess_type()`method to manipulate MIME-types.
- Background image must fit automatically the web page size. 
- Put all CSS in the HTML page. 
- Put all Javascript in main.js, vapor.js, logo.js and shooting_star.js.
- Design it only for Chrome latest version browser (WebGL2 ready).
- **All JS librairies will be integrated in ES6 fashion only!**

**CRITICAL:** To achieve success of the implementation, you **MUST** take great care to define a robust bidirectional 2D (i.e. backgound image perspective) to 3D world coordinate system (i.e. 3D scene objects).

## Testing / Debug

To test and debug the solution, you will start the webserver then use the browser tool and will leverage the Chrome Developper tools logs.
You will instrument the JavaScript app startup code with logs to ease debugging.
You will instrument ground vapor and shooting star render loop to see event coordinates in the 2D and 3D worlds.

**ULTRA CRITICAL:** When you encounter issues (initialization or syntax errors, unknown/incorrect API, invalid API return code, unkown object member, etc...) with your use of a software library, module or language, you **MUST IMMEDIATLY** look for guidance by calling Context7 (preferably) and/or Perplexity MCP servers to enrich your reasoning to make informed and robust fixes.


## Build considerations and instructions for you

Use:
- Perplexity MCP Server to fetch the current AMZN stock value.
- Context7 MCP server for right usage (ES6 module import map and initialization, best-practices...) of latest version of Three.js and OrbitControls. **This is the prefered source of truth for Three.js topics**
- AWS Nova Canvas MCP server to generate background image with desert night scene specifications. Target resolution: 1920x1088 for optimal quality. **CRITICAL**: You will look at the Nova Canvas generated image to find the skyline position to make sure shooting stars are always above it.

**Do not use MCP servers in the application! There are only used by you!**

# Your tasks

Design, implement, test and debug this application.

## Intial plan

1) Start by performing academic separate researches on:
- Latest release of `Three.js` (import map CDN URLs, relevant usage...),
- High quality and realistic vapor generation with `Three.js` capabilities (WebGL2 shaders, use of the coordinate system defined)
- High quality and realistic shooting star generation with `Three.js` capabilities (WebGL2 shaders, use of the coordinate system defined)
2) Generate the Nova Canvas background image
3) With your vision capabilities, estimate the skyline coordinates as it will be required for shooting stars and ground vapor feature
4) All the remaining needed tasks...