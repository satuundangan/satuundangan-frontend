import { spawnSync } from 'child_process'

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const baseURL = process.env.E2E_BASE_URL || 'https://www.satuundangan.id'

const result = spawnSync(
  command,
  ['playwright', 'test', 'tests/production-write.production.spec.js', '--project=production-write'],
  {
    env: {
      ...process.env,
      E2E_BASE_URL: baseURL,
    },
    stdio: 'inherit',
    shell: true,
  },
)

if (result.error) {
  console.error(result.error)
}

process.exit(result.status ?? 1)
