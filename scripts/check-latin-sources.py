"""Verify the saved Latin excerpts against the identified ILIESI HTML download.
Usage: python scripts/check-latin-sources.py /path/to/ethica_xhtml.html
This is an offline provenance check, not a philosophical review.
"""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import sys

class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.anchors = set()
    def handle_data(self, data):
        self.parts.append(data)
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('id', 'name'):
                self.anchors.add(value)

raw = Path(sys.argv[1]).read_bytes()
registry = json.loads((Path(__file__).resolve().parents[1] / 'website/dist/data/spinoza-sources.json').read_text())
assert hashlib.sha256(raw).hexdigest() == registry['edition']['sha256'], 'Different source version: review before updating excerpts.'
parser = Text()
parser.feed(raw.decode('utf-8'))
text = ' '.join(' '.join(parser.parts).split())
for identifier, passage in registry['passages'].items():
    assert passage['latin'] in text, identifier
    assert passage['url'].split('#')[-1] in parser.anchors, identifier + ': missing anchor'
print(f"Verified {len(registry['passages'])} Latin excerpts and their anchors against the identified source download.")
