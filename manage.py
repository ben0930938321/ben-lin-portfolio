"""Synchronize added airport photos and serve the portfolio locally."""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / 'pic' / '02'
TARGET = ROOT / 'assets' / 'airport-added'

def sync():
    SOURCE.mkdir(parents=True, exist_ok=True)
    TARGET.mkdir(parents=True, exist_ok=True)
    photos = []
    for path in sorted(SOURCE.iterdir(), key=lambda p: p.name.casefold()):
        if not path.is_file() or path.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'}:
            continue
        name = hashlib.sha256(path.name.encode()).hexdigest()[:16] + path.suffix.lower()
        dest = TARGET / name
        if not dest.exists() or path.stat().st_mtime_ns != dest.stat().st_mtime_ns or path.stat().st_size != dest.stat().st_size:
            shutil.copy2(path, dest)
        photos.append({'src': 'assets/airport-added/' + name, 'caption': path.stem})
    manifest = ROOT / 'content' / 'airport-photos.json'
    text = json.dumps(photos, ensure_ascii=False, indent=2) + '\n'
    if not manifest.exists() or manifest.read_text(encoding='utf-8') != text:
        manifest.write_text(text, encoding='utf-8')
    return len(photos)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def do_GET(self):
        if self.path.split('?')[0] == '/content/airport-photos.json':
            sync()
        super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--sync', action='store_true')
    args = parser.parse_args()
    print(f'Synchronized {sync()} added airport photographs.', flush=True)
    if not args.sync:
        print('Preview: http://127.0.0.1:8000/airport.html', flush=True)
        ThreadingHTTPServer(('127.0.0.1', 8000), Handler).serve_forever()
