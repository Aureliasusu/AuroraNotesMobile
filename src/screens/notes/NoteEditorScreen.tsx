import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNotes } from '../../hooks/useNotes';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface NoteEditorScreenProps {
  noteId?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export const NoteEditorScreen: React.FC<NoteEditorScreenProps> = ({
  noteId,
  onSave,
  onCancel,
}) => {
  const { notes, createNote, updateNote, selectedNote, setSelectedNote } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!noteId;
  const currentNote = isEditing ? selectedNote || notes.find(n => n.id === noteId) : null;

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags.join(', '));
    }
  }, [currentNote]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Tip', 'Please enter a title or content');
      return;
    }

    setIsSaving(true);

    try {
      const noteData = {
        title: title.trim() || 'Untitled',
        content: content.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
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

          {/* Note Info */}
          {currentNote && (
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Note Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created:</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentNote.created_at).toLocaleString('zh-CN')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Modified:</Text>
                <Text style={styles.infoValue}>
                  {new Date(currentNote.updated_at).toLocaleString('zh-CN')}
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
