import { useState, useCallback } from 'react'
import { Alert, Platform, PermissionsAndroid } from 'react-native'
import { fileUploadService, FileUploadResult } from '../services/fileUpload'

// Note: These libraries require native configuration, providing interface here
// import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker'
// import { DocumentPickerResponse, pick } from 'react-native-document-picker'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([])

  // Request camera permission
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'AuroraNotes needs access to your camera to take photos for notes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch (err) {
        console.warn(err)
        return false
      }
    }
    return true
  }, [])

  // Request storage permission
  const requestStoragePermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'AuroraNotes needs access to your storage to select files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch (err) {
        console.warn(err)
        return false
      }
    }
    return true
  }, [])

  // Pick image from gallery
  const pickImageFromGallery = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      const hasPermission = await requestStoragePermission()
      if (!hasPermission) {
        Alert.alert('Permission Needed', 'Storage permission is required to select images')
        return null
      }

      // You need actual image picker implementation
      // const result: ImagePickerResponse = await launchImageLibrary({
      //   mediaType: 'photo',
      //   quality: 0.8,
      //   maxWidth: 1920,
      //   maxHeight: 1080,
      // })

      // Mock implementation - replace when actually using
      Alert.alert(
        'Image Picker', 
        'Image picker not implemented yet. Please implement react-native-image-picker and uncomment the code below.',
        [
          { text: 'OK' }
        ]
      )
      return null

      // Actual implementation (uncomment and configure native dependencies to use)
      // if (result.assets && result.assets[0]) {
      //   const asset = result.assets[0]
      //   setUploading(true)
      //   
      //   const uploadResult = await fileUploadService.uploadImage(
      //     asset.uri!,
      //     asset.fileName || `image_${Date.now()}.jpg`
      //   )
      //   
      //   setUploadedFiles(prev => [...prev, uploadResult])
      //   setUploading(false)
      //   return uploadResult
      // }
    } catch (error) {
      console.error('Image picker error', error)
      Alert.alert('Error', 'Failed to pick image')
      setUploading(false)
      return null
    }
  }, [requestStoragePermission])

  // Take photo
  const takePhoto = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      const hasPermission = await requestCameraPermission()
      if (!hasPermission) {
        Alert.alert('Permission Needed', 'Camera permission is required to take photos')
        return null
      }

      // You need actual camera implementation
      // const result: ImagePickerResponse = await launchCamera({
      //   mediaType: 'photo',
      //   quality: 0.8,
      //   maxWidth: 1920,
      //   maxHeight: 1080,
      // })

      // Mock implementation
      Alert.alert(
        'Camera', 
        'Camera not implemented yet. Please implement react-native-image-picker and uncomment the code below.',
        [
          { text: 'OK' }
        ]
      )
      return null

      // Actual implementation (uncomment and configure native dependencies to use)
      // if (result.assets && result.assets[0]) {
      //   const asset = result.assets[0]
      //   setUploading(true)
      //   
      //   const uploadResult = await fileUploadService.uploadImage(
      //     asset.uri!,
      //     asset.fileName || `photo_${Date.now()}.jpg`
      //   )
      //   
      //   setUploadedFiles(prev => [...prev, uploadResult])
      //   setUploading(false)
      //   return uploadResult
      // }
    } catch (error) {
      console.error('Camera error', error)
      Alert.alert('Error', 'Failed to take photo')
      setUploading(false)
      return null
    }
  }, [requestCameraPermission])

  // Pick document
  const pickDocument = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      const hasPermission = await requestStoragePermission()
      if (!hasPermission) {
        Alert.alert('Permission Needed', 'Storage permission is required to select documents')
        return null
      }

      // You need actual document picker implementation
      // const result: DocumentPickerResponse[] = await pick({
      //   type: [DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
      //   allowMultiSelection: false,
      // })

      // Mock implementation
      Alert.alert(
        'Document Picker', 
        'Document picker not implemented yet. Please implement react-native-document-picker and uncomment the code below.',
        [
          { text: 'OK' }
        ]
      )
      return null

      // Actual implementation (uncomment and configure native dependencies to use)
      // if (result && result[0]) {
      //   const file = result[0]
      //   setUploading(true)
      //   
      //   const uploadResult = await fileUploadService.uploadDocument(
      //     file.uri,
      //     file.name,
      //     file.type || 'application/octet-stream'
      //   )
      //   
      //   setUploadedFiles(prev => [...prev, uploadResult])
      //   setUploading(false)
      //   return uploadResult
      // }
    } catch (error) {
      console.error('Document picker error', error)
      Alert.alert('Error', 'Failed to pick document')
      setUploading(false)
      return null
    }
  }, [requestStoragePermission])

  // Upload file
  const uploadFile = useCallback(async (
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<FileUploadResult | null> => {
    try {
      setUploading(true)

      let uploadResult: FileUploadResult
      
      if (mimeType.startsWith('image/')) {
        uploadResult = await fileUploadService.uploadImage(fileUri, fileName)
      } else {
        uploadResult = await fileUploadService.uploadDocument(fileUri, fileName, mimeType)
      }

      setUploadedFiles(prev => [...prev, uploadResult])
      setUploading(false)
      return uploadResult
    } catch (error) {
      console.error('Upload error', error)
      Alert.alert('Upload Error', 'Failed to upload file')
      setUploading(false)
      return null
    }
  }, [])

  // Delete file
  const deleteFile = useCallback(async (file: FileUploadResult) => {
    try {
      await fileUploadService.deleteFile(file.path)
      setUploadedFiles(prev => prev.filter(f => f.path !== file.path))
      Alert.alert('Success', 'File deleted successfully')
    } catch (error) {
      console.error('Delete error', error)
      Alert.alert('Delete Error', 'Failed to delete file')
    }
  }, [])

  // Clear all files
  const clearFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  return {
    uploading,
    uploadedFiles,
    pickImageFromGallery,
    takePhoto,
    pickDocument,
    uploadFile,
    deleteFile,
    clearFiles,
  }
}