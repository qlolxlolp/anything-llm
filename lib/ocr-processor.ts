// Persian OCR and Document Processing Engine with Real Tesseract.js
const isBrowser = typeof window !== "undefined"

export class OCRProcessor {
  private documents: any[] = []
  private folders: Map<string, any> = new Map()
  private isProcessing = false
  private initialized = false
  private tesseractWorker: any = null

  async initialize(): Promise<void> {
    if (!isBrowser) return
    if (this.initialized) return

    try {
      const Tesseract = (await import("tesseract.js")).default
      this.tesseractWorker = await Tesseract.createWorker("fas+eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            console.log(`[v0] OCR Progress: ${Math.round(m.progress * 100)}%`)
          }
        },
      })

      const { storageManager } = await import("./storage-manager")
      await storageManager.initialize()

      const savedDocuments = await storageManager.loadDocuments()
      const savedFolders = await storageManager.loadFolders()

      this.documents = savedDocuments
      savedFolders.forEach((folder) => {
        const canonical =
          folder.subscriptionNumber || folder.requestNumber || folder.archiveNumber || folder.name || "unknown"
        if (folder.name !== canonical) {
          folder.name = canonical
        }
        this.folders.set(folder.id, folder)
      })

      const { aiAgent } = await import("./ai-agent-core")
      aiAgent.on("stateChange", ({ newState }) => {
        if (newState === "self-healing") {
          this.performSelfDiagnostics()
        }
      })

      this.initialized = true
      console.log(
        "[v0] OCR Processor initialized with Tesseract.js",
        this.documents.length,
        "documents and",
        this.folders.size,
        "folders",
      )
      await storageManager.saveLog("info", "OCR Processor initialized with Tesseract.js", {
        documentCount: this.documents.length,
        folderCount: this.folders.size,
      })
    } catch (error) {
      console.error("[v0] Failed to initialize OCR Processor:", error)
      if (isBrowser) {
        const { aiAgent } = await import("./ai-agent-core")
        const { storageManager } = await import("./storage-manager")
        await aiAgent.addTask({
          type: "error-recovery",
          priority: "high",
          description: `خطا در راه‌اندازی OCR: ${error}`,
          maxAttempts: 3,
        })
        await storageManager.saveLog("error", "Failed to initialize OCR Processor", { error })
      }
    }
  }

  private async performSelfDiagnostics(): Promise<void> {
    if (!isBrowser) return
    console.log("[v0] Performing OCR self-diagnostics...")

    const corruptedDocs = this.documents.filter((doc) => !doc.id || !doc.fileName)
    if (corruptedDocs.length > 0) {
      console.log("[v0] Found corrupted documents, cleaning up...")
      this.documents = this.documents.filter((doc) => doc.id && doc.fileName)
    }

    const orphanedFolders: string[] = []
    this.folders.forEach((folder, id) => {
      if (!folder.documents || folder.documents.length === 0) {
        orphanedFolders.push(id)
      }
    })

    orphanedFolders.forEach((id) => {
      const folder = this.folders.get(id)
      if (folder && Date.now() - new Date(folder.createdAt).getTime() > 24 * 60 * 60 * 1000) {
        this.folders.delete(id)
      }
    })

    const { storageManager } = await import("./storage-manager")
    await storageManager.saveLog("info", "Self-diagnostics completed", {
      corruptedDocsRemoved: corruptedDocs.length,
      orphanedFoldersChecked: orphanedFolders.length,
    })
  }

  async processDocument(
    imageUrl: string,
    fileName: string,
    options: any = {
      language: "fa",
      accuracy: "maximum",
      extractTables: true,
      extractFields: true,
      detectNumbers: true,
    },
  ): Promise<any> {
    if (!isBrowser) throw new Error("OCR only works in browser")

    if (this.isProcessing) {
      const { aiAgent } = await import("./ai-agent-core")
      await aiAgent.addTask({
        type: "queue-management",
        priority: "low",
        description: `سند در صف: ${fileName}`,
        maxAttempts: 1,
      })
      throw new Error("پردازش دیگری در حال انجام است")
    }

    this.isProcessing = true
    console.log("[v0] Starting OCR processing for:", fileName)

    const { storageManager } = await import("./storage-manager")
    const { configManager } = await import("./auto-pilot-config")

    await storageManager.saveLog("info", "Starting OCR processing", { fileName, options })

    try {
      const config = configManager.getConfig()
      const mergedOptions = {
        language: config.ocrLanguage,
        accuracy: config.ocrAccuracy,
        extractTables: config.extractTables,
        extractFields: config.extractFields,
        detectNumbers: config.detectNumbers,
        ...options,
      }

      const extractedData = await this.performOCR(imageUrl, mergedOptions)

      const { subscriptionNumber, archiveNumber, requestNumber } = this.extractNumbers(extractedData.text)

      console.log("[v0] Extracted numbers:", { subscriptionNumber, archiveNumber, requestNumber })
      await storageManager.saveLog("info", "Extracted numbers", { subscriptionNumber, archiveNumber, requestNumber })

      const document: any = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fileName,
        imageUrl,
        scannedAt: new Date(),
        processed: true,
        subscriptionNumber,
        archiveNumber,
        requestNumber,
        extractedData,
      }

      await this.organizeDocument(document)

      this.documents.push(document)

      await storageManager.saveDocument(document)
      await storageManager.saveLog("info", "Document processed and saved", { documentId: document.id, fileName })

      return document
    } catch (error: any) {
      const { aiAgent } = await import("./ai-agent-core")
      await aiAgent.addTask({
        type: "ocr-error",
        priority: "high",
        description: `خطا در پردازش سند ${fileName}: ${error.message}`,
        maxAttempts: 3,
      })
      throw error
    } finally {
      this.isProcessing = false
    }
  }

  async reprocessExistingDocument(document: any): Promise<any> {
    if (!isBrowser) throw new Error("OCR only works in browser")
    if (!document || !document.imageUrl) throw new Error("Invalid document for reprocessing")

    const { storageManager } = await import("./storage-manager")
    await storageManager.saveLog("info", "Reprocessing document", { documentId: document.id, fileName: document.fileName })

    const extractedData = await this.performOCR(document.imageUrl, {
      accuracy: "maximum",
      extractTables: true,
      extractFields: true,
      detectNumbers: true,
      language: "fa",
    })

    const { subscriptionNumber, archiveNumber, requestNumber } = this.extractNumbers(extractedData.text)

    document.extractedData = extractedData
    document.subscriptionNumber = subscriptionNumber
    document.archiveNumber = archiveNumber
    document.requestNumber = requestNumber
    document.processed = true

    if (document.folderId) {
      const existingFolder = this.folders.get(document.folderId)
      if (existingFolder) {
        existingFolder.documents = existingFolder.documents.filter((d: any) => d.id !== document.id)
        existingFolder.updatedAt = new Date()
      }
    }

    await this.organizeDocument(document)

    const idx = this.documents.findIndex((d) => d.id === document.id)
    if (idx !== -1) {
      this.documents[idx] = document
    } else {
      this.documents.push(document)
    }

    await storageManager.saveDocument(document)
    await storageManager.saveLog("info", "Document reprocessed and saved", { documentId: document.id })

    return document
  }
  private async performOCR(imageUrl: string, options: any): Promise<any> {
    if (!this.tesseractWorker) {
      throw new Error("Tesseract worker not initialized")
    }

    console.log("[v0] Starting real OCR recognition with accuracy mode:", options.accuracy)

    // Set PSM (Page Segmentation Mode) based on accuracy
    const psmMode = options.accuracy === "maximum" ? 3 : options.accuracy === "balanced" ? 6 : 13

    const { data } = await this.tesseractWorker.recognize(imageUrl, {
      tessedit_pageseg_mode: psmMode,
      preserve_interword_spaces: "1",
    })

    const extractedText = data.text
    const confidence = data.confidence / 100

    console.log("[v0] OCR completed with confidence:", confidence)

    const tables = options.extractTables ? this.extractTables(extractedText) : []
    const fields = options.extractFields ? this.extractFields(extractedText) : {}

    return {
      text: extractedText,
      tables,
      fields,
      confidence,
    }
  }

  private extractNumbers(text: string): { subscriptionNumber?: string; archiveNumber?: string; requestNumber?: string } {
    const patterns = {
      subscription: /شماره\s*اشتراک[\s:：]*([۰-۹0-9]+)/gi,
      archive: /شماره\s*بایگانی[\s:：]*([۰-۹0-9]+)/gi,
      request: /شماره\s*درخواست[\s:：]*([۰-۹0-9]+)/gi,
    }

    let subscriptionNumber: string | undefined
    let archiveNumber: string | undefined
    let requestNumber: string | undefined

    const subMatch = patterns.subscription.exec(text)
    if (subMatch) {
      subscriptionNumber = this.normalizeNumber(subMatch[1])
    }

    const archMatch = patterns.archive.exec(text)
    if (archMatch) {
      archiveNumber = this.normalizeNumber(archMatch[1])
    }

    const reqMatch = patterns.request.exec(text)
    if (reqMatch) {
      requestNumber = this.normalizeNumber(reqMatch[1])
    }

    return { subscriptionNumber, archiveNumber, requestNumber }
  }

  private normalizeNumber(num: string): string {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
    const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    let result = num
    persianDigits.forEach((persian, index) => {
      result = result.replace(new RegExp(persian, "g"), englishDigits[index])
    })

    return result.trim()
  }

  private extractTables(text: string): any[] {
    const tables: any[] = []
    const lines = text.split("\n")

    let inTable = false
    let currentTable: string[][] = []

    for (const line of lines) {
      if (line.includes("|")) {
        const cells = line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0)

        if (cells.length > 0) {
          currentTable.push(cells)
          inTable = true
        }
      } else if (inTable && currentTable.length > 0) {
        tables.push({
          rows: currentTable.slice(1),
          headers: currentTable[0],
          position: { x: 0, y: 0, width: 100, height: 100 },
        })
        currentTable = []
        inTable = false
      }
    }

    if (currentTable.length > 0) {
      tables.push({
        rows: currentTable.slice(1),
        headers: currentTable[0],
        position: { x: 0, y: 0, width: 100, height: 100 },
      })
    }

    return tables
  }

  private extractFields(text: string): Record<string, string> {
    const fields: Record<string, string> = {}
    const fieldPatterns = [
      { key: "buyerName", pattern: /نام[\s:：]*([^\n]+)/i },
      { key: "nationalId", pattern: /کد\s*ملی[\s:：]*([۰-۹0-9]+)/i },
      { key: "address", pattern: /آدرس[\s:：]*([^\n]+)/i },
      { key: "companyName", pattern: /نام[\s:：]*([^\n]+شرکت[^\n]*)/i },
      { key: "totalAmount", pattern: /جمع\s*کل[\s:：]*([۰-۹0-9]+)/i },
    ]

    for (const { key, pattern } of fieldPatterns) {
      const match = pattern.exec(text)
      if (match) {
        fields[key] = match[1].trim()
      }
    }

    return fields
  }

  private async organizeDocument(document: any): Promise<void> {
    const targetNumber = document.subscriptionNumber || document.archiveNumber || document.requestNumber

    if (!targetNumber) {
      console.log("[v0] No subscription/archive number found, creating new folder")
      await this.createNewFolder(document)
      return
    }

    console.log("[v0] Searching for existing folder with number:", targetNumber)

    const matchingFolder = await this.findMatchingFolder(targetNumber)

    if (matchingFolder) {
      console.log("[v0] Found matching folder:", matchingFolder.name)
      matchingFolder.documents.push(document)
      matchingFolder.updatedAt = new Date()
      document.folderId = matchingFolder.id
    } else {
      console.log("[v0] No matching folder found, creating new folder")
      await this.createNewFolder(document, targetNumber)
    }
  }

  private async findMatchingFolder(targetNumber: string): Promise<any | null> {
    for (const [, folder] of this.folders) {
      if (
        folder.subscriptionNumber === targetNumber ||
        folder.archiveNumber === targetNumber ||
        folder.requestNumber === targetNumber
      ) {
        const canonical = folder.subscriptionNumber || folder.requestNumber || folder.archiveNumber
        if (canonical && folder.name !== canonical) {
          folder.name = canonical
          const { storageManager } = await import("./storage-manager")
          await storageManager.saveFolder(folder)
        }
        return folder
      }
    }

    for (let i = this.documents.length - 1; i >= 0; i--) {
      const doc = this.documents[i]
      if (
        doc.subscriptionNumber === targetNumber ||
        doc.archiveNumber === targetNumber ||
        doc.requestNumber === targetNumber
      ) {
        if (doc.folderId) {
          const f = this.folders.get(doc.folderId) || null
          if (f) {
            const canonical = f.subscriptionNumber || f.requestNumber || f.archiveNumber
            if (canonical && f.name !== canonical) {
              f.name = canonical
              const { storageManager } = await import("./storage-manager")
              await storageManager.saveFolder(f)
            }
          }
          return f
        }
      }
    }

    return null
  }

  private async createNewFolder(document: any, subscriptionNumber?: string): Promise<void> {
    const folderNumber =
      subscriptionNumber || document.subscriptionNumber || document.requestNumber || document.archiveNumber || "unknown"

    const { configManager } = await import("./auto-pilot-config")
    const config = configManager.getConfig()
    const folderName = folderNumber

    const folder: any = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: folderName,
      subscriptionNumber: folderNumber,
      archiveNumber: document.archiveNumber,
      requestNumber: document.requestNumber,
      documents: [document],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    document.folderId = folder.id
    this.folders.set(folder.id, folder)

    const { storageManager } = await import("./storage-manager")
    await storageManager.saveFolder(folder)
    await storageManager.saveLog("info", "Created new folder", { folderId: folder.id, folderName })

    console.log("[v0] Created new folder:", folder.name)
  }

  getFolders(): any[] {
    return Array.from(this.folders.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }

  getFolder(folderId: string): any | undefined {
    return this.folders.get(folderId)
  }

  getDocuments(): any[] {
    return [...this.documents].sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
  }

  searchDocuments(query: string): any[] {
    const normalizedQuery = query.toLowerCase()
    return this.documents.filter((doc) => {
      return (
        doc.fileName.toLowerCase().includes(normalizedQuery) ||
        doc.subscriptionNumber?.includes(normalizedQuery) ||
        doc.archiveNumber?.includes(normalizedQuery) ||
        doc.extractedData?.text.toLowerCase().includes(normalizedQuery) ||
        (doc.grokAnalysis?.cleanText && String(doc.grokAnalysis.cleanText).toLowerCase().includes(normalizedQuery)) ||
        (doc.grokAnalysis?.summary && String(doc.grokAnalysis.summary).toLowerCase().includes(normalizedQuery)) ||
        (doc.grokAnalysis?.fields &&
          Object.values(doc.grokAnalysis.fields)
            .map((v: any) => String(v).toLowerCase())
            .some((v: string) => v.includes(normalizedQuery)))
      )
    })
  }

  getStatus(): { isProcessing: boolean; documentsCount: number; foldersCount: number } {
    return {
      isProcessing: this.isProcessing,
      documentsCount: this.documents.length,
      foldersCount: this.folders.size,
    }
  }

  async cleanup(): Promise<void> {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate()
      this.tesseractWorker = null
      console.log("[v0] Tesseract worker terminated")
    }
  }

  async attachGrokAnalysis(documentId: string, grok: any): Promise<void> {
    if (!isBrowser) return
    const idx = this.documents.findIndex((d) => d.id === documentId)
    if (idx === -1) return
    const doc = this.documents[idx]
    doc.grokAnalysis = grok

    if (doc.folderId) {
      const folder = this.folders.get(doc.folderId)
      if (folder) {
        const didx = folder.documents.findIndex((d: any) => d.id === documentId)
        if (didx !== -1) {
          folder.documents[didx] = doc
          folder.updatedAt = new Date()
        }
      }
    }

    const { storageManager } = await import("./storage-manager")
    await storageManager.saveDocument(doc)
    await storageManager.saveLog("info", "Grok analysis attached to document", { documentId })
  }

  async updateDocumentNumbers(
    documentId: string,
    nums: { subscriptionNumber?: string; archiveNumber?: string; requestNumber?: string },
  ): Promise<void> {
    if (!isBrowser) return
    const idx = this.documents.findIndex((d) => d.id === documentId)
    if (idx === -1) return
    const doc = this.documents[idx]
    doc.subscriptionNumber = nums.subscriptionNumber || doc.subscriptionNumber
    doc.archiveNumber = nums.archiveNumber || doc.archiveNumber
    doc.requestNumber = nums.requestNumber || doc.requestNumber
    if (doc.folderId) {
      const folder = this.folders.get(doc.folderId)
      if (folder) {
        folder.documents = folder.documents.filter((d: any) => d.id !== doc.id)
        folder.updatedAt = new Date()
      }
    }
    await this.organizeDocument(doc)
    const { storageManager } = await import("./storage-manager")
    await storageManager.saveDocument(doc)
    await storageManager.saveLog("info", "Document numbers updated", {
      documentId,
      subscriptionNumber: doc.subscriptionNumber,
      archiveNumber: doc.archiveNumber,
      requestNumber: doc.requestNumber,
    })
  }

  async deleteDocumentById(documentId: string): Promise<void> {
    if (!isBrowser) return
    const idx = this.documents.findIndex((d) => d.id === documentId)
    if (idx === -1) return
    const doc = this.documents[idx]
    this.documents.splice(idx, 1)
    if (doc.folderId) {
      const folder = this.folders.get(doc.folderId)
      if (folder) {
        folder.documents = folder.documents.filter((d: any) => d.id !== doc.id)
        folder.updatedAt = new Date()
        if (folder.documents.length === 0) {
          this.folders.delete(folder.id)
        }
      }
    }
    const { storageManager } = await import("./storage-manager")
    await storageManager.deleteDocument(documentId)
    await storageManager.saveLog("info", "Document deleted", { documentId })
  }

  async replaceImageAndReprocess(documentId: string, imageUrl: string): Promise<any> {
    if (!isBrowser) throw new Error("OCR only works in browser")
    const idx = this.documents.findIndex((d) => d.id === documentId)
    if (idx === -1) throw new Error("Document not found")
    const doc = this.documents[idx]
    doc.imageUrl = imageUrl
    return this.reprocessExistingDocument(doc)
  }
}

export const ocrProcessor = new OCRProcessor()
