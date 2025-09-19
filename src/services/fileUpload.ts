import { supabase } from '../lib/supabase';
import { Platform, Alert } from 'react-native';

export interface FileUploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
  name: string;
}

export class FileUploadService {
  // Upload image to Supabase Storage
  static async uploadImage(
    fileUri: string,
    fileName: string,
    bucket: string = 'note-attachments'
  ): Promise<FileUploadResult> {
    try {
      // Read file content
      const response = await fetch(fileUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop() || 'jpg';
      const uniqueFileName = `images/${timestamp}-${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
        size: blob.size,
        type: `image/${fileExtension}`,
        name: fileName,
      };
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Upload Error', 'Failed to upload image');
      throw error;
    }
  }

  // Upload document to Supabase Storage
  static async uploadDocument(
    fileUri: string,
    fileName: string,
    mimeType: string,
    bucket: string = 'note-attachments'
  ): Promise<FileUploadResult> {
    try {
      // Read file content
      const response = await fetch(fileUri);
      const blob = await response.blob();
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop() || 'pdf';
      const uniqueFileName = `documents/${timestamp}-${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
        });

      if (error) {
        console.error('Document upload error:', error);
        throw new Error(`Document upload failed: ${error.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
        size: blob.size,
        type: mimeType,
        name: fileName,
      };
    } catch (error) {
      console.error('Document upload failed:', error);
      Alert.alert('Upload Error', 'Failed to upload document');
      throw error;
    }
  }

  // Delete file
  static async deleteFile(path: string, bucket: string = 'note-attachments'): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('Delete error:', error);
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('File deletion failed:', error);
      Alert.alert('Delete Error', 'Failed to delete file');
      throw error;
    }
  }

  // Get file list
  static async getFileList(bucket: string = 'note-attachments', folder?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '', {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error('List files error:', error);
        throw new Error(`List files failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Get file list failed:', error);
      throw error;
    }
  }

  // Get file URL
  static getFileUrl(path: string, bucket: string = 'note-attachments'): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  // Create storage bucket (if not exists)
  static async createBucket(bucketName: string, isPublic: boolean = true) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
      });

      if (error) {
        console.error('Create bucket error:', error);
        throw new Error(`Create bucket failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create bucket failed:', error);
      throw error;
    }
  }
}
