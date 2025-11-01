import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'

export interface FileUploadResult {
  url: string
  path: string
  size: number
  type: string
  name: string
}

export class FileUploadService {
  // Upload image to Supabase storage
  static async uploadImage(
    fileUri: string,
    fileName: string,
    bucket: string = 'note-attachments'
  ): Promise<FileUploadResult> {
    try {
      // Read file content
      const response = await fetch(fileUri)
      const blob = await response.blob()
      
      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = fileName.split('.').pop() || 'jpg'
      const uniqueFileName = `images/${timestamp}-${fileName}`

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${fileExtension}`,
        })

      if (error) {
        // eslint-disable-next-line no-console
console.error('Upload error', error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
        size: blob.size,
        type: `image/${fileExtension}`,
        name: fileName,
      }
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Image upload failed', error)
      Alert.alert('Upload Error', 'Failed to upload image')
      throw error
    }
  }

  // Upload document to Supabase storage
  static async uploadDocument(
    fileUri: string,
    fileName: string,
    mimeType: string,
    bucket: string = 'note-attachments'
  ): Promise<FileUploadResult> {
    try {
      // Read file content
      const response = await fetch(fileUri)
      const blob = await response.blob()
      
      // Generate unique filename
      const timestamp = Date.now()
      const uniqueFileName = `documents/${timestamp}-${fileName}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
        })

      if (error) {
        // eslint-disable-next-line no-console
console.error('Document upload error', error)
        throw new Error(`Document upload failed: ${error.message}`)
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
        size: blob.size,
        type: mimeType,
        name: fileName,
      }
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Document upload failed', error)
      Alert.alert('Upload Error', 'Failed to upload document')
      throw error
    }
  }

  // Delete file from Supabase storage
  static async deleteFile(filePath: string, bucket: string = 'note-attachments'): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath])

      if (error) {
        // eslint-disable-next-line no-console
console.error('Delete error', error)
        throw new Error(`Delete failed: ${error.message}`)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('File delete failed', error)
      Alert.alert('Delete Error', 'Failed to delete file')
      throw error
    }
  }

  // Get file info
  static async getFileInfo(filePath: string, bucket: string = 'note-attachments') {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(filePath.split('/')[0], {
          search: filePath.split('/').pop()
        })

      if (error) {
        // eslint-disable-next-line no-console
console.error('Get file info error', error)
        throw new Error(`Get file info failed: ${error.message}`)
      }

      return data?.[0] || null
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('Get file info failed', error)
      throw error
    }
  }

  // Test file upload functionality
  static async testUpload(): Promise<boolean> {
    try {
      // eslint-disable-next-line no-console
console.log('Testing file upload functionality...')
      
      // Test if bucket exists and is accessible
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        // eslint-disable-next-line no-console
console.error('Error listing buckets', bucketsError)
        return false
      }

      const noteAttachmentsBucket = buckets.find(bucket => bucket.name === 'note-attachments')
      
      if (!noteAttachmentsBucket) {
        // eslint-disable-next-line no-console
console.error('note-attachments bucket not found')
        return false
      }

      // eslint-disable-next-line no-console
console.log('✅ note-attachments bucket found')
      // eslint-disable-next-line no-console
console.log('✅ File upload service is ready')
      
      return true
    } catch (error) {
      // eslint-disable-next-line no-console
console.error('File upload test failed', error)
      return false
    }
  }

  // Get public URL for a file
  static getFileUrl(filePath: string, bucket: string = 'note-attachments'): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
    return data.publicUrl
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService()