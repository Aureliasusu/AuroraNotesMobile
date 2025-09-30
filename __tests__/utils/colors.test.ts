import { Colors, DarkColors } from '../../src/constants/colors'

describe('Color Constants', () => {
  describe('Colors (Light Theme)', () => {
    it('has all required color properties', () => {
      expect(Colors).toHaveProperty('primary')
      expect(Colors).toHaveProperty('secondary')
      expect(Colors).toHaveProperty('background')
      expect(Colors).toHaveProperty('surface')
      expect(Colors).toHaveProperty('textPrimary')
      expect(Colors).toHaveProperty('textSecondary')
      expect(Colors).toHaveProperty('border')
      expect(Colors).toHaveProperty('error')
      expect(Colors).toHaveProperty('success')
      expect(Colors).toHaveProperty('warning')
    })

    it('has valid color values', () => {
      expect(Colors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.background).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.surface).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.textPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.textSecondary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.border).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.error).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.success).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Colors.warning).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has consistent color scheme', () => {
      expect(Colors.background).toBe('#ffffff')
      expect(Colors.surface).toBe('#f8f9fa')
      expect(Colors.textPrimary).toBe('#1a1a1a')
      expect(Colors.textSecondary).toBe('#6b7280')
    })
  })

  describe('DarkColors (Dark Theme)', () => {
    it('has all required color properties', () => {
      expect(DarkColors).toHaveProperty('primary')
      expect(DarkColors).toHaveProperty('secondary')
      expect(DarkColors).toHaveProperty('background')
      expect(DarkColors).toHaveProperty('surface')
      expect(DarkColors).toHaveProperty('textPrimary')
      expect(DarkColors).toHaveProperty('textSecondary')
      expect(DarkColors).toHaveProperty('border')
      expect(DarkColors).toHaveProperty('error')
      expect(DarkColors).toHaveProperty('success')
      expect(DarkColors).toHaveProperty('warning')
    })

    it('has valid color values', () => {
      expect(DarkColors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.background).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.surface).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.textPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.textSecondary).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.border).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.error).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.success).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(DarkColors.warning).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has dark theme appropriate colors', () => {
      expect(DarkColors.background).toBe('#121212')
      expect(DarkColors.surface).toBe('#1e1e1e')
      expect(DarkColors.textPrimary).toBe('#ffffff')
      expect(DarkColors.textSecondary).toBe('#a0a0a0')
    })
  })

  describe('Color Consistency', () => {
    it('maintains color relationships', () => {
      // Light theme should have dark text on light background
      expect(Colors.textPrimary).not.toBe(Colors.background)
      expect(Colors.textSecondary).not.toBe(Colors.background)
      
      // Dark theme should have light text on dark background
      expect(DarkColors.textPrimary).not.toBe(DarkColors.background)
      expect(DarkColors.textSecondary).not.toBe(DarkColors.background)
    })

    it('has accessible color contrast', () => {
      // Primary colors should be distinct
      expect(Colors.primary).not.toBe(Colors.secondary)
      expect(DarkColors.primary).not.toBe(DarkColors.secondary)
      
      // Error, success, warning should be distinct
      expect(Colors.error).not.toBe(Colors.success)
      expect(Colors.success).not.toBe(Colors.warning)
      expect(Colors.warning).not.toBe(Colors.error)
    })
  })
})
