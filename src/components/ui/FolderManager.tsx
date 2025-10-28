import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useFolders } from '../../hooks/useFolders'
import { Folder } from '../../types/database'
import { colors } from '../../constants/colors'

interface FolderManagerProps {
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onAddNotesToFolder?: (folderId: string, folderName: string) => void
}

interface FolderItemProps {
  folder: Folder
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onAddNotes?: () => void
}

// Folder color options
const FOLDER_COLORS = [
  'colors.primary[500]', 'colors.error[500]', 'colors.success[500]', 'colors.warning[500]', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
]

// Single folder item component
const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onAddNotes
}) => {
  return (
    <View style={styles.folderItem}>
      <TouchableOpacity
        style={[
          styles.folderButton,
          isSelected && styles.selectedFolderButton
        ]}
        onPress={onSelect}
      >
        <View style={[styles.folderIcon, { backgroundColor: folder.color }]} />
        <Text style={[
          styles.folderName,
          isSelected && styles.selectedFolderName
        ]}>
          {folder.name}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.folderActions}>
        {onAddNotes && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAddNotes}
          >
            <Icon name="add" size={16} color="colors.success[500]" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
        >
          <Icon name="edit" size={16} color="colors.text.tertiary" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
        >
          <Icon name="delete" size={16} color="colors.error[500]" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Folder create/edit modal
interface FolderModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: { name: string; color: string }) => void
  initialData?: { name: string; color: string }
  title: string
  loading: boolean
}

const FolderModal: React.FC<FolderModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  title,
  loading
}) => {
  const [name, setName] = useState(initialData?.name || '')
  const [selectedColor, setSelectedColor] = useState(initialData?.color || FOLDER_COLORS[0])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setSelectedColor(initialData.color)
    } else {
      setName('')
      setSelectedColor(FOLDER_COLORS[0])
    }
  }, [initialData, visible])

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter folder name')
      return
    }
    onSubmit({ name: name.trim(), color: selectedColor })
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="colors.text.tertiary" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Folder Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter folder name"
              placeholderTextColor="colors.text.quaternary"
              maxLength={50}
            />

            <Text style={styles.inputLabel}>Choose Color</Text>
            <View style={styles.colorPicker}>
              {FOLDER_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="colors.background.primary" />
              ) : (
                <Text style={styles.submitButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Main folder manager component
export const FolderManager: React.FC<FolderManagerProps> = ({
  selectedFolderId,
  onFolderSelect,
  onAddNotesToFolder
}) => {
  const {
    folders,
    loading,
    createFolder,
    updateFolder,
    deleteFolder
  } = useFolders()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null)

  // Handle create folder
  const handleCreateFolder = async (data: { name: string; color: string }) => {
    const result = await createFolder(data)
    if (result) {
      setShowCreateModal(false)
    }
  }

  // Handle edit folder
  const handleUpdateFolder = async (data: { name: string; color: string }) => {
    if (!editingFolder) return
    
    const result = await updateFolder(editingFolder.id, data)
    if (result) {
      setEditingFolder(null)
    }
  }

  // Handle delete folder
  const handleDeleteFolder = (folder: Folder) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete folder "${folder.name}"? Notes in this folder will be moved to unorganized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteFolder(folder.id)
        }
      ]
    )
  }

  // Handle add notes to folder
  const handleAddNotesToFolder = (folder: Folder) => {
    if (onAddNotesToFolder) {
      onAddNotesToFolder(folder.id, folder.name)
    }
  }

  return (
    <View style={styles.container}>
      {/* Special folder options */}
      <TouchableOpacity
        style={[
          styles.specialFolderButton,
          selectedFolderId === null && styles.selectedSpecialFolderButton
        ]}
        onPress={() => onFolderSelect(null)}
      >
        <Icon name="folder" size={20} color="colors.text.tertiary" />
        <Text style={[
          styles.specialFolderText,
          selectedFolderId === null && styles.selectedSpecialFolderText
        ]}>
          All Notes
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.specialFolderButton,
          selectedFolderId === 'starred' && styles.selectedSpecialFolderButton
        ]}
        onPress={() => onFolderSelect('starred')}
      >
        <Icon name="star" size={20} color="colors.warning[500]" />
        <Text style={[
          styles.specialFolderText,
          selectedFolderId === 'starred' && styles.selectedSpecialFolderText
        ]}>
          Starred Notes
        </Text>
      </TouchableOpacity>

      {/* Folders list */}
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FolderItem
            folder={item}
            isSelected={selectedFolderId === item.id}
            onSelect={() => onFolderSelect(item.id)}
            onEdit={() => setEditingFolder(item)}
            onDelete={() => handleDeleteFolder(item)}
            onAddNotes={onAddNotesToFolder ? () => handleAddNotesToFolder(item) : undefined}
          />
        )}
        style={styles.foldersList}
        showsVerticalScrollIndicator={false}
      />

      {/* Create new folder button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setShowCreateModal(true)}
      >
        <Icon name="add" size={20} color="colors.primary[500]" />
        <Text style={styles.createButtonText}>New Folder</Text>
      </TouchableOpacity>

      {/* Create folder modal */}
      <FolderModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFolder}
        title="Create Folder"
        loading={loading}
      />

      {/* Edit folder modal */}
      <FolderModal
        visible={!!editingFolder}
        onClose={() => setEditingFolder(null)}
        onSubmit={handleUpdateFolder}
        initialData={editingFolder ? { name: editingFolder.name, color: editingFolder.color } : undefined}
        title="Edit Folder"
        loading={loading}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'colors.gray[50]',
  },
  
  // Special folder styles
  specialFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'colors.background.primary',
  },
  selectedSpecialFolderButton: {
    backgroundColor: 'colors.primary[100]',
  },
  specialFolderText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'colors.text.secondary',
    fontWeight: '500',
  },
  selectedSpecialFolderText: {
    color: 'colors.primary[700]',
    fontWeight: '600',
  },

  // Folders list styles
  foldersList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  
  // Folder item styles
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 2,
    backgroundColor: 'colors.background.primary',
    borderRadius: 8,
  },
  folderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedFolderButton: {
    backgroundColor: 'colors.primary[100]',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  folderIcon: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 12,
  },
  folderName: {
    fontSize: 16,
    color: 'colors.text.secondary',
    fontWeight: '500',
  },
  selectedFolderName: {
    color: 'colors.primary[700]',
    fontWeight: '600',
  },
  
  // Folder action buttons styles
  folderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },

  // Create button styles
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: 'colors.background.primary',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'colors.gray[300]',
    borderStyle: 'dashed',
  },
  createButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'colors.primary[500]',
    fontWeight: '500',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'colors.background.primary',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'colors.border.light',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'colors.text.primary',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'colors.text.secondary',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'colors.gray[300]',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: 'colors.text.primary',
    backgroundColor: 'colors.background.primary',
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: 'colors.gray[800]',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'colors.border.light',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'colors.text.tertiary',
  },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'colors.primary[500]',
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'colors.background.primary',
    fontWeight: '500',
  },
})
