import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminSecurity from '@/views/admin/AdminSecurity.vue'

const api = vi.hoisted(() => ({ status: vi.fn(), setup: vi.fn(), activate: vi.fn(), disable: vi.fn(), regenerate: vi.fn(), revoke: vi.fn(), revokeOthers: vi.fn(), fire: vi.fn() }))
vi.mock('@/api/adminSecurity.js', () => ({
  fetchAdminSecurity: api.status, setupAdminTotp: api.setup, activateAdminTotp: api.activate, disableAdminTotp: api.disable,
  regenerateRecoveryCodes: api.regenerate, revokeAdminSession: api.revoke, revokeOtherAdminSessions: api.revokeOthers,
}))
vi.mock('vue-toastification', () => ({ useToast: () => ({ success: vi.fn(), error: vi.fn() }) }))
vi.mock('sweetalert2', () => ({ default: { fire: api.fire } }))
vi.mock('@/components/admin/AdminShell.vue', () => ({ default: { template: '<div><slot /></div>' } }))

const base = {
  adminRole: 'finance', totpEnabled: false, recoveryCodesRemaining: 0,
  lastLogin: { at: '2026-10-28T03:00:00Z', ip: '1.2.3.4', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/120.0' },
  sessions: [
    { id: 'cur', current: true, ip: '1.1.1.1', userAgent: 'Chrome/120 Windows', createdAt: '2026-10-29T01:00:00Z', lastSeenAt: '2026-10-29T03:00:00Z' },
    { id: 'old', current: false, ip: '2.2.2.2', userAgent: 'Firefox/120 Linux', createdAt: '2026-10-27T01:00:00Z', lastSeenAt: '2026-10-28T03:00:00Z' },
  ],
}

beforeEach(() => {
  vi.clearAllMocks()
  api.status.mockResolvedValue(base)
  api.fire.mockResolvedValue({ isConfirmed: true })
})

describe('account security', () => {
  it('shows role, previous login and sessions, and only offers revoking other sessions', async () => {
    const wrapper = mount(AdminSecurity)
    await flushPromises()
    expect(wrapper.text()).toContain('finance')
    expect(wrapper.get('[data-testid="last-login"]').text()).toContain('1.2.3.4')
    const sessions = wrapper.get('[data-testid="sessions"]')
    expect(sessions.text()).toContain('Sesi ini')
    expect(sessions.findAll('button').map((b) => b.text())).toEqual(['Cabut'])
    await sessions.get('button').trigger('click')
    await flushPromises()
    expect(api.revoke).toHaveBeenCalledWith('old')
  })

  it('says sign-in does not require TOTP yet instead of implying protection', async () => {
    const wrapper = mount(AdminSecurity)
    await flushPromises()
    expect(wrapper.text()).toContain('Login belum meminta kode OTP')
  })

  it('shows recovery codes once after activation', async () => {
    api.setup.mockResolvedValue({ qrCode: 'data:image/png;base64,QR', secret: 'ABC' })
    api.activate.mockResolvedValue({ recoveryCodes: ['aaaa-bbbb-cccc-dddd', 'eeee-ffff-0000-1111'] })
    const wrapper = mount(AdminSecurity)
    await flushPromises()
    await wrapper.findAll('button').find((b) => b.text() === 'Siapkan autentikator').trigger('click')
    await flushPromises()
    await wrapper.get('#totp-activate').setValue('123456')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(api.activate).toHaveBeenCalledWith('123456')
    expect(wrapper.get('[data-testid="recovery-codes"]').text()).toContain('aaaa-bbbb-cccc-dddd')
    await wrapper.findAll('button').find((b) => b.text() === 'Sudah saya simpan').trigger('click')
    expect(wrapper.find('[data-testid="recovery-codes"]').exists()).toBe(false)
  })

  it('disables TOTP only after confirmation and with a proof', async () => {
    api.status.mockResolvedValue({ ...base, totpEnabled: true, recoveryCodesRemaining: 6 })
    api.disable.mockResolvedValue({})
    const wrapper = mount(AdminSecurity)
    await flushPromises()
    expect(wrapper.text()).toContain('Recovery code tersisa: 6')
    await wrapper.get('#proof-recovery').setValue('aaaa-bbbb-cccc-dddd')
    await wrapper.findAll('button').find((b) => b.text() === 'Nonaktifkan TOTP').trigger('click')
    await flushPromises()
    expect(api.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Nonaktifkan TOTP?' }))
    expect(api.disable).toHaveBeenCalledWith({ code: undefined, recoveryCode: 'aaaa-bbbb-cccc-dddd' })
  })

  it('shows a persistent error with retry when status cannot load', async () => {
    api.status.mockRejectedValueOnce(new Error('Gagal'))
    const wrapper = mount(AdminSecurity)
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Gagal')
  })
})
