import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useFileUpload } from '../../hooks/useFileUpload'
import { FileUploadResult } from '../../services/fileUpload'
import { colors } from '../../constants/colors'

interface FileUploadProps {
  visible: boolean
  onClose: () => void
  onFileSelect?: (file: FileUploadResult) => void
  onFilesSelect?: (files: FileUploadResult[]) => void
  allowMultiple?: boolean
  acceptedTypes?: string[]
}

interface FileItemProps {
  file: FileUploadResult
  onDelete: () => void
  onSelect?: () => void
}

// File item component
const FileItem: React.FC<FileItemProps> = ({ file, onDelete, onSelect }) => {
  const isImage = file.type.startsWith('image/')
  
  return (
    <TouchableOpacity 
      style={styles.fileItem} 
      onPress={onSelect}
      disabled={!onSelect}
    >
      <View style={styles.fileIcon}>
        {isImage ? (
          <Image source={{ uri: file.url }} style={styles.fileImage} />
        ) : (
          <Icon 
            name={getFileIcon(file.type)} 
            size={24} 
            color="colors.text.tertiary" 
          />
        )}
      </View>
      
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.fileSize}>
          {formatFileSize(file.size)}
        </Text>
        <Text style={styles.fileType}>
          {file.type}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Icon name="delete" size={20} color="colors.error[500]" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

// Get file icon based on type
function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.includes('pdf')) return 'picture-as-pdf'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'description'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'table-chart'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'slideshow'
  if (mimeType.includes('text')) return 'text-snippet'
  return 'attach-file'
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Main file upload component
export const FileUpload: React.FC<FileUploadProps> = ({
  visible,
  onClose,
  onFileSelect,
  onFilesSelect,
  allowMultiple = false,
  acceptedTypes = [] // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const {
    uploading,
    files: uploadedFiles,
    pickImageFromGallery,
    takePhoto,
    pickDocument,
    deleteFile,
    clearFiles
  } = useFileUpload()

  const [selectedFiles, setSelectedFiles] = useState<FileUploadResult[]>([])

  // Handle file selection
  const handleFileSelect = (file: FileUploadResult) => {
    if (allowMultiple) {
      const newSelection = [...selectedFiles, file]
      setSelectedFiles(newSelection)
      if (onFilesSelect) {
        onFilesSelect(newSelection)
      }
    } else {
      if (onFileSelect) {
        onFileSelect(file)
      }
      onClose()
    }
  }

  // Handle file removal from selection
  const handleFileRemove = (file: FileUploadResult) => {
    const newSelection = selectedFiles.filter(f => f.path !== file.path)
    setSelectedFiles(newSelection)
    if (onFilesSelect) {
      onFilesSelect(newSelection)
    }
  }

  // Handle image picker
  const handlePickImage = async () => {
    const result = await pickImageFromGallery()
    if (result) {
      handleFileSelect(result)
    }
  }

  // Handle camera
  const handleTakePhoto = async () => {
    const result = await takePhoto()
    if (result) {
      handleFileSelect(result)
    }
  }

  // Handle document picker
  const handlePickDocument = async () => {
    const result = await pickDocument()
    if (result) {
      handleFileSelect(result)
    }
  }

  // Handle confirm selection
  const handleConfirm = () => {
    if (onFilesSelect && selectedFiles.length > 0) {
      onFilesSelect(selectedFiles)
    }
    onClose()
  }

  // Handle clear all
  const handleClearAll = () => {
    Alert.alert(
      'Clear All Files',
      'Are you sure you want to clear all uploaded files?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            clearFiles()
            setSelectedFiles([])
          }
        }
      ]
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>File Upload</Text>
            {uploadedFiles.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{uploadedFiles.length}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="colors.text.tertiary" />
          </TouchableOpacity>
        </View>

        {/* Upload Options */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Options</Text>
          <View style={styles.uploadButtons}>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handlePickImage}
              disabled={uploading}
            >
              <Icon name="photo-library" size={24} color="colors.primary[500]" />
              <Text style={styles.uploadButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleTakePhoto}
              disabled={uploading}
            >
              <Icon name="camera-alt" size={24} color="colors.success[500]" />
              <Text style={styles.uploadButtonText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handlePickDocument}
              disabled={uploading}
            >
              <Icon name="description" size={24} color="colors.warning[500]" />
              <Text style={styles.uploadButtonText}>Document</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Indicator */}
        {uploading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="colors.primary[500]" />
            <Text style={styles.loadingText}>Uploading file...</Text>
          </View>
        )}

        {/* Files List */}
        <View style={styles.filesSection}>
          <View style={styles.filesHeader}>
            <Text style={styles.sectionTitle}>
              Uploaded Files ({uploadedFiles.length})
            </Text>
            {uploadedFiles.length > 0 && (
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearButton}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          {uploadedFiles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="cloud-upload" size={48} color="colors.gray[300]" />
              <Text style={styles.emptyTitle}>No files uploaded</Text>
              <Text style={styles.emptySubtitle}>
                Use the upload options above to add files
              </Text>
            </View>
          ) : (
            <FlatList
              data={uploadedFiles}
              keyExtractor={(item) => item.path}
              renderItem={({ item }) => (
                <FileItem
                  file={item}
                  onDelete={() => deleteFile(item)}
                  onSelect={allowMultiple ? () => handleFileSelect(item) : undefined}
                />
              )}
              style={styles.filesList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Selected Files (for multiple selection) */}
        {allowMultiple && selectedFiles.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>
              Selected Files ({selectedFiles.length})
            </Text>
            <FlatList
              data={selectedFiles}
              keyExtractor={(item) => item.path}
              renderItem={({ item }) => (
                <FileItem
                  file={item}
                  onDelete={() => handleFileRemove(item)}
                />
              )}
              style={styles.selectedList}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {/* Action Buttons */}
        {allowMultiple && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.confirmButton,
                selectedFiles.length === 0 && styles.disabledButton
              ]}
              onPress={handleConfirm}
              disabled={selectedFiles.length === 0}
            >
              <Text style={styles.confirmButtonText}>
                Select {selectedFiles.length} Files
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'colors.gray[50]',
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'colors.background.primary',
    borderBottomWidth: 1,
    borderBottomColor: 'colors.border.light',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'colors.text.primary',
  },
  countBadge: {
    marginLeft: 8,
    backgroundColor: 'colors.primary[500]',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    color: 'colors.background.primary',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },

  // Upload section styles
  uploadSection: {
    padding: 16,
    backgroundColor: 'colors.background.primary',
    borderBottomWidth: 1,
    borderBottomColor: 'colors.border.light',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'colors.text.secondary',
    marginBottom: 12,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  uploadButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'colors.gray[100]',
    borderRadius: 12,
    minWidth: 80,
  },
  uploadButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: 'colors.text.secondary',
    fontWeight: '500',
  },

  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'colors.background.primary',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'colors.text.tertiary',
  },

  // Files section styles
  filesSection: {
    flex: 1,
    backgroundColor: 'colors.background.primary',
  },
  filesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'colors.border.light',
  },
  clearButton: {
    color: 'colors.error[500]',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'colors.text.secondary',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'colors.text.tertiary',
    textAlign: 'center',
  },
  filesList: {
    flex: 1,
  },

  // File item styles
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'colors.gray[100]',
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'colors.gray[100]',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fileImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: 'colors.text.primary',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: 'colors.text.tertiary',
    marginBottom: 2,
  },
  fileType: {
    fontSize: 12,
    color: 'colors.text.quaternary',
  },
  deleteButton: {
    padding: 8,
  },

  // Selected files styles
  selectedSection: {
    backgroundColor: 'colors.background.primary',
    borderTopWidth: 1,
    borderTopColor: 'colors.border.light',
    padding: 16,
  },
  selectedList: {
    marginTop: 8,
  },

  // Action buttons styles
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'colors.background.primary',
    borderTopWidth: 1,
    borderTopColor: 'colors.border.light',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'colors.gray[100]',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'colors.text.tertiary',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'colors.primary[500]',
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: 'colors.gray[300]',
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'colors.background.primary',
    fontWeight: '500',
  },
})
