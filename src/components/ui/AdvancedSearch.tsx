import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useAdvancedSearch } from '../../hooks/useAdvancedSearch'
import { SearchResult } from '../../store/useSearchStore'
import { colors } from '../../constants/colors'

interface AdvancedSearchProps {
  visible: boolean
  onClose: () => void
  onNoteSelect?: (noteId: string) => void
}

interface SearchResultItemProps {
  result: SearchResult
  onPress: () => void
}

// Search result item component
const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, onPress }) => {
  const { note, relevanceScore, highlights } = result

  return (
    <TouchableOpacity style={styles.resultItem} onPress={onPress}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {note.is_pinned && <Icon name="star" size={16} color={colors.warning[500]} />}
          {note.title || 'Untitled'}
        </Text>
        <View style={styles.resultMeta}>
          <Text style={styles.relevanceScore}>
            {Math.round(relevanceScore)}%
          </Text>
        </View>
      </View>
      
      <Text style={styles.resultContent} numberOfLines={2}>
        {highlights.content}
      </Text>
      
      <View style={styles.resultFooter}>
        <View style={styles.tagsContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.moreTags}>+{note.tags.length - 3}</Text>
          )}
        </View>
        
        <Text style={styles.resultDate}>
          {new Date(note.updated_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// Filter section component
interface FilterSectionProps {
  title: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, isExpanded, onToggle }) => (
  <View style={styles.filterSection}>
    <TouchableOpacity style={styles.filterSectionHeader} onPress={onToggle}>
      <Text style={styles.filterSectionTitle}>{title}</Text>
      <Icon 
        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
        size={20} 
        color={colors.text.tertiary} 
      />
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.filterSectionContent}>
        {children}
      </View>
    )}
  </View>
)

// Main advanced search component
export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  visible,
  onClose,
  onNoteSelect
}) => {
  const {
    filters,
    results,
    loading,
    error,
    updateQuery,
    addTag,
    removeTag,
    updateSort,
    updateFolder,
    updatePinned,
    updateArchived,
    clearFilters,
    getAllTags,
    getSearchStats,
    getFolderOptions
  } = useAdvancedSearch()

  const [expandedSections, setExpandedSections] = useState({
    tags: false,
    date: false,
    sort: false,
    filters: false
  })

  const [newTag, setNewTag] = useState('')
  const [availableTags] = useState(getAllTags())
  const [folderOptions] = useState(getFolderOptions())
  const stats = getSearchStats()

  // Toggle filter section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      addTag(newTag.trim())
      setNewTag('')
    }
  }

  // Handle note selection
  const handleNoteSelect = (noteId: string) => {
    if (onNoteSelect) {
      onNoteSelect(noteId)
    }
    onClose()
  }

  // Clear all filters
  const handleClearFilters = () => {
    Alert.alert(
      'Clear Filters',
      'Are you sure you want to clear all search filters?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearFilters }
      ]
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Advanced Search</Text>
            {stats.hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{stats.filterCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="colors.text.tertiary" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Query */}
          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Search Query</Text>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} color="colors.text.tertiary" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={filters.query}
                onChangeText={updateQuery}
                placeholder="Enter search terms..."
                placeholderTextColor={colors.text.quaternary}
                autoFocus
              />
              {filters.query.length > 0 && (
                <TouchableOpacity onPress={() => updateQuery('')}>
                  <Icon name="clear" size={20} color="colors.text.tertiary" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filtersHeader}>
              <Text style={styles.sectionTitle}>Filters</Text>
              {stats.hasActiveFilters && (
                <TouchableOpacity onPress={handleClearFilters}>
                  <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Tags Filter */}
            <FilterSection
              title="Tags"
              isExpanded={expandedSections.tags}
              onToggle={() => toggleSection('tags')}
            >
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Add tag..."
                  placeholderTextColor={colors.text.quaternary}
                  onSubmitEditing={handleAddTag}
                />
                <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
                  <Icon name="add" size={16} color={colors.primary[500]} />
                </TouchableOpacity>
              </View>
              
              {/* Selected Tags */}
              {filters.tags.length > 0 && (
                <View style={styles.selectedTags}>
                  {filters.tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.selectedTag}
                      onPress={() => removeTag(tag)}
                    >
                      <Text style={styles.selectedTagText}>{tag}</Text>
                      <Icon name="close" size={14} color={colors.text.inverse} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Available Tags */}
              <View style={styles.availableTags}>
                {availableTags.slice(0, 10).map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.availableTag,
                      filters.tags.includes(tag) && styles.availableTagSelected
                    ]}
                    onPress={() => 
                      filters.tags.includes(tag) ? removeTag(tag) : addTag(tag)
                    }
                  >
                    <Text style={[
                      styles.availableTagText,
                      filters.tags.includes(tag) && styles.availableTagTextSelected
                    ]}>
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </FilterSection>

            {/* Sort Options */}
            <FilterSection
              title="Sort & Order"
              isExpanded={expandedSections.sort}
              onToggle={() => toggleSection('sort')}
            >
              <View style={styles.sortOptions}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <View style={styles.sortButtons}>
                  {[
                    { key: 'relevance', label: 'Relevance' },
                    { key: 'date_created', label: 'Date Created' },
                    { key: 'date_updated', label: 'Date Updated' },
                    { key: 'title', label: 'Title' },
                    { key: 'word_count', label: 'Word Count' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.sortButton,
                        filters.sortBy === option.key && styles.sortButtonActive
                      ]}
                      onPress={() => updateSort(option.key, filters.sortOrder)}
                    >
                      <Text style={[
                        styles.sortButtonText,
                        filters.sortBy === option.key && styles.sortButtonTextActive
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.orderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.orderButton,
                      filters.sortOrder === 'desc' && styles.orderButtonActive
                    ]}
                    onPress={() => updateSort(filters.sortBy, 'desc')}
                  >
                    <Icon name="arrow-downward" size={16} color={filters.sortOrder === 'desc' ? colors.background.primary : colors.text.tertiary} />
                    <Text style={[
                      styles.orderButtonText,
                      filters.sortOrder === 'desc' && styles.orderButtonTextActive
                    ]}>
                      Desc
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.orderButton,
                      filters.sortOrder === 'asc' && styles.orderButtonActive
                    ]}
                    onPress={() => updateSort(filters.sortBy, 'asc')}
                  >
                    <Icon name="arrow-upward" size={16} color={filters.sortOrder === 'asc' ? colors.background.primary : colors.text.tertiary} />
                    <Text style={[
                      styles.orderButtonText,
                      filters.sortOrder === 'asc' && styles.orderButtonTextActive
                    ]}>
                      Asc
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FilterSection>

            {/* Quick Filters */}
            <FilterSection
              title="Quick Filters"
              isExpanded={expandedSections.filters}
              onToggle={() => toggleSection('filters')}
            >
              <View style={styles.quickFilters}>
                <TouchableOpacity
                  style={[
                    styles.quickFilterButton,
                    filters.isPinned === true && styles.quickFilterButtonActive
                  ]}
                  onPress={() => updatePinned(filters.isPinned === true ? null : true)}
                >
                  <Icon name="star" size={16} color={filters.isPinned === true ? colors.background.primary : colors.text.tertiary} />
                  <Text style={[
                    styles.quickFilterText,
                    filters.isPinned === true && styles.quickFilterTextActive
                  ]}>
                    Starred
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickFilterButton,
                    filters.isArchived === true && styles.quickFilterButtonActive
                  ]}
                  onPress={() => updateArchived(filters.isArchived === true ? null : true)}
                >
                  <Icon name="archive" size={16} color={filters.isArchived === true ? colors.background.primary : colors.text.tertiary} />
                  <Text style={[
                    styles.quickFilterText,
                    filters.isArchived === true && styles.quickFilterTextActive
                  ]}>
                    Archived
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Folder Filter */}
              <View style={styles.folderFilter}>
                <Text style={styles.folderLabel}>Folder:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {folderOptions.map((folder) => (
                    <TouchableOpacity
                      key={folder.id || 'all'}
                      style={[
                        styles.folderOption,
                        filters.folderId === folder.id && styles.folderOptionActive
                      ]}
                      onPress={() => updateFolder(folder.id)}
                    >
                      <Text style={[
                        styles.folderOptionText,
                        filters.folderId === folder.id && styles.folderOptionTextActive
                      ]}>
                        {folder.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </FilterSection>
          </View>

          {/* Search Results */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>
                Results ({stats.filteredNotes} of {stats.totalNotes})
              </Text>
              {loading && <ActivityIndicator size="small" color={colors.primary[500]} />}
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {results.length === 0 && !loading ? (
              <View style={styles.emptyContainer}>
                <Icon name="search-off" size={48} color={colors.gray[300]} />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search terms or filters
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => item.note.id}
                renderItem={({ item }) => (
                  <SearchResultItem
                    result={item}
                    onPress={() => handleNoteSelect(item.note.id)}
                  />
                )}
                style={styles.resultsList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  filterBadge: {
    marginLeft: 8,
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  filterBadgeText: {
    color: colors.background.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },

  // Content styles
  content: {
    flex: 1,
  },

  // Search section styles
  searchSection: {
    padding: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
  },

  // Filters styles
  filtersContainer: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButton: {
    color: colors.error[500],
    fontSize: 14,
    fontWeight: '500',
  },

  // Filter section styles
  filterSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  filterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterSectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Tag styles
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  addTagButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 6,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: colors.background.primary,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  availableTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  availableTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  availableTagSelected: {
    backgroundColor: colors.primary[500],
  },
  availableTagText: {
    fontSize: 12,
    color: 'colors.text.tertiary',
  },
  availableTagTextSelected: {
    color: colors.background.primary,
  },

  // Sort styles
  sortOptions: {
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 16,
  },
  sortButtonActive: {
    backgroundColor: colors.primary[500],
  },
  sortButtonText: {
    fontSize: 12,
    color: 'colors.text.tertiary',
  },
  sortButtonTextActive: {
    color: colors.background.primary,
  },
  orderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 16,
  },
  orderButtonActive: {
    backgroundColor: colors.primary[500],
  },
  orderButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'colors.text.tertiary',
  },
  orderButtonTextActive: {
    color: colors.background.primary,
  },

  // Quick filters styles
  quickFilters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  quickFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 16,
  },
  quickFilterButtonActive: {
    backgroundColor: colors.primary[500],
  },
  quickFilterText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'colors.text.tertiary',
  },
  quickFilterTextActive: {
    color: colors.background.primary,
  },

  // Folder filter styles
  folderFilter: {
    gap: 8,
  },
  folderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  folderOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    marginRight: 8,
  },
  folderOptionActive: {
    backgroundColor: colors.primary[500],
  },
  folderOptionText: {
    fontSize: 12,
    color: 'colors.text.tertiary',
  },
  folderOptionTextActive: {
    color: colors.background.primary,
  },

  // Results styles
  resultsSection: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: colors.error[50],
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: colors.error[600],
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'colors.text.tertiary',
    textAlign: 'center',
  },
  resultsList: {
    flex: 1,
  },

  // Result item styles
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  resultMeta: {
    alignItems: 'flex-end',
  },
  relevanceScore: {
    fontSize: 12,
    color: colors.success[500],
    fontWeight: '600',
  },
  resultContent: {
    fontSize: 14,
    color: 'colors.text.tertiary',
    lineHeight: 20,
    marginBottom: 12,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tag: {
    backgroundColor: colors.border.light,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 10,
    color: 'colors.text.tertiary',
  },
  resultDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
})
