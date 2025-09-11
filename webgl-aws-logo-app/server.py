#!/usr/bin/env python3
"""
AWS Logo WebGL Application HTTP Server

Simple HTTP server for serving the WebGL AWS Logo application.
Configured to run on port 8054 with TCP reuse option enabled as per requirements.

Usage:
    python3 server.py

Requirements:
    - Python 3.6 or higher
    - No additional dependencies (uses built-in modules)

Features:
    - Serves static files (HTML, JS, CSS, images)
    - CORS headers for development
    - Proper MIME types for WebGL assets
    - TCP socket reuse for reliable restarts
    - Graceful shutdown handling
"""

import http.server
import socketserver
import os
import sys
import signal
import logging
import mimetypes
from pathlib import Path
from urllib.parse import unquote

# Configuration
PORT = 8054
HOST = "localhost"
DIRECTORY = "."

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom request handler that adds CORS headers and proper MIME types
    for WebGL development.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        """Add CORS and caching headers"""
        # CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Cache control for development (disable caching)
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        super().end_headers()
    
    def guess_type(self, path):
        """
        Robust MIME type detection using mimetypes module directly.
        Includes WebGL-specific overrides for optimal development experience.
        
        Returns: str (mimetype only, as expected by SimpleHTTPRequestHandler)
        """
        # WebGL-specific MIME type overrides
        webgl_mime_overrides = {
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.wasm': 'application/wasm',
            '.glsl': 'text/plain',
            '.vert': 'text/plain',
            '.frag': 'text/plain',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.html': 'text/html',
            '.css': 'text/css'
        }
        
        try:
            # Clean path and get extension
            clean_path = unquote(path.lower())
            
            # Check WebGL-specific overrides first
            for ext, mime_type in webgl_mime_overrides.items():
                if clean_path.endswith(ext):
                    return mime_type
            
            # Use standard mimetypes for other files
            mimetype, encoding = mimetypes.guess_type(clean_path)
            
            # Return just the mimetype with fallback
            return mimetype or 'application/octet-stream'
            
        except Exception as e:
            # Fallback with logging
            logging.warning(f"MIME type detection failed for {path}: {e}")
            return 'application/octet-stream'
    
    def log_message(self, format, *args):
        """Custom logging format"""
        logging.info(f"{self.address_string()} - {format % args}")

class ReuseAddrHTTPServer(socketserver.TCPServer):
    """
    HTTP Server with socket reuse enabled for reliable restarts
    """
    allow_reuse_address = True
    
    def server_bind(self):
        """Bind server with socket options"""
        import socket
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        super().server_bind()

class WebGLServer:
    """
    Main server class for the WebGL AWS Logo application
    """
    
    def __init__(self, host=HOST, port=PORT, directory=DIRECTORY):
        self.host = host
        self.port = port
        self.directory = directory
        self.httpd = None
        
        # Setup logging
        self.setup_logging()
        
    def setup_logging(self):
        """Configure logging for the server"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
    def validate_environment(self):
        """Validate that the environment is ready to serve"""
        # Check if we're in the right directory
        current_dir = Path.cwd()
        
        # Look for key files
        required_files = [
            'index.html',
            'js/main.js',
            'js/components.js',
            'js/managers.js',
            'js/utils.js',
            'lib/three.min.js',
            'lib/OrbitControls.js',
            'assets/aws-logo.png'
        ]
        
        missing_files = []
        for file_path in required_files:
            if not (current_dir / file_path).exists():
                missing_files.append(file_path)
        
        if missing_files:
            logging.error("Missing required files:")
            for file_path in missing_files:
                logging.error(f"  - {file_path}")
            return False
            
        logging.info("✓ All required files found")
        return True
    
    def start(self):
        """Start the HTTP server"""
        try:
            # Validate environment
            if not self.validate_environment():
                logging.error("Environment validation failed. Server cannot start.")
                return False
                
            # Create server
            self.httpd = ReuseAddrHTTPServer((self.host, self.port), CORSRequestHandler)
            
            # Setup signal handlers for graceful shutdown
            signal.signal(signal.SIGINT, self.signal_handler)
            signal.signal(signal.SIGTERM, self.signal_handler)
            
            # Log startup information
            self.log_startup_info()
            
            # Start serving
            logging.info(f"🚀 Starting server at http://{self.host}:{self.port}/")
            logging.info("Press Ctrl+C to stop the server")
            
            self.httpd.serve_forever()
            
        except OSError as e:
            if e.errno == 48:  # Address already in use
                logging.error(f"❌ Port {self.port} is already in use")
                logging.info("Please close any other applications using this port and try again")
            else:
                logging.error(f"❌ Failed to start server: {e}")
            return False
            
        except Exception as e:
            logging.error(f"❌ Unexpected error starting server: {e}")
            return False
            
    def signal_handler(self, signum, frame):
        """Handle shutdown signals gracefully"""
        logging.info("\n🛑 Shutdown signal received")
        self.stop()
        
    def stop(self):
        """Stop the HTTP server gracefully"""
        if self.httpd:
            logging.info("Stopping server...")
            self.httpd.shutdown()
            self.httpd.server_close()
            logging.info("✓ Server stopped successfully")
        sys.exit(0)
        
    def log_startup_info(self):
        """Log useful startup information"""
        logging.info("=" * 60)
        logging.info("WebGL AWS Logo Application Server")
        logging.info("=" * 60)
        logging.info(f"Server URL: http://{self.host}:{self.port}/")
        logging.info(f"Document root: {Path(self.directory).resolve()}")
        logging.info(f"Python version: {sys.version}")
        
        # Log file sizes for debugging
        try:
            index_size = (Path(self.directory) / 'index.html').stat().st_size
            logging.info(f"Main page size: {index_size} bytes")
        except:
            pass
            
        logging.info("=" * 60)
        logging.info("Development Features:")
        logging.info("  • CORS headers enabled")
        logging.info("  • Cache disabled for development")
        logging.info("  • Custom MIME types for WebGL")
        logging.info("  • TCP socket reuse enabled")
        logging.info("=" * 60)

def main():
    """Main entry point"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║              WebGL AWS Logo Application Server               ║
║                                                              ║
║  A simple HTTP server for the WebGL AWS Logo application    ║
║  featuring rotating AWS logo on glass pane with desert      ║
║  night background, shooting stars, and vaporwave elements   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """)
    
    # Create and start server
    server = WebGLServer()
    
    try:
        server.start()
    except KeyboardInterrupt:
        # This should be handled by signal handler, but just in case
        server.stop()

if __name__ == "__main__":
    main()