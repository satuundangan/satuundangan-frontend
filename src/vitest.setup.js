if (typeof window !== 'undefined') {
  const storage = new Map()
  const mockStorage = {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, val) => storage.set(key, String(val)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear(),
    get length() {
      return storage.size
    },
    key: (i) => Array.from(storage.keys())[i] || null,
  }

  try {
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  } catch {
    // Ignore if not configurable
  }

  try {
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    })
  } catch {
    // Ignore
  }
}
