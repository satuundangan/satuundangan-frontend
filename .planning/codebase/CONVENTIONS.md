# Coding Conventions

**Analysis Date:** 2026-04-05

## Naming Patterns

**Files:**
- Vue components: PascalCase (e.g., `StatCard.vue`, `AuthModal.vue`, `InvitationsTable.vue`)
- API modules: camelCase (e.g., `auth.js`, `invitation.js`, `client.js`, `promo.js`)
- Store files: camelCase (e.g., `auth.js`)
- Views: PascalCase (e.g., `HomeView.vue`, `CreateForm.vue`, `CheckoutPage.vue`)
- Directories: kebab-case (e.g., `admin/`, `dashboard/`, `create-form/`)

**Functions:**
- Named functions: camelCase (e.g., `handleLogin()`, `formatDate()`, `getStatusClass()`, `togglePassword()`)
- Arrow functions: camelCase (e.g., `const handleSubmit = async () => {...}`)
- Utility functions: camelCase (e.g., `apiFetch()`, `validateField()`)
- Private/internal functions: camelCase prefix with underscore if needed (not consistently applied)

**Variables:**
- Reactive variables: camelCase (e.g., `email`, `loading`, `selectedCategory`, `showPassword`)
- Constants: UPPER_SNAKE_CASE (e.g., `BASE_URL`, `STORAGE_STATE`, `PROMO_CODE`)
- Ref objects: camelCase (e.g., `const email = ref('')`, `const loading = ref(false)`)
- Object properties: camelCase (e.g., `formData.brideName`, `formData.groomPhoto`)

**Types:**
- Props interface: PascalCase + `Props` suffix (e.g., `AuthModalProps`)
- Custom types: PascalCase (following Vue conventions)
- Array elements: singular form (e.g., `invitations: Array` contains `invite` items)

## Code Style

**Formatting:**
- Tool: Prettier 3.5.3
- Semi-colons: **None** (`semi: false`)
- Quotes: **Single quotes** (`singleQuote: true`)
- Line width: **100 characters** (`printWidth: 100`)
- Indentation: **2 spaces** (defined in `.editorconfig`)
- Line endings: **LF** (defined in `.editorconfig`)

**Linting:**
- Tool: ESLint with flat config (`eslint.config.js`)
- Vue rules: `eslint-plugin-vue` flat/essential
- JavaScript: `@eslint/js` recommended
- Prettier integration: `@vue/eslint-config-prettier/skip-formatting` (formatting delegated to Prettier)
- Run: `npm run lint` (includes auto-fix with `--fix` flag)

## Import Organization

**Order:**
1. Vue core/lifecycle: `import { ref, watch, onMounted } from 'vue'`
2. Vue ecosystem: `import { useRouter } from 'vue-router'`, `import { useAuthStore } from '@/stores/auth'`
3. Third-party libraries: `import { useToast } from 'vue-toastification'`, `import axios from 'axios'`
4. Local API modules: `import { login } from '@/api/auth'`
5. Local components: `import StatCard from '@/components/dashboard/StatCard.vue'`

**Path Aliases:**
- `@` → `src/` (configured in `jsconfig.json` and Vite)
- Used consistently throughout: `@/stores/auth`, `@/api/client`, `@/components/modal/AuthModal`

**Export Patterns:**
- API modules: Named exports for individual functions (e.g., `export const login = (data) => {...}`)
- Pinia stores: Default export with `defineStore()` function (e.g., `export const useAuthStore = defineStore(...)`)
- Vue components: Default export (implicit in `.vue` files)

## Error Handling

**Patterns:**
- Try-catch blocks in async operations: Used in auth store (`fetchProfile()`, `init()`), components, and API calls
- Example from `src/stores/auth.js`:
  ```javascript
  async fetchProfile() {
    if (!this.token) return
    try {
      const res = await getProfile(this.token)
      this.user = res
    } catch (error) {
      console.error('Gagal mengambil profil:', error)
      this.logout()
      throw error
    }
  }
  ```
- Example from `src/api/client.js`:
  ```javascript
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Something went wrong' }))
    throw new Error(err.message || 'Something went wrong')
  }
  ```
- User-facing errors: Caught and displayed via toast notifications (e.g., `toast.error('Login gagal!')`)
- Errors are both logged to console and thrown for caller handling

**File upload error handling** (`src/api/file.js`):
```javascript
try {
  if (!(file instanceof File)) {
    throw new Error('Invalid file object')
  }
  const response = await fetch(...)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upload failed: ${response.status} - ${errorText}`)
  }
  return await response.json().catch(() => ({}))
} catch (error) {
  console.error('Upload error:', { file: file.name, error: error.message })
  throw error
}
```

## Logging

**Framework:** `console` object (native JavaScript)

**Patterns:**
- `console.log()`: Debug/informational logs (e.g., profile fetching)
- `console.error()`: Error logs with context (e.g., `console.error('Gagal mengambil profil:', error)`)
- Logs include Indonesian error messages mixed with English code
- Some logs are commented out (e.g., `// console.log('Fetched profile:', res)` in `auth.js`)
- Upload operations log detailed error objects: `console.error('Upload error:', { file: file.name, error: error.message })`

## Comments

**When to Comment:**
- Complex logic that isn't immediately obvious
- Section dividers for multi-step processes (e.g., test files use `// ─────────────────────────────────────────────`)
- Temporary/debug comments (some commented console.logs exist)
- API response handling caveats (e.g., `// Handle response wrapping (e.g. { data: { ... } })`)

**JSDoc/TSDoc:**
- Not consistently used
- Some functions lack documentation strings
- Pinia store actions have inline comments explaining behavior but no formal JSDoc blocks

**Example of sparse commenting:**
```javascript
// src/api/client.js - minimal comments, simple logic
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
  // Only 1 comment explaining response handling
}
```

## Function Design

**Size:** Generally compact (10-30 lines typical)
- API functions: 1-5 lines (thin wrappers around `apiFetch`)
- Component methods: 10-30 lines (event handlers, validation)
- Store actions: 10-50 lines (async operations with error handling)

**Parameters:**
- Single object parameter for complex data: `login(data)` where `data = { email, password }`
- Minimal parameters: Keep to 1-3 args max
- Optional parameters use defaults: `apiFetch(path, options = {})`

**Return Values:**
- API calls: Promise that resolves to JSON response or Error
- Component methods: Side effects (state mutation, emit) more common than explicit returns
- Utility functions: Explicit return values (e.g., `formatDate()` returns string)
- Safe fallbacks: `return '-'` for missing dates, empty arrays for no items

**Example patterns:**
```javascript
// API wrapper pattern - minimal
export const login = (data) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

// Component method pattern - validation + async
const handleLogin = async () => {
  if (!email.value) return
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    await router.push('/dashboard')
  } catch (e) {
    toast.error('Login gagal!')
    console.error(e)
  } finally {
    loading.value = false
  }
}

// Utility pattern - pure function
function formatDate(date) {
  if (!date) return '-'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch (e) {
    return '-'
  }
}
```

## Module Design

**Exports:**
- API modules: Named exports for each endpoint function
- Pinia stores: Single default export (the store instance)
- Vue components: Single default export (implicit)
- Utility files: Mix of named and default exports

**Barrel Files:**
- Not commonly used in this codebase
- Direct imports preferred: `import { useAuthStore } from '@/stores/auth'` rather than `import { useAuthStore } from '@/stores'`

**Component Structure Pattern:**
```vue
<template>
  <!-- Template code -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

// Props
const props = defineProps({
  items: Array,
  title: String,
})

// Emits
const emit = defineEmits(['save', 'close'])

// Reactive state
const loading = ref(false)
const selectedId = ref(null)

// Stores
const auth = useAuthStore()
const toast = useToast()

// Computed
const filteredItems = computed(() => {
  // ...
})

// Methods
function handleSubmit() {
  // ...
}

onMounted(() => {
  // ...
})
</script>

<style scoped>
/* Component-scoped styles using Tailwind (inline classes preferred) */
</style>
```

**API Module Pattern:**
```javascript
import { apiFetch } from './client'

export const getItems = () => apiFetch('/items')

export const getItemById = (id) => apiFetch(`/items/${id}`)

export const createItem = (data) =>
  apiFetch('/items', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateItem = (id, data) =>
  apiFetch(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteItem = (id) =>
  apiFetch(`/items/${id}`, {
    method: 'DELETE',
  })
```

---

*Convention analysis: 2026-04-05*
