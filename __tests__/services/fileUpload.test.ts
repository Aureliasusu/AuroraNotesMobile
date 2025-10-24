import { FileUploadService } from '../../src/services/fileUpload'
import { supabase } from '../../src/lib/supabase'
import { Alert } from 'react-native'

// Mock dependencies
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(),
    },
  },
}))

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}))

// Mock global fetch
global.fetch = jest.fn()

describe('FileUploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
      const mockUploadData = { path: 'images/123-test.jpg' }
      const mockPublicUrl = 'https://example.com/images/123-test.jpg'

      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      })

      const mockUpload = jest.fn().mockResolvedValue({
        data: mockUploadData,
        error: null,
      })

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })

      const result = await FileUploadService.uploadImage(
        'file:///path/to/image.jpg',
        'test.jpg'
      )

      expect(global.fetch).toHaveBeenCalledWith('file:///path/to/image.jpg')
      expect(supabase.storage.from).toHaveBeenCalledWith('note-attachments')
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('images/'),
        mockBlob,
        {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpg',
        }
      )
      expect(result.url).toBe(mockPublicUrl)
      expect(result.path).toBe(mockUploadData.path)
      expect(result.name).toBe('test.jpg')
    })

    it('should throw error when upload fails', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' })
      const mockError = { message: 'Upload failed' }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      })

      await expect(
        FileUploadService.uploadImage('file:///test.jpg', 'test.jpg')
      ).rejects.toThrow('Upload failed: Upload failed')

      expect(Alert.alert).toHaveBeenCalledWith('Upload Error', 'Failed to upload image')
    })

    it('should use custom bucket when provided', async () => {
      const mockBlob = new Blob(['test'], { type: 'image/jpeg' })

      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'test.jpg' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test.jpg' },
        }),
      })

      await FileUploadService.uploadImage(
        'file:///test.jpg',
        'test.jpg',
        'custom-bucket'
      )

      expect(supabase.storage.from).toHaveBeenCalledWith('custom-bucket')
    })
  })

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      const mockUploadData = { path: 'documents/123-test.pdf' }
      const mockPublicUrl = 'https://example.com/documents/123-test.pdf'

      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      })

      const mockUpload = jest.fn().mockResolvedValue({
        data: mockUploadData,
        error: null,
      })

      const mockGetPublicUrl = jest.fn().mockReturnValue({
        data: { publicUrl: mockPublicUrl },
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })

      const result = await FileUploadService.uploadDocument(
        'file:///path/to/doc.pdf',
        'test.pdf',
        'application/pdf'
      )

      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('documents/'),
        mockBlob,
        {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        }
      )
      expect(result.url).toBe(mockPublicUrl)
      expect(result.type).toBe('application/pdf')
    })

    it('should throw error when document upload fails', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      const mockError = { message: 'Upload failed' }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      })

      await expect(
        FileUploadService.uploadDocument(
          'file:///test.pdf',
          'test.pdf',
          'application/pdf'
        )
      ).rejects.toThrow('Document upload failed: Upload failed')
    })
  })

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        remove: jest.fn().mockResolvedValue({
          data: { path: 'test.jpg' },
          error: null,
        }),
      })

      await FileUploadService.deleteFile('images/test.jpg')

      expect(supabase.storage.from).toHaveBeenCalledWith('note-attachments')
    })

    it('should throw error when deletion fails', async () => {
      const mockError = { message: 'Delete failed' }

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        remove: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      })

      await expect(
        FileUploadService.deleteFile('images/test.jpg')
      ).rejects.toThrow('Delete failed: Delete failed')
    })

    it('should use custom bucket for deletion', async () => {
      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        remove: jest.fn().mockResolvedValue({
          data: { path: 'test.jpg' },
          error: null,
        }),
      })

      await FileUploadService.deleteFile('test.jpg', 'custom-bucket')

      expect(supabase.storage.from).toHaveBeenCalledWith('custom-bucket')
    })
  })

  describe('getFileUrl', () => {
    it('should get public URL successfully', () => {
      const mockPublicUrl = 'https://example.com/test.jpg'

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: mockPublicUrl },
        }),
      })

      const url = FileUploadService.getFileUrl('images/test.jpg')

      expect(supabase.storage.from).toHaveBeenCalledWith('note-attachments')
      expect(url).toBe(mockPublicUrl)
    })

    it('should use custom bucket for getting URL', () => {
      const mockPublicUrl = 'https://example.com/test.jpg'

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: mockPublicUrl },
        }),
      })

      FileUploadService.getFileUrl('test.jpg', 'custom-bucket')

      expect(supabase.storage.from).toHaveBeenCalledWith('custom-bucket')
    })
  })

  describe('error handling', () => {
    it('should handle fetch errors', async () => {
      const fetchError = new Error('Network error')

      ;(global.fetch as jest.Mock).mockRejectedValue(fetchError)

      await expect(
        FileUploadService.uploadImage('file:///test.jpg', 'test.jpg')
      ).rejects.toThrow('Network error')
    })

    it('should handle blob conversion errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.reject(new Error('Blob error')),
      })

      await expect(
        FileUploadService.uploadImage('file:///test.jpg', 'test.jpg')
      ).rejects.toThrow('Blob error')
    })

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockError = { message: 'Test error' }

      ;(global.fetch as jest.Mock).mockResolvedValue({
        blob: () => Promise.resolve(new Blob(['test'])),
      })

      ;(supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      })

      await expect(
        FileUploadService.uploadImage('file:///test.jpg', 'test.jpg')
      ).rejects.toThrow()

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })
})
