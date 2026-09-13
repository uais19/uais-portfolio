"""
preview-server.py — the local preview server, with browser caching turned off.

THIS IS NOT PART OF THE SITE. Like make-images.mjs, it is a tool that runs on
your own machine; nothing in index.html or ru.html loads it, and Vercel serves
the deployed files with its own, correct caching.

WHY NOT PLAIN `python -m http.server`

That server sends a Last-Modified date but no Cache-Control header. With no
instruction, a browser guesses how long a file stays fresh on its own
("heuristic caching") and quietly reuses its stored copy on an ordinary reload.
data.js is edited outside the editor between one reload and the next, so the
page kept showing an entry's old note while the file on disk already had the
new one.

Cache-Control: no-store tells the browser not to keep a copy at all, so every
reload fetches every file again. no-cache and must-revalidate cover older
caches that read those words instead; Pragma and Expires cover HTTP/1.0 ones.

Run it (launch.json does this for the Browser pane):

    python tools/preview-server.py            serves the project on :5500
    python tools/preview-server.py 8000       another port
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# The project root is the folder above tools/. Resolving it from this file,
# not from the folder you run the command in, serves the same files either way.
ROOT = Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5500


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # end_headers() runs once per response, just before the body, so
        # adding the headers here covers every file, 404 pages included.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    handler = partial(NoCacheHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("", PORT), handler) as server:
        print(f"Serving {ROOT} on http://localhost:{PORT} with caching disabled")
        server.serve_forever()
