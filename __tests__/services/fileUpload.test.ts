import { FileUploadService } from '../../src/services/fileUpload'

// Mock Supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
      listBuckets: jest.fn(),
    },
  },
}))

describe('File Upload Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('FileUploadService.uploadImage', () => {
    it('uploads image successfully', async () => {
      const mockFileUri = 'https://example.com/test.jpg'
      const mockFileName = 'test.jpg'

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

      const result = await FileUploadService.uploadImage(mockFileUri, mockFileName)

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('images/'),
        expect.any(Object), // Blob object
        expect.objectContaining({
          cacheControl: '3600',
          upsert: false,
          contentType: expect.stringContaining('image/')
        })
      )
      expect(result).toEqual({
        url: 'https://example.com/test.jpg',
        path: 'images/test.jpg',
        size: expect.any(Number),
        type: 'image/jpg',
        name: 'test.jpg',
      })
    })

    it('handles upload errors', async () => {
      const mockFileUri = 'https://example.com/test.jpg'
      const mockFileName = 'test.jpg'

      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Upload failed' },
      })

      jest.mocked(require('../../src/lib/supabase').supabase.storage.from).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: jest.fn(),
      })

      await expect(FileUploadService.uploadImage(mockFileUri, mockFileName))
        .rejects.toThrow('Upload failed: Upload failed')
    })
  })

  describe('FileUploadService.uploadDocument', () => {
    it('uploads document successfully', async () => {
      const mockFileUri = 'https://example.com/test.pdf'
      const mockFileName = 'test.pdf'

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

      const result = await FileUploadService.uploadDocument(mockFileUri, mockFileName, 'application/pdf')

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('documents/'),
        expect.any(Object), // Blob object
        expect.objectContaining({
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf'
        })
      )
      expect(result).toEqual({
        url: 'https://example.com/test.pdf',
        path: 'documents/test.pdf',
        size: expect.any(Number),
        type: 'application/pdf',
        name: 'test.pdf',
      })
    })
  })

  describe('FileUploadService.testUpload', () => {
    it('tests upload functionality', async () => {
      const mockListBuckets = jest.fn().mockResolvedValue({
        data: [{ name: 'note-attachments' }],
        error: null,
      })

      jest.mocked(require('../../src/lib/supabase').supabase.storage).listBuckets = mockListBuckets

      const result = await FileUploadService.testUpload()

      expect(mockListBuckets).toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })
})
