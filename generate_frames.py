from PIL import Image, ImageDraw, ImageFont
import os

# Ensure directory exists
output_dir = "public/sequence"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Settings
width, height = 1920, 1080
bg_color = (18, 18, 18) # #121212
text_color = (255, 255, 255)
num_frames = 90

for i in range(num_frames):
    img = Image.new('RGB', (width, height), bg_color)
    d = ImageDraw.Draw(img)
    
    # Draw simple expansive circle based on frame
    radius = (i + 1) * 10
    d.ellipse((width//2 - radius, height//2 - radius, width//2 + radius, height//2 + radius), outline="cyan", width=5)
    
    # Draw Text
    text = f"Frame {i}"
    # d.text((width//2, height//2), text, fill=text_color) # simplistic positioning
    
    filename = f"frame_{i:02d}_delay-0.067s.webp"
    img.save(os.path.join(output_dir, filename), "WEBP")

print(f"Generated {num_frames} frames in {output_dir}")
