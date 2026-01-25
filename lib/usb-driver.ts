type DriverEndpoint = {
  endpointNumber: number
  direction: "in" | "out"
  type: "bulk" | "interrupt" | "isochronous"
}

type DriverProfile = {
  vendorId: number
  productId: number
  interfaceNumber: number
  alternateSetting?: number
  endpoints: DriverEndpoint[]
  controlSequences?: Array<{ requestType: USBRequestType; recipient: USBRecipient; request: number; value: number; index: number; data?: Uint8Array }>
  scanStartSequence?: Array<{ out?: Uint8Array; control?: { requestType: USBRequestType; recipient: USBRecipient; request: number; value: number; index: number; data?: Uint8Array } }>
}

type UsbPrepared = {
  deviceId: string
  claimed: boolean
  configurationValue: number
  interfaceNumber: number
  endpoints: DriverEndpoint[]
}

const deviceMap: Map<string, USBDevice> = new Map()
const sessionMap: Map<string, UsbPrepared> = new Map()
const profileMap: Map<string, DriverProfile> = new Map()

async function resolveProfile(vendorId: number, productId: number): Promise<DriverProfile | null> {
  const key = `${vendorId}:${productId}`
  if (profileMap.has(key)) return profileMap.get(key)!
  try {
    const url = `https://api.canscan.dev/usb-profiles/${vendorId}/${productId}.json`
    const res = await fetch(url, { cache: "no-store" })
    if (res.ok) {
      const profile = (await res.json()) as DriverProfile
      profileMap.set(key, profile)
      return profile
    }
  } catch {}
  return null
}

export function registerUsbDevice(deviceId: string, device: USBDevice) {
  deviceMap.set(deviceId, device)
}

export async function prepareDeviceById(deviceId: string): Promise<UsbPrepared> {
  const device = deviceMap.get(deviceId)
  if (!device) throw new Error("USBDevice not registered")
  await device.open()
  if (device.configuration === null) {
    await device.selectConfiguration(1)
  }
  const profile = await resolveProfile(device.vendorId, device.productId)
  let interfaceNumber = 0
  let endpoints: DriverEndpoint[] = []
  if (profile) {
    interfaceNumber = profile.interfaceNumber
    if (typeof profile.alternateSetting === "number") {
      await device.selectAlternateInterface(interfaceNumber, profile.alternateSetting)
    }
    await device.claimInterface(interfaceNumber)
    endpoints = profile.endpoints
    if (profile.controlSequences) {
      for (const seq of profile.controlSequences) {
        await device.controlTransferOut(
          {
            requestType: seq.requestType,
            recipient: seq.recipient,
            request: seq.request,
            value: seq.value,
            index: seq.index,
          },
          seq.data,
        )
      }
    }
  } else {
    const conf = device.configuration!
    const iface = conf.interfaces.find((i) => i.alternates.some((a) => a.interfaceClass === 255)) || conf.interfaces[0]
    interfaceNumber = iface.interfaceNumber
    const alt = iface.alternates[0]
    await device.claimInterface(interfaceNumber)
    endpoints =
      alt.endpoints?.map((ep) => ({
        endpointNumber: ep.endpointNumber,
        direction: ep.direction,
        type: ep.type,
      })) || []
  }
  const prepared: UsbPrepared = {
    deviceId,
    claimed: true,
    configurationValue: device.configuration!.configurationValue,
    interfaceNumber,
    endpoints,
  }
  sessionMap.set(deviceId, prepared)
  return prepared
}

export async function transferBulkOut(deviceId: string, data: Uint8Array): Promise<void> {
  const device = deviceMap.get(deviceId)
  const session = sessionMap.get(deviceId)
  if (!device || !session) throw new Error("Device not prepared")
  const outEp = session.endpoints.find((e) => e.type === "bulk" && e.direction === "out")
  if (!outEp) throw new Error("No bulk out endpoint")
  await device.transferOut(outEp.endpointNumber, data)
}

export async function transferBulkIn(deviceId: string, length: number): Promise<DataView> {
  const device = deviceMap.get(deviceId)
  const session = sessionMap.get(deviceId)
  if (!device || !session) throw new Error("Device not prepared")
  const inEp = session.endpoints.find((e) => e.type === "bulk" && e.direction === "in")
  if (!inEp) throw new Error("No bulk in endpoint")
  const res = await device.transferIn(inEp.endpointNumber, length)
  if (!res.data) throw new Error("No data")
  return res.data
}

export async function sendControl(deviceId: string, setup: USBControlTransferParameters, data?: Uint8Array): Promise<void> {
  const device = deviceMap.get(deviceId)
  if (!device) throw new Error("Device not prepared")
  await device.controlTransferOut(setup, data)
}

export async function startGenericScan(deviceId: string): Promise<string | null> {
  const device = deviceMap.get(deviceId)
  const session = sessionMap.get(deviceId)
  if (!device || !session) throw new Error("Device not prepared")
  const key = `${device.vendorId}:${device.productId}`
  const profile = profileMap.get(key)
  if (profile?.scanStartSequence) {
    for (const step of profile.scanStartSequence) {
      if (step.control) {
        await device.controlTransferOut(step.control, step.control.data)
      }
      if (step.out) {
        await transferBulkOut(session.deviceId, step.out)
      }
    }
  }
  const chunk = await transferBulkIn(session.deviceId, 1024 * 64)
  const bytes = new Uint8Array(chunk.buffer)
  if (bytes && bytes.length > 0) {
    const base64 = btoa(String.fromCharCode(...bytes))
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    if (isJpeg) return `data:image/jpeg;base64,${base64}`
    if (isPng) return `data:image/png;base64,${base64}`
    return `data:application/octet-stream;base64,${base64}`
  }
  return null
}

export async function closeDevice(deviceId: string): Promise<void> {
  const device = deviceMap.get(deviceId)
  if (device) {
    try {
      await device.close()
    } catch {}
  }
  sessionMap.delete(deviceId)
}
