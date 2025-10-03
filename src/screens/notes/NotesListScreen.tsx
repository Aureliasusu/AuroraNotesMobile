import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../../hooks/useNotes';
import { useAuth } from '../../hooks/useAuth';
import { useFolders } from '../../hooks/useFolders';
import { useTheme } from '../../contexts/ThemeContext';
import { NoteCard, SearchBar, FloatingActionButton, FolderManager, AdvancedSearch, ThemeToggle } from '../../components/ui';
import { Note } from '../../types/database';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const NotesListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const {
    notes,
    loading,
    fetchNotes,
    deleteNote,
    togglePin,
    activeNotes,
    pinnedNotes,
    searchNotes,
  } = useNotes();
  const { folders } = useFolders();
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'folder'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showFolderManager, setShowFolderManager] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  useEffect(() => {
    searchNotes(searchQuery);
  }, [searchQuery, searchNotes]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  }, [fetchNotes]);

  const handleNotePress = useCallback((note: Note) => {
    (navigation as any).navigate('NoteEditor', { noteId: note.id });
  }, [navigation]);

  const handleDeleteNote = useCallback((note: Note) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${note.title || 'Untitled'}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(note.id);
            Alert.alert('Success', 'Note deleted successfully');
          },
        },
      ],
      { cancelable: true }
    );
  }, [deleteNote]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: () => signOut() },
      ],
      { cancelable: true }
    );
  };

  // Handle folder selection
  const handleFolderSelect = useCallback((folderId: string | null) => {
    setSelectedFolderId(folderId);
    if (folderId === 'starred') {
      setFilter('pinned');
    } else if (folderId === null) {
      setFilter('all');
    } else {
      setFilter('folder');
    }
  }, []);

  // Handle add notes to folder
  const handleAddNotesToFolder = useCallback((folderId: string, folderName: string) => {
    Alert.alert(
      'Add Notes to Folder',
      `Are you sure you want to add selected notes to "${folderName}" folder?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => {
          // TODO: Implement batch move notes to folder functionality
          Alert.alert('Info', 'This feature will be implemented in future versions');
        }},
      ]
    );
  }, []);

  const renderNoteItem = useCallback(({ item }: { item: Note }) => (
    <NoteCard
      note={item}
      onPress={handleNotePress}
      onLongPress={handleDeleteNote}
    />
  ), [handleNotePress, handleDeleteNote]);

  // Display notes based on current filter conditions
  const getDisplayedNotes = useCallback(() => {
    if (filter === 'pinned') {
      return pinnedNotes;
    } else if (filter === 'folder' && selectedFolderId) {
      return activeNotes.filter((note: Note) => note.folder_id === selectedFolderId);
    } else {
      return activeNotes;
    }
  }, [filter, selectedFolderId, activeNotes, pinnedNotes]);

  const displayedNotes = getDisplayedNotes();

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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>My Notes</Text>
          <TouchableOpacity 
            onPress={() => setShowFolderManager(true)} 
            style={styles.headerButton}
          >
            <Icon name="folder" size={20} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowAdvancedSearch(true)} 
            style={styles.headerButton}
          >
            <Icon name="search" size={20} color="#10b981" />
          </TouchableOpacity>
          <ThemeToggle size={20} style={styles.headerButton} />
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
            onPress={() => handleFolderSelect(null)}
          >
            <Text style={[styles.filterButtonText, filter === 'all' && styles.activeFilterButtonText]}>
              All ({activeNotes.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pinned' && styles.activeFilterButton]}
            onPress={() => handleFolderSelect('starred')}
          >
            <Text style={[styles.filterButtonText, filter === 'pinned' && styles.activeFilterButtonText]}>
              Starred ({pinnedNotes.length})
            </Text>
          </TouchableOpacity>
          {filter === 'folder' && selectedFolderId && (
            <TouchableOpacity
              style={[styles.filterButton, styles.activeFilterButton]}
              onPress={() => setShowFolderManager(true)}
            >
              <Text style={[styles.filterButtonText, styles.activeFilterButtonText]}>
                {folders.find(f => f.id === selectedFolderId)?.name || 'Folder'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {displayedNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No notes found' : 
             filter === 'pinned' ? 'No starred notes' :
             filter === 'folder' ? 'No notes in this folder' : 'No notes yet'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? 'Try using different keywords or clear the search.'
              : filter === 'pinned' ? 'Click the star on notes to star them.'
              : filter === 'folder' ? 'Move notes to this folder or create new notes.'
              : 'Click the + button below to create your first note.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedNotes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      <FloatingActionButton onPress={() => (navigation as any).navigate('NoteEditor')} />

      {/* Folder management modal */}
      <Modal
        visible={showFolderManager}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFolderManager(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Folder Management</Text>
            <TouchableOpacity
              onPress={() => setShowFolderManager(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <FolderManager
            selectedFolderId={selectedFolderId}
            onFolderSelect={(folderId) => {
              handleFolderSelect(folderId);
              setShowFolderManager(false);
            }}
            onAddNotesToFolder={handleAddNotesToFolder}
          />
        </SafeAreaView>
      </Modal>

      {/* Advanced search modal */}
      <AdvancedSearch
        visible={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onNoteSelect={(noteId) => {
          (navigation as any).navigate('NoteEditor', { noteId });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  signOutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeFilterButton: {
    backgroundColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
});