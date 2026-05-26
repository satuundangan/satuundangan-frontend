import re

with open("src/templates/royal-emerald.vue", "r", encoding="utf-8") as f:
    content = f.read()

# Fix non-existent audio path fallback
content = content.replace("/audio/romantic_emerald.mp3", "/audio/romantic_music1.mp3")

with open("src/templates/royal-emerald.vue", "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")

