const isBrowser = typeof window !== "undefined"

type User = {
  id: string
  email: string
  passwordHash: string
  name?: string
  createdAt: string
}

class LocalAuthDB {
  private db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    if (!isBrowser || this.db) return
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("canscan-auth-db", 1)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "id" })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveUser(user: User): Promise<void> {
    await this.initialize()
    await new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction(["users"], "readwrite")
      const store = tx.objectStore("users")
      store.put(user)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  }

  async findUserByEmail(email: string): Promise<User | null> {
    await this.initialize()
    return await new Promise((resolve, reject) => {
      const tx = this.db!.transaction(["users"], "readonly")
      const store = tx.objectStore("users")
      const request = store.getAll()
      request.onsuccess = () => {
        const users = request.result as User[]
        resolve(users.find((u) => u.email === email) || null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async listUsers(): Promise<User[]> {
    await this.initialize()
    return await new Promise((resolve, reject) => {
      const tx = this.db!.transaction(["users"], "readonly")
      const store = tx.objectStore("users")
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result as User[])
      request.onerror = () => reject(request.error)
    })
  }
}

export const localAuthDB = new LocalAuthDB()

function hashPassword(password: string): string {
  let h = 0
  for (let i = 0; i < password.length; i++) {
    h = (h << 5) - h + password.charCodeAt(i)
    h |= 0
  }
  return "h" + h.toString(16)
}

export async function registerEmail(email: string, password: string, name?: string): Promise<User> {
  const existing = await localAuthDB.findUserByEmail(email)
  if (existing) throw new Error("این ایمیل قبلاً ثبت شده است")
  const user: User = {
    id: crypto.randomUUID(),
    email,
    passwordHash: hashPassword(password),
    name,
    createdAt: new Date().toISOString(),
  }
  await localAuthDB.saveUser(user)
  return user
}

export async function loginEmail(email: string, password: string): Promise<User> {
  const user = await localAuthDB.findUserByEmail(email)
  if (!user) throw new Error("کاربری با این ایمیل یافت نشد")
  if (user.passwordHash !== hashPassword(password)) throw new Error("رمز عبور نادرست است")
  return user
}

// OAuth availability is determined server-side only
// This function returns false for all providers since OAuth requires server-side configuration
export async function oauthAvailable(): Promise<{ google: boolean; github: boolean; microsoft: boolean }> {
  return {
    google: false,
    github: false,
    microsoft: false,
  }
}
