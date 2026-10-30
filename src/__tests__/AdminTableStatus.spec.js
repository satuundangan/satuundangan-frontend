import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AdminTableStatus from '@/components/admin/AdminTableStatus.vue'

describe('AdminTableStatus', () => {
  it('shows a persistent error that is not mistaken for an empty table, and retries', async () => {
    const wrapper = mount(AdminTableStatus, { props: { error: 'Server mati', count: 0, filtered: true } })
    expect(wrapper.get('[data-testid="table-error"]').text()).toContain('Server mati')
    expect(wrapper.get('[data-testid="table-error"]').text()).toContain('bukan berarti datanya kosong')
    expect(wrapper.find('[data-testid="table-filtered-empty"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="table-updated"]').exists()).toBe(false)
    await wrapper.get('[data-testid="table-error"] button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('offers a reset when filters hide every row, but not when the table is simply empty', async () => {
    const filtered = mount(AdminTableStatus, { props: { count: 0, filtered: true } })
    await filtered.get('[data-testid="table-filtered-empty"] button').trigger('click')
    expect(filtered.emitted('reset')).toHaveLength(1)
    expect(mount(AdminTableStatus, { props: { count: 0, filtered: false } }).find('[data-testid="table-filtered-empty"]').exists()).toBe(false)
  })

  it('shows when the data was loaded, in WIB', () => {
    const wrapper = mount(AdminTableStatus, { props: { updatedAt: '2026-10-29T03:15:00Z' } })
    expect(wrapper.get('[data-testid="table-updated"]').text()).toMatch(/Diperbarui .*10\.15.* WIB/)
  })

  it('exports on request and reports progress', async () => {
    const wrapper = mount(AdminTableStatus, { props: { exportable: true, exporting: false, exportNote: '120 baris diekspor (semua hasil filter, bukan hanya halaman ini).' } })
    await wrapper.findAll('button').find((b) => b.text().startsWith('Ekspor')).trigger('click')
    expect(wrapper.emitted('export')).toHaveLength(1)
    expect(wrapper.text()).toContain('semua hasil filter')
    await wrapper.setProps({ exporting: true })
    expect(wrapper.findAll('button').find((b) => b.text() === 'Menyiapkan…').attributes('disabled')).toBeDefined()
  })

  it('lets columns be hidden except required ones', async () => {
    const calls = []
    const visibility = {
      columns: [{ key: 'name', label: 'Nama', required: true }, { key: 'email', label: 'Email' }],
      isVisible: () => true, toggle: (key) => calls.push(key), reset: () => calls.push('reset'),
    }
    const wrapper = mount(AdminTableStatus, { props: { visibility } })
    const boxes = wrapper.findAll('input[type="checkbox"]')
    expect(boxes[0].attributes('disabled')).toBeDefined()
    await boxes[1].trigger('change')
    expect(calls).toEqual(['email'])
  })
})
