from PIL import Image
import os

# Input and output directories
input_dir = r'C:\Users\82102\.openclaw\workspace\invoice-generator\screenshots'
output_dir = r'C:\Users\82102\.openclaw\workspace\invoice-generator\screenshots-resized'

# Create output directory
os.makedirs(output_dir, exist_ok=True)

# Target size
target_size = (1600, 900)

# List of screenshots to resize
screenshots = [
    '1-dashboard.jpg',
    '2-settings-complete.jpg',
    '3-invoices-list.jpg',
    '4-order-picker-modal.jpg',
    '5-pdf-korean.jpg'
]

print("Resizing screenshots to 1600x900...")

for filename in screenshots:
    input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, filename)
    
    try:
        # Open image
        img = Image.open(input_path)
        print(f"Original {filename}: {img.size[0]}x{img.size[1]}")
        
        # Resize with high-quality resampling
        img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
        
        # Save with high quality
        img_resized.save(output_path, 'JPEG', quality=95)
        print(f"✅ Resized {filename} to 1600x900")
        
    except Exception as e:
        print(f"❌ Error resizing {filename}: {e}")

print("\n✅ All screenshots resized!")
print(f"📂 Output folder: {output_dir}")
