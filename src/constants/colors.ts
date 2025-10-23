// Color constants for consistent theming
export const Colors = {
  // Primary colors
  primary: '#3b82f6',
  primaryDark: '#1d4ed8',
  primaryLight: '#dbeafe',
  
  // Secondary colors
  secondary: '#10b981',
  secondaryDark: '#059669',
  secondaryLight: '#d1fae5',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background colors
  background: '#f9fafb',
  surface: '#ffffff',
  surfaceSecondary: '#f3f4f6',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#374151',
  textTertiary: '#6b7280',
  textDisabled: '#9ca3af',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Code editor colors
  codeBackground: '#1e1e1e',
  codeBackgroundLight: '#f8f9fa',
  codeText: '#d4d4d4',
  codeTextLight: '#333333',
  codeBorder: '#404040',
  codeBorderLight: '#e5e7eb',
}

// Dark theme colors
export const DarkColors = {
  ...Colors,
  background: '#111827',
  surface: '#1f2937',
  surfaceSecondary: '#374151',
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',
  border: '#374151',
  borderLight: '#4b5563',
  borderDark: '#6b7280',
}
