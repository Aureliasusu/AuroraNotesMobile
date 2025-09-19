import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../../hooks/useNotes';
import { useAuthStore } from '../../store/useAuthStore';
import { NoteCard } from '../../components/ui/NoteCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { FloatingActionButton } from '../../components/ui/FloatingActionButton';
import { Button } from '../../components/ui/Button';

export const NotesListScreen: React.FC = () => {
  const { 
    notes, 
    loading, 
    fetchNotes, 
    setSelectedNote, 
    deleteNote,
    searchNotes,
    pinnedNotes,
    activeNotes 
  } = useNotes();
  const { user, signOut } = useAuthStore();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

  const handleNotePress = (note: any) => {
    setSelectedNote(note);
    navigation.navigate('NoteEditor' as never, { noteId: note.id } as never);
  };

  const handleCreateNote = () => {
    navigation.navigate('NoteEditor' as never, {} as never);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await searchNotes(query);
  };

  const handleDeleteNote = (note: any) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            await deleteNote(note.id);
          }
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: signOut
        },
      ]
    );
  };

  const filteredNotes = showPinnedOnly ? pinnedNotes : activeNotes;
  const displayNotes = searchQuery ? notes : filteredNotes;

  const renderNoteItem = ({ item }: { item: any }) => (
    <NoteCard
      note={item}
      onPress={() => handleNotePress(item)}
      onLongPress={() => handleDeleteNote(item)}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading notes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>My Notes</Text>
            <Text style={styles.headerSubtitle}>
              {displayNotes.length} notes
            </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search notes..."
      />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, !showPinnedOnly && styles.activeTab]}
          onPress={() => setShowPinnedOnly(false)}
        >
          <Text style={[styles.filterText, !showPinnedOnly && styles.activeFilterText]}>
            All ({activeNotes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, showPinnedOnly && styles.activeTab]}
          onPress={() => setShowPinnedOnly(true)}
        >
          <Text style={[styles.filterText, showPinnedOnly && styles.activeFilterText]}>
            Pinned ({pinnedNotes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      {displayNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery 
              ? 'Try using different keywords to search' 
              : 'Tap the + button in the bottom right to create your first note'
            }
          </Text>
          {!searchQuery && (
            <Button
              title="Create Note"
              onPress={handleCreateNote}
              style={styles.createButton}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={displayNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCreateNote} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    minWidth: 120,
  },
});