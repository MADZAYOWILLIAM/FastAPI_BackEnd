#!/usr/bin/env python3
"""
Script to add mobile sidebar navigation to all HTML pages
"""

import re
from pathlib import Path

# Sidebar HTML to insert after </nav>
SIDEBAR_HTML = '''
    <!-- Mobile Slide-in Sidebar -->
    <div id="mobileSidebar" class="fixed inset-0 z-50 md:hidden hidden">
        <!-- Overlay -->
        <div id="sidebarOverlay" class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Sidebar -->
        <aside class="absolute top-0 left-0 h-full w-64 bg-white shadow-2xl transform -translate-x-full transition-transform duration-300 ease-in-out" id="sidebarPanel">
            <div class="flex flex-col h-full">
                <!-- Sidebar Header -->
                <div class="flex items-center justify-between p-4 border-b border-gray-200">
                    <div class="flex items-center gap-2">
                        <img src="../resources/WhatsApp_Image_2026-01-11_at_21.31.54-removebg-preview.png" alt="Logo" class="w-8 h-8">
                        <span class="font-bold text-slate-900">Menu</span>
                    </div>
                    <button id="closeSidebar" class="p-2 hover:bg-gray-100 rounded-lg">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <!-- Navigation Links -->
                <nav class="flex-1 overflow-y-auto p-4">
                    <div class="space-y-1">
                        <a href="index.html" class="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-[var(--primary-blue)] rounded-lg font-medium transition">
                            <span class="material-symbols-outlined">home</span>
                            Home
                        </a>
                        <a href="about.html" class="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-[var(--primary-blue)] rounded-lg font-medium transition">
                            <span class="material-symbols-outlined">info</span>
                            About Us
                        </a>
                        <a href="program.html" class="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-[var(--primary-blue)] rounded-lg font-medium transition">
                            <span class="material-symbols-outlined">school</span>
                            Programs
                        </a>
                        <a href="service.html" class="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-[var(--primary-blue)] rounded-lg font-medium transition">
                            <span class="material-symbols-outlined">room_service</span>
                            Services
                        </a>
                        <a href="news.html" class="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-[var(--primary-blue)] rounded-lg font-medium transition">
                            <span class="material-symbols-outlined">newspaper</span>
                            News & Updates
                        </a>
                    </div>
                </nav>
                
                <!-- Sidebar Footer -->
                <div class="p-4 border-t border-gray-200">
                    <a href="signup.html" class="block w-full bg-[var(--primary-blue)] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center">
                        Get Started
                    </a>
                    <a href="login.html" class="block w-full mt-2 border border-[var(--primary-blue)] text-[var(--primary-blue)] px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center">
                        Login
                    </a>
                </div>
            </div>
        </aside>
    </div>
'''

def add_hamburger_button(content):
    """Add hamburger menu button to navigation if not present"""
    if 'id="mobileMenuToggle"' in content:
        return content
    
    # Find the closing </div> of the navigation items and add button before it
    pattern = r'(</div>\s*</div>\s*</nav>)'
    replacement = r'''
                <!-- Mobile Menu Button -->
                <button id="mobileMenuToggle" class="md:hidden p-2 text-slate-600 hover:text-[var(--primary-blue)]">
                    <span class="material-symbols-outlined text-3xl">menu</span>
                </button>
            \1'''
    
    content = re.sub(pattern, replacement, content, count=1)
    return content

def add_sidebar(content):
    """Add sidebar HTML after </nav> if not present"""
    if 'id="mobileSidebar"' in content:
        return content
    
    # Add sidebar after </nav>
    content = content.replace('</nav>', f'</nav>{SIDEBAR_HTML}', 1)
    return content

def add_sidebar_script(content):
    """Add sidebar.js script reference before </body> if not present"""
    if 'sidebar.js' in content:
        return content
    
    # Add script before </body>
    content = content.replace('</body>', '    <script src="../scripts/sidebar.js"></script>\n</body>', 1)
    return content

def hide_desktop_button(content):
    """Hide Get Started/Login button on mobile"""
    # Add hidden md:inline-block to buttons if not present
    patterns = [
        (r'(<a href="(?:signup|login)\.html"\s+class="[^"]*)(">)', r'\1 hidden md:inline-block\2'),
    ]
    
    for pattern, replacement in patterns:
        if 'hidden md:inline-block' not in content:
            content = re.sub(pattern, replacement, content)
    
    return content

def process_file(filepath):
    """Process a single HTML file"""
    print(f"Processing {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if already processed
    if 'id="mobileSidebar"' in content:
        print(f"  ✓ Already has sidebar")
        return
    
    # Apply transformations
    content = add_hamburger_button(content)
    content = add_sidebar(content)
    content = add_sidebar_script(content)
    content = hide_desktop_button(content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  ✓ Added sidebar and hamburger menu")

def main():
    pages_dir = Path('frontend/client/pages')
    
    # Process all HTML files except admin-dashboard (already has sidebar)
    html_files = [
        'program.html',
        'service.html',
        'news.html',
        'about.html',
        'login.html',
        'signup.html',
        'member-dashboard.html'
    ]
    
    for filename in html_files:
        filepath = pages_dir / filename
        if filepath.exists():
            process_file(filepath)
        else:
            print(f"⚠ {filename} not found")
    
    print("\n✅ All pages updated!")

if __name__ == '__main__':
    main()
