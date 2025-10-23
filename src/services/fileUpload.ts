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
        console.error('Delete error', error)
        throw new Error(`Delete failed: ${error.message}`)
      }
    } catch (error) {
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
        console.error('Get file info error', error)
        throw new Error(`Get file info failed: ${error.message}`)
      }

      return data?.[0] || null
    } catch (error) {
      console.error('Get file info failed', error)
      throw error
    }
  }

  // Test file upload functionality
  static async testUpload(): Promise<boolean> {
    try {
      console.log('Testing file upload functionality...')
      
      // Test if bucket exists and is accessible
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      if (bucketsError) {
        console.error('Error listing buckets', bucketsError)
        return false
      }

      const noteAttachmentsBucket = buckets.find(bucket => bucket.name === 'note-attachments')
      
      if (!noteAttachmentsBucket) {
        console.error('note-attachments bucket not found')
        return false
      }

      console.log('✅ note-attachments bucket found')
      console.log('✅ File upload service is ready')
      
      return true
    } catch (error) {
      console.error('File upload test failed', error)
      return false
    }
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService()