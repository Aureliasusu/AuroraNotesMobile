import { useState, useCallback } from 'react'
import { Alert, Platform, PermissionsAndroid } from 'react-native'
import { fileUploadService, FileUploadResult } from '../services/fileUpload'

// Note: These libraries require native configuration, providing interface here
// import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker'
// import { DocumentPickerResponse, pick } from 'react-native-document-picker'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<FileUploadResult[]>([])
  const [error, setError] = useState<string | null>(null)

  // camera permission
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

  // storage permission
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

  // pick image
  const pickImageFromGallery = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      const hasPermission = await requestStoragePermission()
      if (!hasPermission) {
        Alert.alert('Permission Needed', 'Storage permission is required to select images')
        return null
      }

      // TODO: implement image picker
      // const result = await launchImageLibrary({
      //   mediaType: 'photo',
      //   quality: 0.8,
      // })

      // mock for now
      Alert.alert('Image Picker', 'Not implemented yet')
      return null

      // real implementation
      // if (result.assets && result.assets[0]) {
      //   const asset = result.assets[0]
      //   setUploading(true)
      //   
      //   const uploadResult = await uploadImage(
      //     asset.uri!,
      //     asset.fileName || `image_${Date.now()}.jpg`
      //   )
      //   
      //   setFiles(prev => [...prev, uploadResult])
      //   setUploading(false)
      //   return uploadResult
      // }
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Failed to pick image')
      setUploading(false)
      return null
    }
  }, [requestStoragePermission])

  // take photo
  const takePhoto = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      const hasPermission = await requestCameraPermission()
      if (!hasPermission) {
        Alert.alert('Permission Needed', 'Camera permission is required to take photos')
        return null
      }

      // TODO: implement camera
      // const result = await launchCamera({
      //   mediaType: 'photo',
      //   quality: 0.8,
      // })

      // mock for now
      Alert.alert('Camera', 'Not implemented yet')
      return null

      // real implementation
      // if (result.assets && result.assets[0]) {
      //   const asset = result.assets[0]
      //   setUploading(true)
      //   
      //   const uploadResult = await uploadImage(
      //     asset.uri!,
      //     asset.fileName || `photo_${Date.now()}.jpg`
      //   )
      //   
      //   setFiles(prev => [...prev, uploadResult])
      //   setUploading(false)
      //   return uploadResult
      // }
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Failed to take photo')
      setUploading(false)
      return null
    }
  }, [requestCameraPermission])

  // pick document
  const pickDocument = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      const hasPermission = await requestStoragePermission()
      if (!hasPermission) {
        Alert.alert('Permission Needed', 'Storage permission is required to select documents')
        return null
      }

      // TODO: implement document picker
      // const result = await pick({
      //   type: [DocumentPicker.types.pdf],
      //   allowMultiSelection: false,
      // })

      // mock for now
      Alert.alert('Document Picker', 'Not implemented yet')
      return null

      // real implementation
      // if (result && result[0]) {
      //   const file = result[0]
      //   setUploading(true)
      //   
      //   const uploadResult = await uploadDocument(file.uri, file.name)
      //   
      //   setFiles(prev => [...prev, uploadResult])
      //   setUploading(false)
      //   return uploadResult
      // }
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Failed to pick document')
      setUploading(false)
      return null
    }
  }, [requestStoragePermission])

  // upload file
  const uploadFile = useCallback(async (
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<FileUploadResult | null> => {
    try {
      setUploading(true)

      let uploadResult: FileUploadResult
      
      if (mimeType && mimeType.startsWith('image/')) {
        uploadResult = await fileUploadService.uploadImage(fileUri, fileName)
      } else {
        uploadResult = await fileUploadService.uploadDocument(fileUri, fileName, mimeType)
      }

      setFiles(prev => [...prev, uploadResult])
      setUploading(false)
      return uploadResult
    } catch (err) {
      console.error('Upload error', err)
      setError('Upload failed')
      Alert.alert('Upload Error', 'Failed to upload file')
      setUploading(false)
      return null
    }
  }, [])

  // delete file
  const deleteFile = useCallback(async (file: FileUploadResult) => {
    try {
      await fileUploadService.deleteFile(file.path)
      setFiles(prev => prev.filter(f => f.path !== file.path))
      Alert.alert('Success', 'File deleted successfully')
    } catch (err) {
      console.error('Delete error', err)
      setError('Delete failed')
      Alert.alert('Delete Error', 'Failed to delete file')
    }
  }, [])

  // clear files
  const clearFiles = useCallback(() => {
    setFiles([])
  }, [])

  return {
    uploading,
    files,
    error,
    pickImageFromGallery,
    takePhoto,
    pickDocument,
    uploadFile,
    deleteFile,
    clearFiles,
  }
}