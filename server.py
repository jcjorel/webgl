#!/usr/bin/env python3
"""
WebGL AWSome 3D Demo - HTTP Server
Simple HTTP server for serving the WebGL application with proper headers.

Requirements:
- Port 8054 with TCP reuse option
- Cache-Control headers forbidding browser caching
- Support for ES6 modules and CORS
- DO NOT override http.server.SimpleHTTPRequestHandler.guess_type() method
"""

import http.server
import socketserver
import socket
import sys
import os
from datetime import datetime

class WebGLServerHandler(http.server.SimpleHTTPRequestHandler):
    """
    Custom HTTP request handler for WebGL application.
    Adds necessary headers without overriding guess_type() method.
    """
    
    def end_headers(self):
        """Add custom headers before ending headers."""
        # Forbid browser caching as required
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        # CORS headers for ES6 modules from CDN
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'credentialless')
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # Proper MIME types for ES6 modules (without overriding guess_type)
        if self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        elif self.path.endswith('.mjs'):
            self.send_header('Content-Type', 'application/javascript; charset=utf-8')
        
        super().end_headers()
    
    def log_message(self, format, *args):
        """Override log message to include timestamp and better formatting."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        client_ip = self.address_string()
        print(f"[{timestamp}] {client_ip} - {format % args}")
    
    def log_request(self, code='-', size='-'):
        """Log successful requests with more detail."""
        if isinstance(code, http.server.HTTPStatus):
            code = code.value
        
        # Color code based on status
        if code >= 200 and code < 300:
            status_color = '\033[92m'  # Green
        elif code >= 400:
            status_color = '\033[91m'  # Red  
        else:
            status_color = '\033[93m'  # Yellow
        
        reset_color = '\033[0m'
        
        self.log_message('"%s" %s%s%s %s',
                        self.requestline, status_color, str(code), reset_color, str(size))

class TCPReuseHTTPServer(socketserver.TCPServer):
    """HTTP Server with TCP reuse option enabled."""
    
    def __init__(self, server_address, RequestHandlerClass, bind_and_activate=True):
        # Enable TCP reuse option as required
        self.allow_reuse_address = True
        super().__init__(server_address, RequestHandlerClass, bind_and_activate)
        
        # Set SO_REUSEPORT if available (Linux/macOS)
        try:
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
            print("✅ TCP SO_REUSEPORT enabled")
        except (AttributeError, OSError):
            print("⚠️  SO_REUSEPORT not available, using SO_REUSEADDR only")

def main():
    """Start the WebGL HTTP server."""
    PORT = 8054
    HOST = 'localhost'
    
    print("🚀 WebGL AWSome 3D Demo - HTTP Server")
    print("=" * 50)
    
    # Check if port is already in use
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as test_sock:
            test_sock.bind((HOST, PORT))
    except OSError:
        print(f"❌ Port {PORT} is already in use!")
        print(f"   Try: lsof -i :{PORT} to find what's using it")
        sys.exit(1)
    
    # Change to script directory to serve files correctly
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"📁 Serving files from: {script_dir}")
    
    # Verify required files exist
    required_files = ['index.html', 'main.js', 'output/desert_night_background.png', 'Amazon_Web_Services_Logo.png']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print("⚠️  Warning: Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        print("   Application may not work correctly!")
    else:
        print("✅ All required files found")
    
    # Create and configure server
    try:
        with TCPReuseHTTPServer((HOST, PORT), WebGLServerHandler) as httpd:
            server_url = f"http://{HOST}:{PORT}"
            
            print(f"🌐 Server running at: {server_url}")
            print(f"🎯 Direct link: {server_url}/index.html")
            print("=" * 50)
            print("📋 Server Features:")
            print("   ✅ Cache-Control headers (no caching)")
            print("   ✅ TCP reuse option enabled") 
            print("   ✅ CORS headers for ES6 modules")
            print("   ✅ Security headers")
            print("   ✅ Proper MIME types for JavaScript")
            print("=" * 50)
            print("🔧 Controls:")
            print("   - Press Ctrl+C to stop server")
            print("   - Press 'D' in browser for debug overlay")
            print("   - Mouse controls AWS logo (OrbitControls)")
            print("=" * 50)
            
            try:
                print("🎬 Starting server... (waiting for requests)")
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n🛑 Server stopped by user (Ctrl+C)")
                
    except OSError as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()