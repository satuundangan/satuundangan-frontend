import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminSystem from '@/views/admin/AdminSystem.vue'

const api = vi.hoisted(() => ({ health: vi.fn(), maintenance: vi.fn(), update: vi.fn(), audit: vi.fn(), success: vi.fn(), error: vi.fn() }))
vi.mock('@/api/adminSecurity.js', () => ({
  fetchAdminHealthReport: api.health, fetchMaintenance: api.maintenance, updateMaintenance: api.update, fetchAdminAuditLogs: api.audit,
}))
vi.mock('vue-toastification', () => ({ useToast: () => ({ success: api.success, error: api.error }) }))
vi.mock('@/components/admin/AdminShell.vue', () => ({ default: { template: '<div><slot /></div>' } }))

const service = (key, status, extra = {}) => ({ key, label: key, required: true, status, message: `${key} ${status}`, latencyMs: 12, checkedAt: '2026-10-29T03:00:00Z', method: 'probe', ...extra })

beforeEach(() => {
  vi.clearAllMocks()
  api.health.mockResolvedValue({ checkedAt: '2026-10-29T03:00:00Z', worst: 'error', services: [service('database', 'available'), service('email', 'configured'), service('payment', 'error', { message: 'Midtrans menolak server key (401)' }), service('analytics', 'unknown', { required: false })] })
  api.maintenance.mockResolvedValue({ enabled: false, active: false, message: 'Sedang perawatan', reason: '', until: null, scope: 'Menonaktifkan pembelian baru.' })
  api.update.mockResolvedValue({})
  api.audit.mockResolvedValue({ items: [], total: 0, page: 1, totalPages: 1 })
})

describe('system page', () => {
  it('distinguishes available, configured, error and unknown with how each was checked', async () => {
    const wrapper = mount(AdminSystem)
    await flushPromises()
    const list = wrapper.get('[data-testid="health-list"]')
    expect(list.text()).toContain('Tersedia')
    expect(list.text()).toContain('Terkonfigurasi')
    expect(list.text()).toContain('Error')
    expect(list.text()).toContain('Tidak diketahui')
    expect(list.text()).toContain('Midtrans menolak server key')
    expect(list.text()).toContain('cek: probe')
    expect(list.text()).toContain('Opsional')
    expect(wrapper.get('[data-testid="health-checked"]').text()).toContain('WIB')
  })

  it('shows a failed health check as an error with retry, not as healthy', async () => {
    api.health.mockRejectedValueOnce(new Error('Server tidak merespons'))
    const wrapper = mount(AdminSystem)
    await flushPromises()
    expect(wrapper.get('#panel-health [role="alert"]').text()).toContain('Server tidak merespons')
    expect(wrapper.find('[data-testid="health-list"]').exists()).toBe(false)
  })

  it('states exactly what maintenance closes and sends WIB end time as UTC', async () => {
    const wrapper = mount(AdminSystem)
    await flushPromises()
    expect(wrapper.get('[data-testid="maintenance-state"]').text()).toContain('Normal')
    expect(wrapper.get('#panel-maintenance').text()).toContain('Menonaktifkan pembelian baru')
    await wrapper.get('#panel-maintenance input[type="checkbox"]').setValue(true)
    await wrapper.get('#m-reason').setValue('Migrasi database')
    await wrapper.get('#m-until').setValue('2099-10-30T08:00')
    await wrapper.findAll('#panel-maintenance button').find((b) => b.text() === 'Simpan').trigger('click')
    await flushPromises()
    expect(api.update).toHaveBeenCalledWith({ enabled: true, message: 'Sedang perawatan', reason: 'Migrasi database', until: '2099-10-30T01:00:00.000Z' })
  })

  it('lists audit entries with actor, change and result and offers reset when a filter hides everything', async () => {
    api.audit.mockResolvedValue({
      total: 1, page: 1, totalPages: 1,
      items: [{ id: 1, createdAt: '2026-10-29T03:00:00Z', actorEmail: 'a@x.id', actorRole: 'superadmin', action: 'users.update-admin-role', entityType: 'users', entityId: '7', before: { adminRole: 'support' }, after: { adminRole: 'finance' }, reason: 'Pindah tugas', result: 'success', statusCode: 200, requestId: 'req-1' }],
    })
    const wrapper = mount(AdminSystem)
    await flushPromises()
    const rows = wrapper.get('[data-testid="audit-rows"]')
    expect(rows.text()).toContain('users.update-admin-role')
    expect(rows.text()).toContain('Pindah tugas')
    expect(rows.text()).toContain('req-1')
    expect(rows.text()).toContain('Berhasil')

    api.audit.mockResolvedValue({ items: [], total: 0, page: 1, totalPages: 1 })
    await wrapper.get('#a-result').setValue('failed')
    await wrapper.get('#panel-audit form').trigger('submit')
    await flushPromises()
    expect(api.audit).toHaveBeenLastCalledWith(expect.objectContaining({ result: 'failed', page: 1 }))
    expect(wrapper.get('[data-testid="audit-rows"]').text()).toContain('Tidak ada catatan untuk filter ini')
    expect(wrapper.get('[data-testid="audit-rows"]').text()).toContain('Reset filter')
  })
})
