#!/usr/bin/env python3
"""
Simple HTTP Server for WebGL Application
Port: 8054 with TCP reuse option
No cache headers, no mime-type guessing
"""

import http.server
import socketserver
import os
from http import HTTPStatus

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with no-cache headers"""
    
    def __init__(self, *args, **kwargs):
        # Disable mime type guessing
        self.extensions_map = {}
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        """Add no-cache headers to all responses"""
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to provide basic mime types without guessing"""
        mimetype = 'application/octet-stream'
        
        # Manual mime type mapping for essential types only
        if path.endswith('.html'):
            mimetype = 'text/html'
        elif path.endswith('.css'):
            mimetype = 'text/css'
        elif path.endswith('.js'):
            mimetype = 'application/javascript'
        elif path.endswith('.png'):
            mimetype = 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            mimetype = 'image/jpeg'
        elif path.endswith('.json'):
            mimetype = 'application/json'
        elif path.endswith('.woff') or path.endswith('.woff2'):
            mimetype = 'font/woff2'
        elif path.endswith('.ttf'):
            mimetype = 'font/ttf'
            
        return mimetype
    
    def log_message(self, format, *args):
        """Custom log format"""
        print(f"[{self.log_date_time_string()}] {format % args}")

def run_server():
    PORT = 8054
    
    # Create socket with SO_REUSEADDR option
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        # Enable TCP reuse option
        httpd.socket.setsockopt(socketserver.socket.SOL_SOCKET, 
                               socketserver.socket.SO_REUSEADDR, 1)
        
        print(f"🚀 WebGL Server running at http://localhost:{PORT}/")
        print(f"📁 Serving directory: {os.getcwd()}")
        print("🛑 Press Ctrl+C to stop the server")
        print("-" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n" + "-" * 50)
            print("Shutting down server...")
            httpd.shutdown()

if __name__ == "__main__":
    run_server()