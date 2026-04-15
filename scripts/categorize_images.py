import os
import glob
import json
import time
from datetime import datetime
import re
from PIL import Image
import shutil

# --- Configuration ---
try:
    from transformers import pipeline
except ImportError:
    print("ERROR: HuggingFace 'transformers' or 'torch' package is not installed.")
    print("Please install them using: pip install transformers torch pillow")
    exit(1)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BUFFER_DIR = os.path.join(BASE_DIR, "public", "gallery", "Buffer_pre")
ACHIEVEMENTS_DIR = os.path.join(BASE_DIR, "public", "gallery", "achievements")
MEMORIES_DIR = os.path.join(BASE_DIR, "public", "gallery", "memories")
EJECTED_DIR = os.path.join(BASE_DIR, "public", "gallery", "ejected")
JSON_PATH = os.path.join(BASE_DIR, "components", "data", "gallery-data.json")

os.makedirs(ACHIEVEMENTS_DIR, exist_ok=True)
os.makedirs(MEMORIES_DIR, exist_ok=True)
os.makedirs(EJECTED_DIR, exist_ok=True)

MAX_WIDTH = 1080
SUPPORTED_FORMATS = ("*.png", "*.jpg", "*.jpeg", "*.webp")

print("Loading local, free AI model (CLIP Zero-Shot Image Classification)... This might take a moment.")
try:
    classifier = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
except Exception as e:
    print(f"Failed to load the model: {e}")
    exit(1)

# Pass 1: Strict Categorization & Rejection Mapping
CATEGORY_MAP = {
    # 🚫 Strict Ejections (Nudity, Solo Girls without prizes, Memes, Cards)
    "a photo of nudity, a naked person, or pornographic content": "ejected",
    "a portrait of a solo girl or female posing casually without a prize or gift": "ejected",
    "a news card, informational graphic card, or text-heavy card": "ejected",
    "image with lots of written text, poster, or document": "ejected",
    "an internet meme, funny text joke, or text screenshot": "ejected",
    "a blurry, dark, poor quality texture or meaningless household object": "ejected",
    
    # 🏆 Blessings / Achievements (Prizes, Gifting, Donations)
    "receiving a formal professional award, medal, or prize": "blessings",
    "holding a professional certificate or hackathon award": "blessings",
    "a formal donation form, giving charity, or gifting a prize": "blessings",
    "a girl or woman receiving an award, holding a prize, or gifting": "blessings",
    "delivering a formal stage presentation or robotics competition": "blessings",
    
    # 📸 Memories (Casual, Non-formal, Relaxed)
    "a casual, relaxed, non formal moment or memory": "memories",
    "hanging out casually with friends or colleagues": "memories",
    "traveling tourist, beautiful nature scenery or an outdoor adventure": "memories",
    "a casual family photo or gathering at home": "memories"
}

# Pass 2: High Level Domains (SubCategories)
DOMAIN_MAP = [
    "tourist and travel",
    "home and indoor",
    "family gathering",
    "event and ceremony",
    "professional and formal"
]

# Pass 3: Extensive Semantic Tag List
TAG_POOL = [
    "tourist", "home", "family", "friends", "scenery", "event",
    "competition", "hackathon", "certificate", "medal", "robotics",
    "indoor", "outdoor", "smile", "group", "portrait", "tech",
    "laptop", "building", "food", "casual", "nature", "night",
    "stage", "donation", "gifting", "charity", "prize", "celebration",
    "formal", "memorable", "sunshine", "selfie", "learning", "teamwork"
]

def get_image_date(img_path):
    try:
        img = Image.open(img_path)
        exif = img._getexif()
        if exif and 36867 in exif:
            date_str = exif[36867]
            dt = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
            return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    timestamp = os.path.getmtime(img_path)
    return datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")

def generate_slug(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text).strip('-')
    return text

def analyze_image_local(img_path):
    print(f"[*] Analyzing 4 AI parameters locally: {os.path.basename(img_path)}")
    try:
        img = Image.open(img_path).convert("RGB")
        
        # 1. Primary Mapping (Eject vs Sort)
        cat_results = classifier(img, candidate_labels=list(CATEGORY_MAP.keys()))
        primary_match = cat_results[0]['label']
        category = CATEGORY_MAP[primary_match]
        
        if category == "ejected":
            base_phrase = "rejected"
            alt_text = "Rejected Image"
            desc = "Image was classified as inappropriate, text-only, or non-compliant."
            return {
                "category": category, "alt": alt_text, "slug": f"{base_phrase}-{int(time.time()*1000)}", 
                "tags": [], "subCategory": "rejected", "description": desc
            }
            
        # 2. Sub-Category Target
        dom_results = classifier(img, candidate_labels=DOMAIN_MAP)
        sub_category = dom_results[0]['label']
        
        # 3. Micro Tags Generation
        tag_results = classifier(img, candidate_labels=TAG_POOL)
        # Slicing the exact top 7 AI predicted tags
        top_7_tags = [res for res in tag_results[:7]]
        semantic_tags = [item['label'] for item in top_7_tags]
        
        # 4. Formatter Engine
        base_phrase = generate_slug(primary_match)
        alt_text = primary_match.capitalize()
        # Create an intelligent sounding explanation combining the domain and scenario
        desc = f"An image capturing a {sub_category} moment, depicting exactly {primary_match}."
            
        slug = f"{base_phrase[:40].strip('-')}-{int(time.time())}"
                
        return {
            "category": category,
            "alt": alt_text,
            "slug": slug,
            "tags": semantic_tags,
            "subCategory": sub_category,
            "description": desc
        }
    except Exception as e:
        print(f"Error analyzing image: {e}")
        return None

def process_images():
    image_paths = []
    for ext in SUPPORTED_FORMATS:
        image_paths.extend(glob.glob(os.path.join(BUFFER_DIR, ext)))
        image_paths.extend(glob.glob(os.path.join(BUFFER_DIR, ext.upper())))
    
    if not image_paths:
        print(f"No images found in {BUFFER_DIR}")
        return

    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            gallery_data = json.load(f)
            
        original_count = len(gallery_data)
        synced_data = []
        for item in gallery_data:
            relative_src = item["src"].lstrip("/")
            real_path = os.path.join(BASE_DIR, "public", relative_src)
            if os.path.exists(real_path):
                synced_data.append(item)
            else:
                print(f"[CLEANUP] Removed orphaned JSON data for missing file: {item['src']}")
                
        if len(synced_data) < original_count:
            removed = original_count - len(synced_data)
            gallery_data = synced_data
            with open(JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(gallery_data, f, indent=2, ensure_ascii=False)
            print(f"🧹 Cleaned up {removed} broken links from JSON metadata.\n")
    else:
        gallery_data = []

    max_id = max([item["id"] for item in gallery_data]) if gallery_data else 0
    processed_count = 0
    ejected_count = 0
    achievements_count = 0
    memories_count = 0

    for img_path in image_paths:
        print(f"\nProcessing: {os.path.basename(img_path)}")
        
        ai_data = analyze_image_local(img_path)
        if not ai_data:
            print(f"Skipping {img_path} due to AI analysis failure.")
            continue
            
        category = ai_data["category"]
        slug = ai_data["slug"]
        alt_text = ai_data["alt"]
        date_str = get_image_date(img_path)

        original_ext = os.path.splitext(img_path)[1].lower()
        if original_ext == '.jpeg': original_ext = '.jpg'

        if category == "ejected":
            final_filename = f"{slug}{original_ext}"
            final_path = os.path.join(EJECTED_DIR, final_filename)
            counter = 1
            while os.path.exists(final_path):
                final_filename = f"{slug}-{counter}{original_ext}"
                final_path = os.path.join(EJECTED_DIR, final_filename)
                counter += 1

            shutil.move(img_path, final_path)
            print(f"[REJECTED] Moved to {EJECTED_DIR}/{final_filename}")
            ejected_count += 1
            continue

        if category == "blessings":
            target_dir = ACHIEVEMENTS_DIR
            web_path_folder = "achievements"
            achievements_count += 1
        else:
            target_dir = MEMORIES_DIR
            web_path_folder = "memories"
            memories_count += 1

        final_filename = f"{slug}{original_ext}"
        final_path = os.path.join(target_dir, final_filename)
        
        counter = 1
        while os.path.exists(final_path):
            final_filename = f"{slug}-{counter}{original_ext}"
            final_path = os.path.join(target_dir, final_filename)
            counter += 1

        try:
            with Image.open(img_path) as img:
                if img.mode in ("RGBA", "P") and original_ext == ".jpg":
                    img = img.convert("RGB")
                width, height = img.size
                if width > MAX_WIDTH:
                    ratio = MAX_WIDTH / width
                    new_width = MAX_WIDTH
                    new_height = int(height * ratio)
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                else:
                    new_width = width
                    new_height = height
                
                img.save(final_path)
                final_w, final_h = new_width, new_height
        except Exception as e:
            print(f"Error processing image with Pillow {img_path}: {e}")
            continue

        max_id += 1
        new_entry = {
            "id": max_id,
            "src": f"/gallery/{web_path_folder}/{final_filename}",
            "alt": alt_text,
            "date": date_str,
            "width": final_w,
            "height": final_h,
            "category": category,
            "subCategory": ai_data.get("subCategory", "General"),
            "tags": ai_data["tags"],
            "description": ai_data["description"]
        }
        
        gallery_data.append(new_entry)
        os.remove(img_path)
        print(f"[SUCCESS] Moved to {web_path_folder}/{final_filename} as {category}")
        print(f"[AI TAGS] Generated {len(ai_data['tags'])} deep semantic tags.")
        processed_count += 1

    total_images = achievements_count + memories_count + ejected_count
    
    print("\n" + "="*50)
    print("📊 CATEGORIZATION SUMMARY REPORT")
    print("="*50)
    print(f"Total Images Found:  {total_images}")
    print(f"🏆 Achievements:      {achievements_count}")
    print(f"📸 Memories:          {memories_count}")
    print(f"🚫 Ejected/Rejected:  {ejected_count}")
    print("="*50)

    if processed_count > 0:
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(gallery_data, f, indent=2, ensure_ascii=False)
        print(f"🎉 Successfully mapped {processed_count} targeted images to JSON metadata.")
        
    if processed_count == 0 and ejected_count == 0:
        print("No images were successfully processed.")

if __name__ == "__main__":
    print("Initializing Robust Zero-Shot Image Classification Pipeline...")
    process_images()
