import React, { useState, useEffect, useCallback } from 'react'
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
import { colors } from '../../constants/colors'

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

  const loadNote = useCallback(async () => {
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
  }, [noteId, getNoteById])

  useEffect(() => {
    if (noteId) {
      loadNote()
    }
  }, [noteId, loadNote])

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
            placeholderTextColor="colors.text.quaternary"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Start writing your note..."
            placeholderTextColor="colors.text.quaternary"
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
    backgroundColor: colors.background.primary,
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
    borderBottomColor: colors.border.light,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    backgroundColor: colors.text.quaternary,
  },
  saveButtonText: {
    color: colors.background.primary,
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
    color: colors.text.primary,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: colors.text.primary,
    lineHeight: 24,
    minHeight: 400,
    paddingVertical: 16,
  },
})