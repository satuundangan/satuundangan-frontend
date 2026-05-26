import re

with open("src/templates/royal-emerald.vue", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix Image Styles to Object-Cover
content = content.replace('<img :src="data.photoCoupleUrl || illustrationUrl" class="w-full h-full object-cover" />', '<img :src="data.photoCoupleUrl || illustrationUrl" class="w-full h-full object-cover" />') # Already correct? 
# I previously ran a fix that might have made it correct. Let's make sure.

# Actually, I'll use regex to be safe
content = re.sub(r'<img :src="data\.photoCoupleUrl \|\| illustrationUrl" class="[^"]*" />', '<img :src="data.photoCoupleUrl || illustrationUrl" class="w-full h-full object-cover" />', content)
content = re.sub(r'<img :src="data\.groomPhotoUrl \|\| illustrationUrl" class="[^"]*" />', '<img :src="data.groomPhotoUrl || illustrationUrl" class="w-full h-full object-cover scale-x-[-1] object-center" />', content)
content = re.sub(r'<img :src="data\.bridePhotoUrl \|\| illustrationUrl" class="[^"]*" />', '<img :src="data.bridePhotoUrl || illustrationUrl" class="w-full h-full object-cover object-center" />', content)

# 2. Re-apply Different Flowers per section (since previous write_file might have flattened them)
floral_v1 = """<!-- Floral Corner Top Left (V1) -->
         <div class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 Q100,0 160,160" stroke="#d4af37" stroke-width="1.5" fill="none" opacity="0.6"/>
               <g transform="translate(30, 20) scale(0.3)">
                  <path d="M50 20 C60 0 90 20 50 50 C90 20 100 60 50 50 C100 60 70 90 50 50 C70 90 30 90 50 50 C30 90 0 60 50 50 C0 60 10 20 50 50 C10 20 40 0 50 20 Z" fill="#d4af37" opacity="0.8"/>
                  <circle cx="50" cy="50" r="8" fill="#ffffff" opacity="0.9"/>
               </g>
               <path d="M30,70 Q45,50 60,75 Q35,95 30,70" fill="#d4af37" opacity="0.5"/>
            </svg>
         </div>
         <!-- Floral Corner Bottom Right (V1) -->
         <div class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 Q100,0 160,160" stroke="#d4af37" stroke-width="1.5" fill="none" opacity="0.6"/>
               <g transform="translate(30, 20) scale(0.3)">
                  <path d="M50 20 C60 0 90 20 50 50 C90 20 100 60 50 50 C100 60 70 90 50 50 C70 90 30 90 50 50 C30 90 0 60 50 50 C0 60 10 20 50 50 C10 20 40 0 50 20 Z" fill="#d4af37" opacity="0.8"/>
                  <circle cx="50" cy="50" r="8" fill="#ffffff" opacity="0.9"/>
               </g>
            </svg>
         </div>"""

floral_v2 = """<!-- Floral Corner Top Left (V2) -->
         <div class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-40 z-0">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 L80,0 C80,40 40,80 0,80 Z" stroke="#d4af37" stroke-width="2" fill="#d4af37" fill-opacity="0.1"/>
               <path d="M0,0 C60,20 80,60 0,120" stroke="#d4af37" stroke-width="1" fill="none" stroke-dasharray="4 4"/>
               <g transform="translate(10, 10) scale(0.5)">
                  <path d="M50 100 C50 50 10 50 10 50 C10 50 50 50 50 0 C50 50 90 50 90 50 C90 50 50 50 50 100 Z" fill="#ffffff" opacity="0.7"/>    
               </g>
            </svg>
         </div>
         <!-- Floral Corner Bottom Right (V2) -->
         <div class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-40 z-0 transform rotate-180">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 L80,0 C80,40 40,80 0,80 Z" stroke="#d4af37" stroke-width="2" fill="#d4af37" fill-opacity="0.1"/>
               <g transform="translate(10, 10) scale(0.5)">
                  <path d="M50 100 C50 50 10 50 10 50 C10 50 50 50 50 0 C50 50 90 50 90 50 C90 50 50 50 50 100 Z" fill="#ffffff" opacity="0.7"/>    
               </g>
            </svg>
         </div>"""

floral_v3 = """<!-- Floral Corner Top Left (V3) -->
         <div class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 Q80,20 140,140" stroke="#d4af37" stroke-width="2" fill="none"/>
               <circle cx="80" cy="40" r="3" fill="#ffffff"/>
               <circle cx="120" cy="90" r="4" fill="#d4af37"/>
               <circle cx="40" cy="80" r="2" fill="#ffffff"/>
            </svg>
         </div>
         <!-- Floral Corner Bottom Right (V3) -->
         <div class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-50 z-0 transform rotate-180">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 Q80,20 140,140" stroke="#d4af37" stroke-width="2" fill="none"/>
               <circle cx="80" cy="40" r="3" fill="#ffffff"/>
               <circle cx="120" cy="90" r="4" fill="#d4af37"/>
            </svg>
         </div>"""

floral_v4 = """<!-- Floral Corner Top Left (V4) -->
         <div class="absolute top-0 left-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-60 z-0">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 L0,100 Q50,100 100,0 Z" fill="#d4af37" fill-opacity="0.05" stroke="#d4af37" stroke-width="1"/>
               <path d="M20,20 L20,80 Q50,80 80,20 Z" fill="#d4af37" fill-opacity="0.1" stroke="#ffffff" stroke-width="0.5"/>
            </svg>
         </div>
         <!-- Floral Corner Bottom Right (V4) -->
         <div class="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none opacity-60 z-0 transform rotate-180">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0,0 L0,100 Q50,100 100,0 Z" fill="#d4af37" fill-opacity="0.05" stroke="#d4af37" stroke-width="1"/>
               <path d="M20,20 L20,80 Q50,80 80,20 Z" fill="#d4af37" fill-opacity="0.1" stroke="#ffffff" stroke-width="0.5"/>
            </svg>
         </div>"""

variations = [floral_v1, floral_v2, floral_v3, floral_v4]
floral_pattern = r'<!-- Floral Corner Top Left.*?</div>\s*<!-- Floral Corner Bottom Right.*?</div>'

counter = [0]
def replacer(match):
    var = variations[counter[0] % len(variations)]
    counter[0] += 1
    return var

content = re.sub(floral_pattern, replacer, content, flags=re.DOTALL)

with open("src/templates/royal-emerald.vue", "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")
