const isBrowser = typeof window !== "undefined"

export class StorageManager {
  private dbName = "CanScanDB"
  private dbVersion = 1
  private db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    if (!isBrowser) {
      console.log("[v0] Storage manager skipped - running on server")
      return
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        console.log("[v0] Storage initialized successfully")
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains("documents")) {
          db.createObjectStore("documents", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("folders")) {
          db.createObjectStore("folders", { keyPath: "id" })
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" })
        }
        if (!db.objectStoreNames.contains("logs")) {
          const logsStore = db.createObjectStore("logs", { keyPath: "id", autoIncrement: true })
          logsStore.createIndex("timestamp", "timestamp", { unique: false })
          logsStore.createIndex("level", "level", { unique: false })
        }
      }
    })
  }

  async saveDocument(document: any): Promise<void> {
    if (!isBrowser) return
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["documents"], "readwrite")
      const store = transaction.objectStore("documents")
      const request = store.put(document)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async saveFolder(folder: any): Promise<void> {
    if (!isBrowser) return
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["folders"], "readwrite")
      const store = transaction.objectStore("folders")
      const request = store.put(folder)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async loadDocuments(): Promise<any[]> {
    if (!isBrowser) return []
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["documents"], "readonly")
      const store = transaction.objectStore("documents")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteDocument(id: string): Promise<void> {
    if (!isBrowser) return
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["documents"], "readwrite")
      const store = transaction.objectStore("documents")
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async loadFolders(): Promise<any[]> {
    if (!isBrowser) return []
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["folders"], "readonly")
      const store = transaction.objectStore("folders")
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveSetting(key: string, value: any): Promise<void> {
    if (!isBrowser) return
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["settings"], "readwrite")
      const store = transaction.objectStore("settings")
      const request = store.put({ key, value })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async loadSetting(key: string): Promise<any> {
    if (!isBrowser) return undefined
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["settings"], "readonly")
      const store = transaction.objectStore("settings")
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result?.value)
      request.onerror = () => reject(request.error)
    })
  }

  async saveLog(level: "info" | "warning" | "error", message: string, details?: any): Promise<void> {
    if (!isBrowser) return
    if (!this.db) await this.initialize()

    const log = {
      level,
      message,
      details,
      timestamp: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["logs"], "readwrite")
      const store = transaction.objectStore("logs")
      const request = store.add(log)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getLogs(limit = 100): Promise<any[]> {
    if (!isBrowser) return []
    if (!this.db) await this.initialize()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["logs"], "readonly")
      const store = transaction.objectStore("logs")
      const index = store.index("timestamp")
      const request = index.openCursor(null, "prev")

      const logs: any[] = []
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor && logs.length < limit) {
          logs.push(cursor.value)
          cursor.continue()
        } else {
          resolve(logs)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async clearAllData(): Promise<void> {
    if (!isBrowser) return
    if (!this.db) await this.initialize()

    const stores = ["documents", "folders", "logs"]

    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], "readwrite")
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }
  }
}

export const storageManager = new StorageManager()
