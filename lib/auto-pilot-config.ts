export interface AutoPilotConfig {
  // Scanning settings
  scanResolution: 150 | 300 | 600 | 1200
  scanColorMode: "color" | "grayscale" | "blackwhite"
  scanFormat: "jpg" | "png" | "pdf"

  // OCR settings
  ocrLanguage: "fa" | "en" | "ar"
  ocrAccuracy: "fast" | "balanced" | "maximum"
  extractTables: boolean
  extractFields: boolean
  detectNumbers: boolean

  // Template matching
  templateMatchingEnabled: boolean
  matchingThreshold: number // 0-1

  // Auto Pilot behavior
  autoStart: boolean
  autoPauseBetweenDocuments: number // seconds
  maxDocumentsPerSession: number
  autoExportToExcel: boolean
  autoBackup: boolean

  // File organization
  folderNamingPattern: "subscription" | "date" | "custom"
  customFolderPrefix: string

  // Notifications
  notifyOnComplete: boolean
  notifyOnError: boolean
  soundEnabled: boolean
}

export const defaultConfig: AutoPilotConfig = {
  scanResolution: 300,
  scanColorMode: "color",
  scanFormat: "jpg",

  ocrLanguage: "fa",
  ocrAccuracy: "maximum",
  extractTables: true,
  extractFields: true,
  detectNumbers: true,

  templateMatchingEnabled: true,
  matchingThreshold: 0.85,

  autoStart: false,
  autoPauseBetweenDocuments: 2,
  maxDocumentsPerSession: 100,
  autoExportToExcel: true,
  autoBackup: true,

  folderNamingPattern: "subscription",
  customFolderPrefix: "پوشه_",

  notifyOnComplete: true,
  notifyOnError: true,
  soundEnabled: true,
}

export class ConfigManager {
  private config: AutoPilotConfig = { ...defaultConfig }

  getConfig(): AutoPilotConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<AutoPilotConfig>): void {
    this.config = { ...this.config, ...updates }
    console.log("[v0] Config updated:", updates)
  }

  resetToDefaults(): void {
    this.config = { ...defaultConfig }
    console.log("[v0] Config reset to defaults")
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  importConfig(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString)
      this.config = { ...defaultConfig, ...imported }
      console.log("[v0] Config imported successfully")
      return true
    } catch (error) {
      console.error("[v0] Failed to import config:", error)
      return false
    }
  }
}

export const configManager = new ConfigManager()
