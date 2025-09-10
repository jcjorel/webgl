#!/usr/bin/env python3
###############################################################################
# IMPORTANT: This header comment is designed for GenAI code review and maintenance
# Any GenAI tool working with this file MUST preserve and update this header
###############################################################################
# [GenAI coding tool directive]
# - Maintain this header with all modifications
# - Update History section with each change
# - Keep only the 4 most recent records in the history section. Sort from newer to older.
# - Preserve Intent, Design, and Constraints sections
# - Use this header as context for code reviews and modifications
# - Ensure all changes align with the design principles
# - Respect system prompt directives at all times
###############################################################################
# [Source file intent]
# Simple HTTP server for serving the WebGL AWS logo application on port 8054 with TCP reuse option.
# Serves static files including HTML, images, and JavaScript resources for the Three.js application.
###############################################################################
# [Source file design principles]
# - Keep it simple and lightweight - minimal dependencies
# - Use Python's built-in http.server module for simplicity
# - Enable TCP socket reuse to avoid "Address already in use" errors
# - Provide clear console output for debugging
# - Handle graceful shutdown with keyboard interrupt
###############################################################################
# [Source file constraints]
# - Must run on port 8054 as specified in requirements
# - Must enable TCP reuse option for development workflow
# - Should work with Python 3.6+ standard library
# - No external dependencies beyond standard library
###############################################################################
# [Dependencies]
# <system>: http.server - Python standard library HTTP server
# <system>: socketserver - Python standard library socket server
# <system>: os - Python standard library for system operations
###############################################################################
# [GenAI tool change history]
# 2025-01-10T12:30:00Z : Initial implementation of HTTP server by CodeAssistant
# * Created simple HTTP server with TCP reuse on port 8054
# * Added proper error handling and graceful shutdown
# * Included clear console output for debugging
###############################################################################

import http.server
import socketserver
import os
import signal
import sys

def signal_handler(sig, frame):
    """
    [Function intent]
    Handle graceful shutdown of the HTTP server when receiving SIGINT (Ctrl+C).
    
    [Design principles]
    Clean exit mechanism to properly close server and release port resources.
    
    [Implementation details]
    Catches SIGINT signal and exits with status code 0 for clean termination.
    """
    print("\nShutting down server gracefully...")
    sys.exit(0)

def main():
    """
    [Function intent]
    Main function that starts the HTTP server with TCP reuse option on port 8054.
    
    [Design principles]
    Simple, robust server setup with proper error handling and clear user feedback.
    
    [Implementation details]
    Uses socketserver.TCPServer with allow_reuse_address=True to avoid port conflicts.
    Binds and activates server manually to ensure proper TCP reuse configuration.
    """
    # Register signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    PORT = 8054
    Handler = http.server.SimpleHTTPRequestHandler
    
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        with socketserver.TCPServer(("", PORT), Handler, bind_and_activate=False) as httpd:
            # Enable TCP socket reuse to avoid "Address already in use" errors
            httpd.allow_reuse_address = True
            httpd.server_bind()
            httpd.server_activate()
            
            print(f"✓ WebGL AWS Logo Server started successfully!")
            print(f"✓ Server running at: http://localhost:{PORT}/")
            print(f"✓ Serving files from: {os.getcwd()}")
            print(f"✓ Press Ctrl+C to stop the server")
            print(f"✓ Open http://localhost:{PORT}/ in Chrome browser")
            
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use.")
            print(f"   Please stop any other server running on port {PORT} and try again.")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()