import { describe, expect, it } from 'vitest'
import { adminResourceFromPath, canOpenAdminPath } from './adminAccess'

const finance = { adminRole: 'finance', allowedResources: ['dashboard', 'payments', 'promo-codes', 'banks', 'invitations'] }

describe('admin access', () => {
  it('maps pages to server resources', () => {
    expect(adminResourceFromPath('/admin')).toBe('dashboard')
    expect(adminResourceFromPath('/admin/templates')).toBe('template-designs')
    expect(adminResourceFromPath('/admin/system')).toBe('health')
    expect(adminResourceFromPath('/admin/invitations/4/edit')).toBe('invitations')
    expect(adminResourceFromPath('/dashboard')).toBeNull()
  })

  it('lets a restricted role open only what the server allows', () => {
    expect(canOpenAdminPath(finance, '/admin/payments')).toBe(true)
    expect(canOpenAdminPath(finance, '/admin/users')).toBe(false)
    expect(canOpenAdminPath(finance, '/admin/articles/3/edit')).toBe(false)
    expect(canOpenAdminPath(finance, '/admin/system')).toBe(false)
    expect(canOpenAdminPath(finance, '/admin/social-studio')).toBe(false)
  })

  it('keeps account security open to every admin', () => {
    expect(canOpenAdminPath(finance, '/admin/security')).toBe(true)
    expect(canOpenAdminPath({ adminRole: 'content', allowedResources: [] }, '/admin/totp/setup')).toBe(true)
  })

  it('opens everything to a superadmin and hides nothing when access is unknown', () => {
    expect(canOpenAdminPath({ adminRole: 'superadmin', allowedResources: [] }, '/admin/system')).toBe(true)
    expect(canOpenAdminPath(null, '/admin/users')).toBe(true)
  })
})
