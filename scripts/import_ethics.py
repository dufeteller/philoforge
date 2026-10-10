"""Import Elwes' public-domain Ethics (PG 3800), without inferring proofs.
Usage: python scripts/import_ethics.py /path/to/3800-h.htm
The source's spelling and numbering are preserved; whitespace is normalized.
"""
from html.parser import HTMLParser
from pathlib import Path
import hashlib, json, re, sys

class Blocks(HTMLParser):
    def __init__(self):
        super().__init__(); self.tag = None; self.buf = ''; self.blocks = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() in ('h2', 'h3', 'h4', 'p'):
            self.tag = tag.lower(); self.buf = ''
    def handle_data(self, data):
        if self.tag: self.buf += data
    def handle_endtag(self, tag):
        if tag.lower() == self.tag:
            self.blocks.append((self.tag, ' '.join(self.buf.split())))
            self.tag = None

def roman(s):
    values = {'I':1,'V':5,'X':10,'L':50,'C':100}
    nums = [values[c] for c in s.upper()]
    return sum(-v if i+1 < len(nums) and v < nums[i+1] else v for i,v in enumerate(nums))

path = Path(sys.argv[1]); raw = path.read_bytes()
p = Blocks(); p.feed(raw.decode('latin1'))
items = []; part = 0; section = ''; current = None; physical = False; physical_ax = 0
kinds = {'D':'Definition','A':'Axiom','P':'Proposition','L':'Lemma','Post':'Postulate','AD':'Definition of an emotion'}
for tag, text in p.blocks:
    if re.match(r'^PART [IVX]+[.:]', text):
        part = roman(re.search(r'PART ([IVX]+)', text)[1]); section = 'Preface'; current = None; physical = False; continue
    if not part: continue
    if text == 'End of the Ethics by Benedict de Spinoza': break
    if tag != 'p':
        if text.startswith('DEFINITIONS OF THE EMOTIONS'): section='AD'
        elif text.startswith('GENERAL DEFINITION'): section='General definition of the emotions'
        elif text.startswith('DEFINITIONS'): section='D'
        elif text.startswith('AXIOM'): section='A'
        elif text.startswith('POSTULATES'): section='Post'
        elif text.startswith('PROPOSITIONS'): section='P'
        elif text.startswith('APPENDIX'): section='Appendix'
        elif text.startswith('PREFACE'): section='Preface'
        current = None
        continue
    kind = None; number = None; statement = text
    m = re.match(r'^(PROP\.|LEMMA|AXIOM|DEFINITION)\s+([IVXLCD]+)\.\s*(.*)', text, re.I)
    if m:
        kind = {'PROP.':'P','LEMMA':'L','AXIOM':'A','DEFINITION':'D'}[m[1].upper()]; number = roman(m[2]); statement=m[3]
        if part==2 and kind in ('L','A'): physical=True
        if part==2 and kind=='P': physical=False
    else:
        m=re.match(r'^([IVXLCD]+)\.\s*(.*)', text)
        if m and section in ('D','A','Post','AD'):
            kind=section; number=roman(m[1]); statement=m[2]
        elif part==4 and section=='A' and current is None:
            kind='A';number=1
    if kind:
        original_number = number
        prefix = 'Phys-A' if part==2 and kind=='A' and physical else kind
        if prefix=='Phys-A':
            physical_ax+=1; number=physical_ax
        item={'id':f'E{part}-{prefix}{number}','part':part,'kind':kinds[kind], 'number':number,'sourceNumber':original_number,'statement':statement,
              'reference':f'Ethics {part}, {kinds[kind]} {number}'+(f' (physical interlude, printed number {original_number})' if prefix=='Phys-A' else ''),
              'source':f'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap0{part}',
              'paragraphs':[], 'status':'source-only'}
        items.append(item);current=item
    elif current:
        current['paragraphs'].append(text)
    else:
        # Unnumbered prefaces, appendices, physical definition, explanations.
        if text:
            item={'id':f'E{part}-Text{sum(i["part"]==part and i["kind"]=="Text" for i in items)+1}', 'part':part,'kind':'Text','statement':text,'reference':f'Ethics {part}, {section}',
                  'source':f'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap0{part}', 'paragraphs':[], 'status':'source-only'}
            items.append(item)
counts=[sum(i['part']==n and i['kind']=='Proposition' for i in items) for n in range(1,6)]
assert counts==[36,49,59,73,42], counts
assert len({i['id'] for i in items})==len(items)
assert all([i['number'] for i in items if i['part']==n and i['kind']=='Proposition']==list(range(1,c+1)) for n,c in enumerate(counts,1))
for item in items:
    if item['id'] in ['E1-D3','E1-D5','E1-A4','E1-A5','E3-D1','E3-D2']:
        item['status']='encoded-premise'
    if item['id']=='E1-P1':
        item['status']='lean-checked';item['theorem']='PhiloForge.Spinoza.proposition1';item['formalScope']='Limited reconstruction: priority means asymmetric conceptual dependence, not temporal precedence.'
    if item['id']=='E1-P6':
        item['status']='lean-checked';item['theorem']='PhiloForge.Spinoza.proposition6_causal';item['formalScope']='Limited reconstruction: distinct substances cannot cause one another. Uses the alternative corollary argument; the historical P2/P3/P5 proof and broader production vocabulary are not formalized.'
    if item['id']=='E1-P3':
        item['status']='lean-checked'; item['theorem']='PhiloForge.Spinoza.proposition3';item['formalScope']='Causal and conceptual reconstruction; see the disclosed vocabulary and assumptions.'
translations = json.loads((Path(__file__).resolve().parents[1]/'website/dist/data/ethics-fr.json').read_text())
for item in items:
    if item['id'] in translations: item['translations'] = {'fr': translations[item['id']]}
result={'edition':{'title':'Ethics','author':'Benedict de Spinoza','translator':'R. H. M. Elwes','gutenbergId':3800,'source':'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm','sha256':hashlib.sha256(raw).hexdigest(),'license':'Public-domain translation; source edition and Project Gutenberg terms linked.','normalization':'HTML stripped; whitespace normalized; original spelling retained.'},'parts':[{'id':n,'title':title,'propositions':c} for n,(title,c) in enumerate(zip(['Concerning God','The nature and origin of the mind','The origin and nature of the emotions','Human bondage, or the strength of the emotions','The power of the understanding, or human freedom'],counts),1)],'items':items}
out=Path(__file__).resolve().parents[1]/'website/dist/data/ethics.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'Imported {len(items)} entries; {sum(counts)} propositions across all five parts.')
