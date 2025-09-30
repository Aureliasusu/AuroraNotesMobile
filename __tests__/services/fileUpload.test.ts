import { uploadImage, uploadDocument, testUpload } from '../../src/services/fileUpload'

// Mock Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
  },
}))

describe('File Upload Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadImage', () => {
    it('uploads image successfully', async () => {
      const mockFile = {
        uri: 'file://test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
      }

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'images/test.jpg' },
        error: null,
      })

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.jpg' },
      })

      jest.mocked(require('../../src/lib/supabase').supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })

      const result = await uploadImage(mockFile, 'user123')

      expect(mockUpload).toHaveBeenCalledWith(
        'user123/test.jpg',
        expect.any(FormData)
      )
      expect(result).toEqual({
        success: true,
        url: 'https://example.com/test.jpg',
      })
    })

    it('handles upload errors', async () => {
      const mockFile = {
        uri: 'file://test.jpg',
        type: 'image/jpeg',
        name: 'test.jpg',
      }

      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' },
      })

      jest.mocked(require('../../src/lib/supabase').supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: jest.fn(),
      })

      const result = await uploadImage(mockFile, 'user123')

      expect(result).toEqual({
        success: false,
        error: 'Upload failed',
      })
    })
  })

  describe('uploadDocument', () => {
    it('uploads document successfully', async () => {
      const mockFile = {
        uri: 'file://test.pdf',
        type: 'application/pdf',
        name: 'test.pdf',
      }

      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'documents/test.pdf' },
        error: null,
      })

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/test.pdf' },
      })

      jest.mocked(require('../../src/lib/supabase').supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })

      const result = await uploadDocument(mockFile, 'user123')

      expect(mockUpload).toHaveBeenCalledWith(
        'user123/test.pdf',
        expect.any(FormData)
      )
      expect(result).toEqual({
        success: true,
        url: 'https://example.com/test.pdf',
      })
    })
  })

  describe('testUpload', () => {
    it('tests upload functionality', async () => {
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'test/test.txt' },
        error: null,
      })

      jest.mocked(require('../../src/lib/supabase').supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: jest.fn(),
      })

      const result = await testUpload()

      expect(mockUpload).toHaveBeenCalled()
      expect(result.success).toBe(true)
    })
  })
})
