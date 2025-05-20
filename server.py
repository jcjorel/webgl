#!/usr/bin/env python3
"""
Simple HTTP server for serving the WebGL application
"""
import http.server
import socketserver
import os

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with proper MIME types"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    """Start the HTTP server"""
    handler = Handler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

if __name__ == "__main__":
    # Make sure we're serving from the directory the script is in
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    run_server()
