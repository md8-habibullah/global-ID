import os
import glob
from PIL import Image, ExifTags
import json
import shutil
from datetime import datetime

gallery_dir = "/home/dev/cccoding/global-ID/public/gallery"
curated_dir = os.path.join(gallery_dir, "curated")
data_output = "/home/dev/cccoding/global-ID/components/data"
data_file = os.path.join(data_output, "gallery-data.json")

def get_exif_date(img):
    try:
        exif_info = img._getexif()
        if exif_info:
            for tag, value in exif_info.items():
                decoded = ExifTags.TAGS.get(tag, tag)
                if decoded == "DateTimeOriginal":
                    return datetime.strptime(value, "%Y:%m:%d %H:%M:%S")
    except Exception:
        pass
    return None

def process_curated():
    # Gather curated files
    image_files = []
    for ext in ('*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG'):
        image_files.extend(glob.glob(os.path.join(curated_dir, ext)))
    
    images_data = []

    for file_path in image_files:
        try:
            with Image.open(file_path) as img:
                date_taken = get_exif_date(img)
                mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
                sort_date = date_taken if date_taken else mtime
                
                images_data.append({
                    'original_path': file_path,
                    'filename': os.path.basename(file_path),
                    'date': sort_date
                })
        except Exception as e:
            print(f"Failed to read {file_path}: {e}")

    # Sort
    images_data.sort(key=lambda x: x['date'], reverse=True)

    gallery_json = []
    max_size = (1080, 1080)

    for idx, data in enumerate(images_data):
        original_path = data['original_path']
        try:
            with Image.open(original_path) as img:
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                original_stem = os.path.splitext(data['filename'])[0]
                
                # Make semantic Alt tag from filename: "custom-3d-printed-robot-car" -> "Custom 3d Printed Robot Car"
                semantic_alt = " ".join([word.capitalize() for word in original_stem.replace("-", " ").replace("_", " ").split()])
                
                safe_name = "".join([c for c in original_stem if c.isalnum() or c in "_-"])
                new_filename = f"{safe_name}.webp"
                new_path = os.path.join(gallery_dir, new_filename)
                
                img.save(new_path, "WEBP", quality=80)
                
                gallery_json.append({
                    "id": idx + 1,
                    "src": f"/gallery/{new_filename}",
                    "alt": semantic_alt,
                    "date": data['date'].strftime("%Y-%m-%d"),
                    "width": img.width,
                    "height": img.height
                })
                
                print(f"Processed curated {original_path} -> {new_filename}")
                
        except Exception as e:
            print(f"Failed to process {original_path}: {e}")

    # Save JSON
    with open(data_file, "w") as f:
        json.dump(gallery_json, f, indent=2)

if __name__ == "__main__":
    process_curated()
    print("Done processing curated images.")
