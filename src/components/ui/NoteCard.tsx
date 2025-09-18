import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Card } from './Card';
import { Note } from '../../hooks/useNotes';

interface NoteCardProps extends TouchableOpacityProps {
  note: Note;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPress,
  onLongPress,
  ...props
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('zh-CN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getPreview = (content: string) => {
    return content.length > 100 
      ? content.substring(0, 100) + '...' 
      : content;
  };

  return (
    <Card
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      variant="elevated"
      {...props}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {note.title || 'Untitled'}
        </Text>
        {note.is_pinned && (
          <View style={styles.pinIcon}>
            <Text style={styles.pinText}>📌</Text>
          </View>
        )}
      </View>

      <Text style={styles.preview} numberOfLines={3}>
        {getPreview(note.content)}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {formatDate(note.updated_at)}
        </Text>
        
        {note.tags && note.tags.length > 0 && (
          <View style={styles.tags}>
            {note.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {note.tags.length > 3 && (
              <Text style={styles.moreTags}>+{note.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    marginHorizontal: 4,
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
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  pinIcon: {
    padding: 2,
  },
  pinText: {
    fontSize: 12,
  },
  preview: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  tagText: {
    fontSize: 10,
    color: '#6b7280',
  },
  moreTags: {
    fontSize: 10,
    color: '#9ca3af',
    marginLeft: 4,
  },
});
