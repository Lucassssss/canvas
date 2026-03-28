const DB_NAME = 'joii-image-store'
const DB_VERSION = 1
const STORE_NAME = 'images'

class ImageStore {
  private db: IDBDatabase | null = null
  private dbPromise: Promise<IDBDatabase> | null = null

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db

    if (this.dbPromise) return this.dbPromise

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }
    })

    return this.dbPromise
  }

  async save(id: string, file: File | Blob): Promise<string> {
    const db = await this.getDB()
    const imageData = await this.blobToBase64(file)

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({ id, data: imageData, type: file.type, lastModified: Date.now() })

      request.onsuccess = () => resolve(imageData)
      request.onerror = () => reject(request.error)
    })
  }

  async load(idOrDataUrl: string): Promise<string | null> {
    if (!idOrDataUrl.startsWith('blob:') && !idOrDataUrl.startsWith('data:')) {
      try {
        const db = await this.getDB()
        return new Promise((resolve, reject) => {
          const transaction = db.transaction(STORE_NAME, 'readonly')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.get(idOrDataUrl)

          request.onsuccess = () => {
            const result = request.result
            resolve(result ? result.data : null)
          }
          request.onerror = () => reject(request.error)
        })
      } catch {
        return null
      }
    }
    return idOrDataUrl
  }

  async delete(id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clear(): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAllIds(): Promise<string[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAllKeys()

      request.onsuccess = () => resolve(request.result as string[])
      request.onerror = () => reject(request.error)
    })
  }

  createBlobUrl(dataUrl: string): string {
    const byteCharacters = atob(dataUrl.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: this.getMimeFromDataUrl(dataUrl) })
    return URL.createObjectURL(blob)
  }

  private getMimeFromDataUrl(dataUrl: string): string {
    const match = dataUrl.match(/^data:([^;]+);/)
    return match ? match[1] : 'image/png'
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  isDataUrl(value: string): boolean {
    return value.startsWith('data:')
  }

  isBlobUrl(value: string): boolean {
    return value.startsWith('blob:')
  }
}

export const imageStore = new ImageStore()