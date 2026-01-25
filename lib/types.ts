export enum DeviceStatus {
  Connected = "Connected",
  Ready = "Ready",
  Idle = "Idle",
  Busy = "Busy",
  Error = "Error",
  Offline = "Offline",
}

export enum ConnectionType {
  USB = "USB",
  Network = "Network",
  Bluetooth = "Bluetooth",
}

export interface Device {
  id: string
  name: string
  manufacturer: string
  type: "Printer" | "Scanner" | "3-in-1"
  status: DeviceStatus | "idle" | "ready" | "busy" | "error" | "offline" | "connected"
  connectionType: ConnectionType | "usb" | "network" | "bluetooth"
  ipAddress?: string
  port?: number
  profile?: string
  vendorId?: number
  productId?: number
}

export interface ScannedDocument {
  id: string
  fileName: string
  imageUrl: string
  scannedAt: Date
  processed: boolean
  subscriptionNumber?: string
  archiveNumber?: string
  requestNumber?: string
  folderId?: string
  extractedData?: DocumentExtractedData
  grokAnalysis?: GrokAnalysis
}

export interface DocumentExtractedData {
  text: string
  tables: TableData[]
  fields: Record<string, string>
  subscriptionNumber?: string
  archiveNumber?: string
  requestNumber?: string
  confidence: number
}

export interface TableData {
  rows: string[][]
  headers?: string[]
  position: { x: number; y: number; width: number; height: number }
}

export interface GrokTable {
  rows: string[][]
  headers?: string[]
}

export interface GrokAnalysis {
  cleanText?: string
  summary?: string
  fields?: Record<string, string>
  tables?: GrokTable[]
  meta?: any
}

export interface DocumentFolder {
  id: string
  name: string
  subscriptionNumber: string
  archiveNumber?: string
  requestNumber?: string
  documents: ScannedDocument[]
  createdAt: Date
  updatedAt: Date
}

export interface OCRProcessingOptions {
  language: "fa" | "en" | "ar"
  accuracy: "fast" | "balanced" | "maximum"
  extractTables: boolean
  extractFields: boolean
  detectNumbers: boolean
}
