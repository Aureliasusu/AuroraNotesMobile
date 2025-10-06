import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNotes } from '../../hooks/useNotes'
import { useAuth } from '../../hooks/useAuth'

interface NoteEditorScreenProps {
  route: {
    params: {
      noteId?: string
    }
  }
  navigation: any
}

export const NoteEditorScreen: React.FC<NoteEditorScreenProps> = ({
  route,
  navigation,
}) => {
  const { noteId } = route.params || {}
  const { user } = useAuth()
  const { createNote, updateNote, getNoteById } = useNotes()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (noteId) {
      loadNote()
    }
  }, [noteId])

  const loadNote = async () => {
    if (!noteId) return
    
    try {
      const note = await getNoteById(noteId)
      if (note) {
        setTitle(note.title)
        setContent(note.content)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load note')
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content')
      return
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save notes')
      return
    }

    setLoading(true)
    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
        tags: [],
        is_archived: false,
        is_pinned: false,
        folder_id: null,
        word_count: content.trim().split(/\s+/).length,
        reading_time: Math.ceil(content.trim().split(/\s+/).length / 200),
      }

      if (noteId) {
        await updateNote(noteId, noteData)
      } else {
        await createNote(noteData)
      }

      navigation.goBack()
    } catch (error) {
      Alert.alert('Error', 'Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note title..."
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Start writing your note..."
            placeholderTextColor="#9ca3af"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
    minHeight: 400,
    paddingVertical: 16,
  },
})