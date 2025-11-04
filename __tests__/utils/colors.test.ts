import { colors } from '../../src/constants/colors'

describe('Color Constants', () => {
  describe('Colors Structure', () => {
    it('has all required color properties', () => {
      expect(colors).toHaveProperty('primary')
      expect(colors).toHaveProperty('gray')
      expect(colors).toHaveProperty('success')
      expect(colors).toHaveProperty('error')
      expect(colors).toHaveProperty('warning')
      expect(colors).toHaveProperty('background')
      expect(colors).toHaveProperty('text')
      expect(colors).toHaveProperty('border')
      expect(colors).toHaveProperty('shadow')
    })

    it('has primary color scale', () => {
      expect(colors.primary).toHaveProperty('500')
      expect(colors.primary[500]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has gray color scale', () => {
      expect(colors.gray).toHaveProperty('50')
      expect(colors.gray).toHaveProperty('500')
      expect(colors.gray).toHaveProperty('900')
      expect(colors.gray[500]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has semantic color scales', () => {
      expect(colors.success).toHaveProperty('500')
      expect(colors.error).toHaveProperty('500')
      expect(colors.warning).toHaveProperty('500')
      expect(colors.success[500]).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(colors.error[500]).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(colors.warning[500]).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has background colors', () => {
      expect(colors.background).toHaveProperty('primary')
      expect(colors.background).toHaveProperty('secondary')
      expect(colors.background.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has text colors', () => {
      expect(colors.text).toHaveProperty('primary')
      expect(colors.text).toHaveProperty('secondary')
      expect(colors.text).toHaveProperty('tertiary')
      expect(colors.text).toHaveProperty('quaternary')
      expect(colors.text).toHaveProperty('inverse')
      expect(colors.text.primary).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })

    it('has border colors', () => {
      expect(colors.border).toHaveProperty('light')
      expect(colors.border).toHaveProperty('medium')
      expect(colors.border).toHaveProperty('dark')
      expect(colors.border.light).toMatch(/^#[0-9A-Fa-f]{6}$/)
    })
  })

  describe('Color Values', () => {
    it('has consistent light theme colors', () => {
      expect(colors.background.primary).toBe('#ffffff')
      expect(colors.background.secondary).toBe('#f9fafb')
      expect(colors.text.primary).toBe('#111827')
      expect(colors.text.secondary).toBe('#374151')
    })

    it('has correct primary color', () => {
      expect(colors.primary[500]).toBe('#3b82f6')
    })

    it('has correct semantic colors', () => {
      expect(colors.success[500]).toBe('#10b981')
      expect(colors.error[500]).toBe('#ef4444')
      expect(colors.warning[500]).toBe('#f59e0b')
    })
  })

  describe('Color Consistency', () => {
    it('maintains color relationships', () => {
      // Light theme should have dark text on light background
      expect(colors.text.primary).not.toBe(colors.background.primary)
      expect(colors.text.secondary).not.toBe(colors.background.primary)
    })

    it('has accessible color contrast', () => {
      // Primary colors should be distinct
      expect(colors.primary[500]).not.toBe(colors.gray[500])
      
      // Error, success, warning should be distinct
      expect(colors.error[500]).not.toBe(colors.success[500])
      expect(colors.success[500]).not.toBe(colors.warning[500])
      expect(colors.warning[500]).not.toBe(colors.error[500])
    })

    it('has proper color hierarchy', () => {
      // Gray scale should be ordered
      expect(colors.gray[50]).not.toBe(colors.gray[900])
      expect(colors.gray[100]).not.toBe(colors.gray[800])
      
      // Primary scale should be ordered
      expect(colors.primary[50]).not.toBe(colors.primary[900])
      expect(colors.primary[100]).not.toBe(colors.primary[800])
    })
  })

  describe('Code Theme Colors', () => {
    it('has dark code theme colors', () => {
      expect(colors.code).toHaveProperty('background')
      expect(colors.code).toHaveProperty('text')
      expect(colors.code.background).toBe('#1e1e1e')
      expect(colors.code.text).toBe('#d4d4d4')
    })

    it('has light code theme colors', () => {
      expect(colors.codeLight).toHaveProperty('background')
      expect(colors.codeLight).toHaveProperty('text')
      expect(colors.codeLight.background).toBe('#ffffff')
      expect(colors.codeLight.text).toBe('#333333')
    })
  })
})
