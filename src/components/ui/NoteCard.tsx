import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Note } from '../../types/database'
import { colors } from '../../constants/colors'

interface NoteCardProps {
  note: Note
  onPress: (note: Note) => void
  onLongPress?: (note: Note) => void
  onEdit?: (note: Note) => void
  onDelete?: (note: Note) => void
  onPin?: (note: Note) => void
  onArchive?: (note: Note) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onLongPress,
  onEdit,
  onDelete,
  onPin,
  onArchive,
}) => {
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(note)
    } else {
      Alert.alert(
        'Note Options',
        'What would you like to do with this note?',
        [
          onEdit && { text: 'Edit', onPress: () => onEdit(note) },
          onPin && { text: note.is_pinned ? 'Unpin' : 'Pin', onPress: () => onPin(note) },
          onArchive && { text: note.is_archived ? 'Unarchive' : 'Archive', onPress: () => onArchive(note) },
          onDelete && { text: 'Delete', onPress: () => onDelete(note), style: 'destructive' as const },
          { text: 'Cancel', style: 'cancel' as const },
        ].filter(Boolean) as any
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        note.is_pinned && styles.pinned,
        note.is_archived && styles.archived,
      ]}
      onPress={() => onPress(note)}
      onLongPress={handleLongPress}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {note.title}
        </Text>
        {note.is_pinned && (
          <Icon name="push-pin" size={16} color={colors.primary[500]} style={styles.pinIcon} />
        )}
      </View>
      
      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>
      
      {note.tags && note.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.moreTags}>+{note.tags.length - 3} more</Text>
          )}
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDate(note.updated_at)}
        </Text>
        {note.is_archived && (
          <Icon name="archive" size={14} color={colors.text.tertiary} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pinned: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  archived: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  pinIcon: {
    marginTop: 2,
  },
  content: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  moreTags: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
})