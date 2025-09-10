Create a single Web page containing a WebGL micro application that makes the supplied AWS image PNG slowly rotating on a glossy glass 3D pane with optional mouse control. Generate a background image of a desert at night, clear sky with stars with fantastical colorful supernatural vegetals (w/o cacti). 

The clear sky must be animated with realistic shooting stars/meteor shower effect. 
Some vaporwave elements must be added to the scene close the camera.

Under the rotating AWS logo and rotating with it, place an hardcoded AMZN stock value in $ (fetch today stock value as the hardcoded value).

You will make sure that:
- The generated image is a fixed background (i.e. not rotating with the logo or mouse controled)
- The shooting stars and vapor element 3D scene is independent to the Logo&AMZN stock one (so not subject to mouse control)
- The shooting stars are small white-colored lines with variable alpha channel depending on distance (i.e. think shooting stars entering the atmosphere and becoming brighter as they go above the camera)
- Make sure that shooting stars come from a plane few pixels above the background horizon line and flow quickly across the blue sky toward a vanishing virtual point above and behind the camera (At design time, you will need to oepn and analyze the generated Nova Canvas image to locate the polygon of the blue sky area)
- Make sure vaporware elements are randomly appearing as animated shaded vertical lines coming from the generated image near ground. The shaded lines are always a gradient fully transparent at the bottom then becoming semi-transparent (each line had a randomly selected target transparency) 

Constraints:
Use Three.js framework. 
Use a python simple http server to serve the web page (port 8054 w/ TCP reuse option). 
Background image must fit automatically the web page size (real image size 1920x1088). 
Design it for Chrome latest version browser.

To test the solution, you will use the browser tool and will leverage the Chrome Developper tool logs. 
At build time, use:
- Perplexity MCP Server to fetch the current AMZN stock value.
- Context7 MCP server for right usage (URLs, best-practices...) of latest version of Three.js and OrbitControl.
- AWS Nova canvas MCP server to generate images.
IMPORTANT: If you encounter integration issues with Three.js or OrbitControl, leverage Context7 & Perplexity to enrich your reasoning.

Make it KISS!

CRITICAL: Stick to the requirements. Do not inflate them during your processing!

Ask questions.