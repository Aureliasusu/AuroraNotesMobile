import React, { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface SearchBarProps {
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  onSearch?: (text: string) => void
  onClear?: () => void
  style?: any
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search notes...',
  value,
  onChangeText,
  onSearch,
  onClear,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    onChangeText('')
    if (onClear) {
      onClear()
    }
  }

  return (
    <View style={[styles.container, isFocused && styles.focused, style]}>
      <Icon name="search" size={20} color="#6b7280" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Icon name="clear" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  focused: {
    backgroundColor: '#ffffff',
    borderColor: '#3b82f6',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
})