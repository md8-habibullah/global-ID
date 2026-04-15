import os
import json
from PIL import Image
from datetime import datetime

# Paths
GALLERY_DIR = 'public/gallery'
OUTPUT_JSON = 'components/data/gallery-data.json'

CATEGORIES = {
    'achievements': 'blessings',
    'memories': 'memories'
}

def get_image_data(file_path):
    try:
        with Image.open(file_path) as img:
            width, height = img.size
            # Try to get date from EXIF
            exif_data = img._getexif()
            date_str = None
            if exif_data:
                # 36867 is DateTimeOriginal
                date_str = exif_data.get(36867) or exif_data.get(306)
            
            if date_str:
                try:
                    dt = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
                    return width, height, dt.strftime('%Y-%m-%d')
                except ValueError:
                    pass
            
            # Fallback to file mtime
            mtime = os.path.getmtime(file_path)
            dt = datetime.fromtimestamp(mtime)
            return width, height, dt.strftime('%Y-%m-%d')
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None, None, None

def main():
    gallery_items = []
    item_id = 1
    
    for folder, category in CATEGORIES.items():
        folder_path = os.path.join(GALLERY_DIR, folder)
        if not os.path.exists(folder_path):
            print(f"Warning: Folder {folder_path} does not exist.")
            continue
            
        for filename in sorted(os.listdir(folder_path)):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                file_path = os.path.join(folder_path, filename)
                width, height, date = get_image_data(file_path)
                
                if width and height:
                    # Clean alt text
                    alt = filename.rsplit('.', 1)[0]
                    # Strip trailing numeric IDs (like -1776189676)
                    import re
                    alt = re.sub(r'[-_]\d+$', '', alt)
                    alt = alt.replace('-', ' ').replace('_', ' ').strip().capitalize()
                    
                    # Handle "rejected" prefix specifically if it exists
                    if alt.lower().startswith('rejected'):
                        alt = "Memory Snapshot"
                    
                    gallery_items.append({
                        "id": item_id,
                        "src": f"/{file_path.replace('public/', '').replace(os.sep, '/')}",
                        "alt": alt,
                        "date": date,
                        "width": width,
                        "height": height,
                        "category": category
                    })
                    item_id += 1

    # Write to JSON
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(gallery_items, f, indent=2)
    
    print(f"Successfully synced {len(gallery_items)} images to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
