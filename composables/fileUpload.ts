import { FullFile } from "~/composables/types"

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

async function oneInputToFileObject(file: File) {
  const base64 = await fileToBase64(file)
  const link = URL.createObjectURL(file)
  return { base64, name: file.name, mimeType: file.type, link }
}

export async function inputToFileObjects(
  fileInput: HTMLInputElement
): Promise<FullFile[]> {
  const files = fileInput.files
  if (!files || !files.length) return []
  const nbFiles = files.length
  const promises = []
  for (let i = 0; i < nbFiles; i++) {
    promises.push(oneInputToFileObject(files[i]))
  }
  const fileObjects = await Promise.all(promises)
  fileInput.files = null
  return fileObjects
}

export async function inputToFileObject(
  fileInput: HTMLInputElement
): Promise<FullFile | undefined> {
  const files = fileInput.files
  if (!files || !files.length) return
  const nbFiles = files.length
  if (nbFiles > 1) throw "several files were sent. Only one expected"
  const fileObject = await oneInputToFileObject(files[0])
  fileInput.files = null
  return fileObject
}
