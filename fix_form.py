import re

with open("src/views/CreateForm.vue", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Ensure templateAspectRatios is present
ratio_map = """
const templateAspectRatios = {
  "royal-emerald": { bride: 3/4, groom: 3/4, couple: 16/10 },
  "dark-elegant": { bride: 3/4, groom: 3/4, couple: 1 },
  "modern-noir": { bride: 1, groom: 1, couple: 16/9 },
  "zen-tranquility": { bride: 3/4, groom: 3/4, couple: 4/3 },
  "default": { bride: 3/4, groom: 3/4, couple: 1 }
};

const getAspectRatio = (field) => {
  const slug = selectedTemplateRef.value.slug || "default";
  const map = templateAspectRatios[slug] || templateAspectRatios["default"];
  return map[field] || templateAspectRatios["default"][field];
};
"""

if "templateAspectRatios" not in content:
    content = content.replace("const cropper = ref({", ratio_map + "\nconst cropper = ref({")

# 2. Update handles to use getAspectRatio
content = content.replace("aspectRatio: 3/4, targetField: 'bride'", "aspectRatio: getAspectRatio('bride'), targetField: 'bride'")
content = content.replace("aspectRatio: 3/4, targetField: 'groom'", "aspectRatio: getAspectRatio('groom'), targetField: 'groom'")
content = content.replace("aspectRatio: 1, targetField: 'couple'", "aspectRatio: getAspectRatio('couple'), targetField: 'couple'")

with open("src/views/CreateForm.vue", "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")
