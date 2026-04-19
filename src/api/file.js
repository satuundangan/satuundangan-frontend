import { BASE_URL } from "./client"

const IMAGE_UPLOAD_TARGET_BYTES = 900 * 1024
const IMAGE_UPLOAD_MAX_DIMENSION = 1600
const IMAGE_UPLOAD_QUALITY = 0.8

const isCompressibleImage = (file) => (
  file.type.startsWith('image/') &&
  !['image/svg+xml', 'image/gif'].includes(file.type)
)

const loadImage = (file) => new Promise((resolve, reject) => {
  const image = new Image()
  const objectUrl = URL.createObjectURL(file)

  image.onload = () => {
    URL.revokeObjectURL(objectUrl)
    resolve(image)
  }
  image.onerror = () => {
    URL.revokeObjectURL(objectUrl)
    reject(new Error('Unable to read image file'))
  }
  image.src = objectUrl
})

const canvasToBlob = (canvas, type, quality) => new Promise((resolve) => {
  canvas.toBlob(resolve, type, quality)
})

const getCompressedFileName = (fileName) => {
  const dotIndex = fileName.lastIndexOf('.')
  const baseName = dotIndex > -1 ? fileName.slice(0, dotIndex) : fileName
  return `${baseName}.webp`
}

const compressImageForUpload = async (file) => {
  if (!isCompressibleImage(file) || file.size <= IMAGE_UPLOAD_TARGET_BYTES) {
    return file
  }

  const image = await loadImage(file)
  const scale = Math.min(
    1,
    IMAGE_UPLOAD_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
  )
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height
  if (!context) {
    return file
  }
  context.drawImage(image, 0, 0, width, height)

  let quality = IMAGE_UPLOAD_QUALITY
  let blob = await canvasToBlob(canvas, 'image/webp', quality)

  while (blob && blob.size > IMAGE_UPLOAD_TARGET_BYTES && quality > 0.52) {
    quality -= 0.08
    blob = await canvasToBlob(canvas, 'image/webp', quality)
  }

  if (!blob || blob.size >= file.size) {
    return file
  }

  return new File([blob], getCompressedFileName(file.name), {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}

export const uploadFileApi = async (file) => {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error('Invalid file object')
    }

    const uploadFile = await compressImageForUpload(file).catch((error) => {
      console.warn('Image compression skipped:', error.message)
      return file
    })
    const formData = new FormData()
    formData.append('file', uploadFile, uploadFile.name)

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
      fileSize: file?.size,
      error: error.message,
    })
    throw error
  }
}
