import { BASE_URL } from "./client"

export const uploadFileApi = async (file) => {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object')
    }

    const formData = new FormData()
    formData.append('file', file, file.name)

    const response = await fetch(`${BASE_URL}/upload`,{
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} - ${errorText}`)
    }

    return await response.json().catch(() => ({})) // Handle empty response
  } catch (error) {
    console.error('Upload error:', {
      fileName: file?.name,
      error: error.message,
    })
    throw error
  }
}
