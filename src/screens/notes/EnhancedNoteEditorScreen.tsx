import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNotes } from '../../hooks/useNotes';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';
import { useFileUpload } from '../../hooks/useFileUpload';
import { useThirdPartyAPIs } from '../../hooks/useThirdPartyAPIs';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface EnhancedNoteEditorScreenProps {
  noteId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export const EnhancedNoteEditorScreen: React.FC<EnhancedNoteEditorScreenProps> = ({
  noteId,
  onSave,
  onCancel,
}) => {
  const { notes, createNote, updateNote, selectedNote, setSelectedNote } = useNotes();
  const { analyzeNote, generateSummary, extractKeywords, suggestTags, loading: aiLoading } = useAIAnalysis();
  const { pickImageFromGallery, takePhoto, pickDocument, uploadedFiles, uploading: fileUploading } = useFileUpload();
  const { processText, loading: apiLoading } = useThirdPartyAPIs();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const isEditing = !!noteId;
  const currentNote = isEditing ? selectedNote || notes.find(n => n.id === noteId) : null;
  const loading = aiLoading || fileUploading || apiLoading;

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags.join(', '));
    }
  }, [currentNote]);

  // AI note analysis
  const handleAIAnalysis = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content to analyze');
      return;
    }

    try {
      const suggestions = await processText(content);
      setAiSuggestions(suggestions);
      Alert.alert('AI Analysis Complete', 'Check the suggestions below');
    } catch (error) {
      Alert.alert('Analysis Error', 'Failed to analyze content');
    }
  };

  // Apply AI suggestions
  const applyAISuggestions = () => {
    if (aiSuggestions) {
      if (aiSuggestions.tags && aiSuggestions.tags.length > 0) {
        const existingTags = tags ? tags.split(',').map(t => t.trim()) : [];
        const newTags = [...new Set([...existingTags, ...aiSuggestions.tags])];
        setTags(newTags.join(', '));
      }
    }
  };

  // Pick image from gallery
  const handlePickImage = async () => {
    try {
      const result = await pickImageFromGallery();
      if (result) {
        Alert.alert('Success', 'Image uploaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  // Take photo
  const handleTakePhoto = async () => {
    try {
      const result = await takePhoto();
      if (result) {
        Alert.alert('Success', 'Photo uploaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Pick document
  const handlePickDocument = async () => {
    try {
      const result = await pickDocument();
      if (result) {
        Alert.alert('Success', 'Document uploaded successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  // Save note
  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Error', 'Please enter a title or content');
      return;
    }

    setIsSaving(true);

    try {
      const noteData = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        attachments: uploadedFiles.map(file => ({
          url: file.url,
          name: file.name,
          type: file.type,
        })),
      };

      if (isEditing && currentNote) {
        await updateNote(currentNote.id, {
          ...currentNote,
          ...noteData,
          updated_at: new Date().toISOString(),
        });
      } else {
        await createNote(noteData);
      }

      Alert.alert('Success', isEditing ? 'Note updated' : 'Note created');
      onSave?.();
    } catch (error) {
      Alert.alert('Error', 'Save failed, please try again');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Confirm',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Continue Editing', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: onCancel },
        ]
      );
    } else {
      onCancel?.();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>
            {isEditing ? 'Edit Note' : 'New Note'}
          </Text>
          
          <Button
            title="Save"
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            size="sm"
            style={styles.saveButton}
          />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Form */}
          <Card style={styles.formCard}>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title..."
              style={styles.titleInput}
              maxLength={100}
            />

            <View style={styles.contentContainer}>
              <Text style={styles.contentLabel}>Content</Text>
              <TextInput
                style={styles.contentInput}
                value={content}
                onChangeText={setContent}
                placeholder="Start writing..."
                multiline
                textAlignVertical="top"
                maxLength={10000}
              />
            </View>

            <Input
              label="Tags"
              value={tags}
              onChangeText={setTags}
              placeholder="Separate tags with commas..."
              style={styles.tagsInput}
            />
          </Card>

          {/* AI Analysis */}
          <Card style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiTitle}>AI Analysis</Text>
              <Button
                title="Analyze"
                onPress={handleAIAnalysis}
                loading={loading}
                disabled={loading || !content.trim()}
                size="sm"
                variant="outline"
              />
            </View>

            {aiSuggestions && (
              <View style={styles.aiSuggestions}>
                <Text style={styles.suggestionTitle}>Suggestions:</Text>
                
                {aiSuggestions.summary && (
                  <View style={styles.suggestionItem}>
                    <Text style={styles.suggestionLabel}>Summary:</Text>
                    <Text style={styles.suggestionText}>{aiSuggestions.summary}</Text>
                  </View>
                )}

                {aiSuggestions.keywords && aiSuggestions.keywords.length > 0 && (
                  <View style={styles.suggestionItem}>
                    <Text style={styles.suggestionLabel}>Keywords:</Text>
                    <Text style={styles.suggestionText}>{aiSuggestions.keywords.join(', ')}</Text>
                  </View>
                )}

                {aiSuggestions.sentiment && (
                  <View style={styles.suggestionItem}>
                    <Text style={styles.suggestionLabel}>Sentiment:</Text>
                    <Text style={styles.suggestionText}>{aiSuggestions.sentiment}</Text>
                  </View>
                )}

                {aiSuggestions.tags && aiSuggestions.tags.length > 0 && (
                  <View style={styles.suggestionItem}>
                    <Text style={styles.suggestionLabel}>Suggested Tags:</Text>
                    <Text style={styles.suggestionText}>{aiSuggestions.tags.join(', ')}</Text>
                    <Button
                      title="Apply Tags"
                      onPress={applyAISuggestions}
                      size="sm"
                      variant="ghost"
                      style={styles.applyButton}
                    />
                  </View>
                )}
              </View>
            )}
          </Card>

          {/* File Upload */}
          <Card style={styles.uploadCard}>
            <Text style={styles.uploadTitle}>Attachments</Text>
            
            <View style={styles.uploadButtons}>
              <Button
                title="📷 Gallery"
                onPress={handlePickImage}
                loading={fileUploading}
                disabled={fileUploading}
                size="sm"
                variant="outline"
                style={styles.uploadButton}
              />
              <Button
                title="📸 Camera"
                onPress={handleTakePhoto}
                loading={fileUploading}
                disabled={fileUploading}
                size="sm"
                variant="outline"
                style={styles.uploadButton}
              />
              <Button
                title="📄 Document"
                onPress={handlePickDocument}
                loading={fileUploading}
                disabled={fileUploading}
                size="sm"
                variant="outline"
                style={styles.uploadButton}
              />
            </View>

            {uploadedFiles.length > 0 && (
              <View style={styles.uploadedFiles}>
                <Text style={styles.uploadedFilesTitle}>Uploaded Files:</Text>
                {uploadedFiles.map((file, index) => (
                  <View key={index} style={styles.uploadedFile}>
                    <Text style={styles.uploadedFileName}>{file.name}</Text>
                    <Text style={styles.uploadedFileType}>{file.type}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          {/* Note Info */}
          {currentNote && (
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Note Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created:</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentNote.created_at).toLocaleString('en-US')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Modified:</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentNote.updated_at).toLocaleString('en-US')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Word Count:</Text>
                <Text style={styles.infoValue}>
                  {content.length} / 10,000
                </Text>
              </View>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    minWidth: 60,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  contentContainer: {
    marginBottom: 16,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 200,
    textAlignVertical: 'top',
  },
  tagsInput: {
    marginBottom: 0,
  },
  aiCard: {
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  aiSuggestions: {
    marginTop: 12,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  suggestionItem: {
    marginBottom: 12,
  },
  suggestionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  applyButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  uploadCard: {
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  uploadButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  uploadButton: {
    flex: 1,
    minWidth: 100,
  },
  uploadedFiles: {
    marginTop: 12,
  },
  uploadedFilesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  uploadedFile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    marginBottom: 4,
  },
  uploadedFileName: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  uploadedFileType: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
});
