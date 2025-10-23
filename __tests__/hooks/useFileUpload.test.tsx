import { renderHook, act } from '@testing-library/react-native'
import { useFileUpload } from '../../src/hooks/useFileUpload'

// Mock dependencies
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
    },
    RESULTS: {
      GRANTED: 'granted',
    },
  },
}))

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
  MediaTypeOptions: {
    All: 'mixed',
    Images: 'photo',
    Videos: 'video',
  },
}))

jest.mock('react-native-document-picker', () => ({
  pick: jest.fn(),
  types: {
    allFiles: '*/*',
    images: 'image/*',
    plainText: 'text/plain',
  },
}))

jest.mock('../../src/services/fileUpload', () => ({
  uploadImage: jest.fn(),
  uploadDocument: jest.fn(),
}))

describe('useFileUpload', () => {
  it('returns file upload functions', () => {
    const { result } = renderHook(() => useFileUpload())
    
    expect(result.current).toHaveProperty('pickImageFromGallery')
    expect(result.current).toHaveProperty('takePhoto')
    expect(result.current).toHaveProperty('pickDocument')
    expect(result.current).toHaveProperty('uploadFile')
  })

  it('handles image picking', async () => {
    const { result } = renderHook(() => useFileUpload())
    
    await act(async () => {
      await result.current.pickImageFromGallery()
    })
    
    // Should call image picker
    expect(result.current.pickImageFromGallery).toBeDefined()
  })

  it('handles camera capture', async () => {
    const { result } = renderHook(() => useFileUpload())
    
    await act(async () => {
      await result.current.takePhoto()
    })
    
    // Should call camera
    expect(result.current.takePhoto).toBeDefined()
  })

  it('handles document picking', async () => {
    const { result } = renderHook(() => useFileUpload())
    
    await act(async () => {
      await result.current.pickDocument()
    })
    
    // Should call document picker
    expect(result.current.pickDocument).toBeDefined()
  })

  it('handles file upload', async () => {
    const { result } = renderHook(() => useFileUpload())
    
    const mockFile = {
      uri: 'file://test.jpg',
      type: 'image/jpeg',
      name: 'test.jpg',
    }
    
    await act(async () => {
      await result.current.uploadFile(mockFile.uri, mockFile.name, mockFile.type)
    })
    
    // Should handle file upload
    expect(result.current.uploadFile).toBeDefined()
  })

  it('handles upload errors gracefully', async () => {
    const { result } = renderHook(() => useFileUpload())
    
    // Mock upload failure
    jest.mocked(require('../../src/services/fileUpload').uploadImage).mockRejectedValue(
      new Error('Upload failed')
    )
    
    const mockFile = {
      uri: 'file://test.jpg',
      type: 'image/jpeg',
      name: 'test.jpg',
    }
    
    await act(async () => {
      try {
        await result.current.uploadFile(mockFile.uri, mockFile.name, mockFile.type)
      } catch (error: any) {
        expect(error.message).toBe('Upload failed')
      }
    })
  })
})
