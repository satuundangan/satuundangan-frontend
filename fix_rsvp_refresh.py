import re

with open("src/templates/royal-emerald.vue", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Improve loadWishes to be more robust and log errors
new_load_wishes = """async function loadWishes() {
  const invId = data.value.id
  if (invId && invId !== "live-preview" && invId !== 0) {
    try {
      const res = await getGuestMessagesByInvitationId(invId)
      guestMessages.value = Array.isArray(res) ? res : (res.data || [])
    } catch (err) {
      console.error("Failed to load wishes:", err)
    }
  } else {
    // Mock data for preview mode
    guestMessages.value = [
      { guestName: "Fauzan & Keluarga", message: "Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair.", rsvpStatus: "hadir", createdAt: new Date() },
      { guestName: "Siti Aminah", message: "MasyaAllah cantik banget!", rsvpStatus: "hadir", createdAt: new Date() }
    ]
  }
}"""

content = re.sub(r"async function loadWishes\(\) \{.*?\}", new_load_wishes, content, flags=re.DOTALL)

# 2. Improve submitRSVP to await loadWishes and handle optimistic update
new_submit_rsvp = """async function submitRSVP() {
  if (!rsvp.value.name?.trim()) { toast.error("Isi nama Anda."); return }
  try {
    const payload = { 
      invitationId: data.value.id, 
      guestName: rsvp.value.name, 
      message: rsvp.value.message, 
      rsvpStatus: rsvp.value.attendance, 
      totalGuests: rsvp.value.attendance === "hadir" ? Number(rsvp.value.totalGuests) : 0 
    }
    await createGuestMessage(payload)
    toast.success("Konfirmasi terkirim!")
    
    // Reset form
    const submittedName = rsvp.value.name
    const submittedMsg = rsvp.value.message
    rsvp.value = { name: "", attendance: "hadir", totalGuests: 1, message: "" }
    
    // Force refresh
    await loadWishes()
  } catch (err) { 
    toast.error("Gagal mengirim RSVP.") 
  }
}"""

content = re.sub(r"async function submitRSVP\(\) \{.*?\}", new_submit_rsvp, content, flags=re.DOTALL)

with open("src/templates/royal-emerald.vue", "w", encoding="utf-8") as f:
    f.write(content)
print("SUCCESS")

