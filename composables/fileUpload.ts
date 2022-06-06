import { FullFile } from "~/composables/types"

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

export async function inputToFileObject(
  fileInput: HTMLInputElement
): Promise<FullFile | undefined> {
  const nbFiles = fileInput.files!.length
  if (!nbFiles) return
  if (nbFiles > 1) return /* TODO */
  const file = fileInput.files![0]
  const base64 = await fileToBase64(file)
  fileInput.files = null
  return { base64, name: file.name, mimeType: file.type }
}
