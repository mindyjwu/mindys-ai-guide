import csv
import json
import urllib.request
import io

# MoMA CSV URL
MOMA_CSV_URL = "https://media.githubusercontent.com/media/MuseumofModernArt/collection/master/Artworks.csv"

# Fields we actually need
KEEP_FIELDS = [
    "Title",
    "Artist",
    "ArtistBio",
    "Nationality",
    "BeginDate",
    "EndDate",
    "Gender",
    "Date",
    "Medium",
    "Dimensions",
    "Department",
    "Classification",
    "ThumbnailURL",
    "Circumference (cm)",
    "ObjectID",
    "URL"
]

# Departments worth keeping for creative/cultural audience
KEEP_DEPARTMENTS = {
    "Painting & Sculpture",
    "Drawings & Prints",
    "Photography",
    "Film",
    "Architecture & Design",
    "Media and Performance",
}

def is_useful_row(row):
    """Filter to rows that are actually useful for discovery"""
    # Must have a title
    if not row.get("Title", "").strip():
        return False
    # Must have at least one artist
    if not row.get("Artist", "").strip():
        return False
    # Must be in a relevant department
    if row.get("Department", "") not in KEEP_DEPARTMENTS:
        return False
    # Prefer rows with thumbnail images (better for display)
    # but don't strictly require — still include without images
    return True

def clean_row(row):
    """Keep only needed fields and clean whitespace"""
    return {k: row.get(k, "").strip() for k in KEEP_FIELDS if k in row}

def main():
    print("Downloading MoMA CSV from GitHub...")
    print("(This is ~130MB — may take a moment)\n")

    req = urllib.request.Request(
        MOMA_CSV_URL,
        headers={"User-Agent": "Mozilla/5.0"}
    )

    with urllib.request.urlopen(req, timeout=60) as response:
        content = response.read().decode("utf-8")

    reader = csv.DictReader(io.StringIO(content))

    total = 0
    kept = 0
    results = []

    for row in reader:
        total += 1
        if is_useful_row(row):
            results.append(clean_row(row))
            kept += 1

    print(f"Total rows: {total:,}")
    print(f"Kept rows:  {kept:,}")
    print(f"Reduction:  {100 - (kept/total*100):.1f}%\n")

    # Save as JSON (easier to use in JS than CSV)
    output_path = "moma_filtered.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    import os
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Saved to {output_path}")
    print(f"File size: {size_mb:.1f}MB")
    print("\nDone. Drop moma_filtered.json into your project's /data or /public folder.")

if __name__ == "__main__":
    main()