import sys, io, os, glob, inspect, traceback

print("=" * 60)
print(f"Interpreter: {sys.executable}")
print(f"CWD: {os.getcwd()}")
print("=" * 60)

# --- 1. Packages importable in THIS interpreter ---
for pkg in ["pypdf", "fitz", "pdf2image", "easyocr", "PIL"]:
    try:
        m = __import__(pkg)
        print(f"OK   {pkg:12} {getattr(m, '__version__', '?')}")
    except ImportError as e:
        print(f"MISS {pkg:12} {e}")

import shutil
print(f"\npoppler (pdftoppm): {shutil.which('pdftoppm') or 'NOT FOUND (fine if using PyMuPDF)'}")

# --- 2. Find the PDF automatically ---
print("\n" + "=" * 60)
print("SEARCHING FOR PDF")
print("=" * 60)

home = os.path.expanduser("~")
search_globs = [
    "eeev101.pdf",
    os.path.join("data", "**", "*.pdf"),
    os.path.join(home, "Downloads", "*.pdf"),
    os.path.join(home, "Desktop", "*.pdf"),
    os.path.join(home, "OneDrive", "Desktop", "**", "*.pdf"),
]

found = []
for pattern in search_globs:
    try:
        found.extend(glob.glob(pattern, recursive=True))
    except Exception:
        pass

found = sorted(set(os.path.abspath(p) for p in found if os.path.isfile(p)))

if not found:
    print("No PDFs found. Set PDF_OVERRIDE below to the full path.")
else:
    for p in found[:15]:
        print(f"  {p}")

PDF_OVERRIDE = None          # <-- set to r"C:\full\path\file.pdf" to force one
PDF = PDF_OVERRIDE or (found[0] if found else None)
print(f"\nUsing: {PDF}")

# --- 3. Inspect what the loader module actually exposes ---
print("\n" + "=" * 60)
print("rag.document_loader CONTENTS")
print("=" * 60)

loader_fn = None
try:
    import rag.document_loader as dl
    names = [n for n in dir(dl) if not n.startswith("__")]
    print("All names:", names)

    callables = [n for n in names if callable(getattr(dl, n, None))]
    print("\nCallables:")
    for n in callables:
        try:
            print(f"  {n}{inspect.signature(getattr(dl, n))}")
        except (ValueError, TypeError):
            print(f"  {n}(?)")

    # Pick the most likely PDF-extraction function
    candidates = [n for n in callables
                  if "pdf" in n.lower() and ("extract" in n.lower() or "load" in n.lower())]
    if not candidates:
        candidates = [n for n in callables if "extract" in n.lower()]

    print(f"\nCandidate extractors: {candidates}")
    if candidates:
        loader_fn = getattr(dl, candidates[0])
        print(f"Will call: {candidates[0]}")

except Exception:
    print("Could not import rag.document_loader:")
    traceback.print_exc()

# --- 4. Read the PDF ---
if PDF and os.path.exists(PDF):
    print("\n" + "=" * 60)
    print("PDF CONTENT")
    print("=" * 60)

    data = open(PDF, "rb").read()
    print(f"Size: {len(data)} bytes | Header: {data[:8]}")

    # Raw PyMuPDF read — ground truth, independent of your code
    try:
        import fitz
        doc = fitz.open(stream=data, filetype="pdf")
        print(f"Pages: {len(doc)}")
        total = 0
        for i, page in enumerate(doc):
            t = page.get_text() or ""
            total += len(t)
            if i < 3:
                print(f"  page {i}: {len(t)} chars | {t[:100]!r}")
        print(f"\nTOTAL text-layer chars: {total}")
        if total == 0:
            print(">>> No text layer. This is a scanned PDF — OCR path required.")
        else:
            print(">>> Has a text layer. Extraction should work.")
    except Exception:
        print("PyMuPDF read failed:")
        traceback.print_exc()

    # Now call YOUR loader
    if loader_fn:
        print("\n" + "=" * 60)
        print(f"CALLING {loader_fn.__name__}")
        print("=" * 60)
        for args in ([data], [PDF]):
            try:
                out = loader_fn(*args)
                text = out if isinstance(out, str) else str(out)
                print(f"Returned {len(text)} chars")
                print(f"First 300: {text[:300]!r}")
                break
            except Exception as e:
                print(f"  with {type(args[0]).__name__}: {type(e).__name__}: {e}")
else:
    print(f"\nPDF not found: {PDF}")
    print("Set PDF_OVERRIDE near the top of this script.")

print("\nDone.")
