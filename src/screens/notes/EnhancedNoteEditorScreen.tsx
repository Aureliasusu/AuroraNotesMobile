import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native'
import { useNotes } from '../../hooks/useNotes'
import { useAnalysis } from '../../hooks/useAnalysis'
import { useFileUpload } from '../../hooks/useFileUpload'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { FileUpload } from '../../components/ui/FileUpload'
import { FileUploadResult } from '../../services/fileUpload'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface EnhancedNoteEditorScreenProps {
  noteId?: string
  onSave: () => void
  onCancel: () => void
}

export const EnhancedNoteEditorScreen: React.FC<EnhancedNoteEditorScreenProps> = ({
  noteId,
  onSave,
  onCancel,
}) => {
  const { notes, createNote, updateNote, selectedNote } = useNotes()
  const { analyzeNote, loading: analysisLoading } = useAnalysis()
  const { pickImageFromGallery, takePhoto, pickDocument, uploading: fileUploading } = useFileUpload()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [analysisSuggestions, setAnalysisSuggestions] = useState<any>(null)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<FileUploadResult[]>([])

  const isEditing = !!noteId
  const currentNote = isEditing ? selectedNote || notes.find(n => n.id === noteId) : null
  const loading = analysisLoading || fileUploading

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
      setTags(currentNote.tags.join(', '))
    }
  }, [currentNote])

  // Handle save note
  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please enter a title or content')
      return
    }

    setIsSaving(true)
    try {
      const noteData = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        attachments: attachedFiles.map(file => ({
          url: file.url,
          name: file.name,
          type: file.type,
          size: file.size
        }))
      }

      if (isEditing && currentNote) {
        await updateNote(currentNote.id, noteData)
      } else {
        await createNote(noteData as any)
      }

      onSave()
    } catch (error) {
      console.error('Save error', error)
      Alert.alert('Save Error', 'Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle content analysis
  const handleContentAnalysis = async () => {
    if (!content.trim()) {
      Alert.alert('No Content', 'Please enter some content to analyze')
      return
    }

    try {
      const analysis = await analyzeNote('temp-id', content)
      setAnalysisSuggestions(analysis)
    } catch (error) {
      console.error('Content analysis error', error)
      Alert.alert('Analysis Error', 'Failed to analyze note')
    }
  }

  // Handle file selection
  const handleFileSelect = (file: FileUploadResult) => {
    setAttachedFiles(prev => [...prev, file])
    setShowFileUpload(false)
  }

  // Handle file removal
  const handleFileRemove = (filePath: string) => {
    setAttachedFiles(prev => prev.filter(file => file.path !== filePath))
  }

  // Handle image picker
  const handlePickImage = async () => {
    const result = await pickImageFromGallery()
    if (result) {
      setAttachedFiles(prev => [...prev, result])
    }
  }

  // Handle camera
  const handleTakePhoto = async () => {
    const result = await takePhoto()
    if (result) {
      setAttachedFiles(prev => [...prev, result])
    }
  }

  // Handle document picker
  const handlePickDocument = async () => {
    const result = await pickDocument()
    if (result) {
      setAttachedFiles(prev => [...prev, result])
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Icon name="close" size={24} color="colors.text.tertiary" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Note' : 'New Note'}
          </Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <Input
            placeholder="Note title..."
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />

          {/* Content Input */}
          <TextInput
            style={styles.contentInput}
            placeholder="Start writing your note..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* Tags Input */}
          <Input
            placeholder="Tags (comma separated)..."
            value={tags}
            onChangeText={setTags}
            style={styles.tagsInput}
          />

          {/* Content Analysis Section */}
          <Card style={styles.analysisSection}>
            <View style={styles.analysisHeader}>
              <Icon name="psychology" size={20} color="#8b5cf6" />
              <Text style={styles.analysisTitle}>Content Analysis</Text>
            </View>
            <Button
              title="Analyze Note"
              onPress={handleContentAnalysis}
              loading={analysisLoading}
              style={styles.analysisButton}
            />
            
            {analysisSuggestions && (
              <View style={styles.analysisResults}>
                <Text style={styles.analysisResultTitle}>Analysis Results:</Text>
                <Text style={styles.analysisResultText}>
                  Summary: {analysisSuggestions.summary}
                </Text>
                <Text style={styles.analysisResultText}>
                  Keywords: {analysisSuggestions.keywords?.join(', ')}
                </Text>
                <Text style={styles.analysisResultText}>
                  Suggested Tags: {analysisSuggestions.suggestedTags?.join(', ')}
                </Text>
              </View>
            )}
          </Card>

          {/* File Upload Section */}
          <Card style={styles.fileSection}>
            <View style={styles.fileHeader}>
              <Icon name="attach-file" size={20} color="colors.primary[500]" />
              <Text style={styles.fileTitle}>Attachments</Text>
              <TouchableOpacity onPress={() => setShowFileUpload(true)}>
                <Icon name="add" size={20} color="colors.primary[500]" />
              </TouchableOpacity>
            </View>

            {/* Quick Upload Buttons */}
            <View style={styles.quickUploadButtons}>
              <TouchableOpacity 
                style={styles.quickUploadButton}
                onPress={handlePickImage}
                disabled={fileUploading}
              >
                <Icon name="photo-library" size={16} color="colors.primary[500]" />
                <Text style={styles.quickUploadText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickUploadButton}
                onPress={handleTakePhoto}
                disabled={fileUploading}
              >
                <Icon name="camera-alt" size={16} color="#10b981" />
                <Text style={styles.quickUploadText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickUploadButton}
                onPress={handlePickDocument}
                disabled={fileUploading}
              >
                <Icon name="description" size={16} color="#f59e0b" />
                <Text style={styles.quickUploadText}>Document</Text>
              </TouchableOpacity>
            </View>

            {/* Attached Files */}
            {attachedFiles.length > 0 && (
              <View style={styles.attachedFiles}>
                <Text style={styles.attachedFilesTitle}>
                  Attached Files ({attachedFiles.length})
                </Text>
                {attachedFiles.map((file, index) => (
                  <View key={index} style={styles.attachedFile}>
                    <Icon name="attach-file" size={16} color="colors.text.tertiary" />
                    <Text style={styles.attachedFileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleFileRemove(file.path)}>
                      <Icon name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </Card>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* File Upload Modal */}
      <FileUpload
        visible={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onFileSelect={handleFileSelect}
        allowMultiple={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'colors.gray[50]',
  },
  keyboardView: {
    flex: 1,
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
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'colors.text.primary',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'colors.primary[500]',
    borderRadius: 6,
  },
  disabledButton: {
    backgroundColor: 'colors.gray[300]',
  },
  saveButtonText: {
    color: 'colors.background.primary',
    fontSize: 14,
    fontWeight: '500',
  },

  // Content styles
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  contentInput: {
    minHeight: 200,
    padding: 16,
    backgroundColor: 'colors.background.primary',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'colors.gray[300]',
    fontSize: 16,
    color: 'colors.text.primary',
    marginBottom: 16,
  },
  tagsInput: {
    marginBottom: 16,
  },

  // Analysis section styles
  analysisSection: {
    marginBottom: 16,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  analysisTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'colors.text.secondary',
  },
  analysisButton: {
    marginBottom: 12,
  },
  analysisResults: {
    padding: 12,
    backgroundColor: 'colors.gray[100]',
    borderRadius: 6,
  },
  analysisResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'colors.text.secondary',
    marginBottom: 8,
  },
  analysisResultText: {
    fontSize: 12,
    color: 'colors.text.tertiary',
    marginBottom: 4,
  },

  // File section styles
  fileSection: {
    marginBottom: 16,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'colors.text.secondary',
  },
  quickUploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickUploadButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'colors.gray[100]',
    borderRadius: 8,
    minWidth: 80,
  },
  quickUploadText: {
    marginTop: 4,
    fontSize: 12,
    color: 'colors.text.secondary',
  },
  attachedFiles: {
    marginTop: 8,
  },
  attachedFilesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'colors.text.secondary',
    marginBottom: 8,
  },
  attachedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'colors.gray[50]',
    borderRadius: 6,
    marginBottom: 4,
  },
  attachedFileName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: 'colors.text.tertiary',
  },

  // Loading styles
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: 'colors.text.tertiary',
  },
})
