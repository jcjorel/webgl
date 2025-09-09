Create a single Web page containing a WebGL micro application that makes the supplied AWS image PNG slowly rotating in solid 3D with optional mouse control. Generate a background image of a desert at night, clear sky with stars with fantastical colorful supernatural vegetals. 

The clear sky must be animated with realistic shooting stars/meteor shower effect. Some vaporwave elements must be added to the scene.

Under the rotating AWS logo and rotating with it, place an hardcoded AMZN stock value in $ (fetch today stock value as the hardcoded value).

You will make sure that:
- The generated image is a fixed background (i.e. not rotating with the logo or mouse controled)
- The shooting stars and vapor element positions are fixed and not subject to mouse control
- The shooting stars are small white-colored lines with variable alpha channel depending on distance (i.e. think shooting stars entering the atmosphere and becoming brighter as they go above the camera)
- Make sure that shooting stars go from the horizon and flow quickly across the blue sky from south-west to north-east direction (You will need to analyze the generated image to locate the polygon of the blue sky area)
- Make sure vaporware elements are randomly appearing as animated shaded vertical lines coming from the generated image near ground. The shaded lines are always a gradient fully transparent at the bottom then becoming semi-transparent (each line had a randomlu selected target transparency) 

Constraints:
Use Three.js framework. Use a python simple http server to serve the web page (port 8054). Background image must fit automatically the web page size (real image size 1920x1088). 
Design it for Chrome latest version browser.

To test the solution, you will use the browser tool. 
Use Perplexity MCP Server to fetch the current AMZN stock value.
Use Perplexity MCP Server to get URLs for OrbitControl and Three.js packages. 
Use Context7 for right usage of latest version of Three.js and OrbitControl.
Use AWS Nova canvas to generate images.

Make it KISS!

Ask questions.