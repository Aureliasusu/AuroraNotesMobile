import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useOffline } from '../../contexts/OfflineContext'
import { useTheme } from '../../contexts/ThemeContext'
import { colors as themeColors } from '../../constants/colors'

interface OfflineIndicatorProps {
  style?: any
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ style }) => {
  const { isOffline, syncStatus, lastSyncTime, syncData } = useOffline()
  const { colors } = useTheme()

  if (!isOffline) {
    return null
  }

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...'
      case 'success':
        return 'Synced'
      case 'error':
        return 'Sync failed'
      default:
        return 'Offline'
    }
  }

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return colors.warning
      case 'success':
        return colors.success
      case 'error':
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'sync'
      case 'success':
        return 'check-circle'
      case 'error':
        return 'error'
      default:
        return 'cloud-off'
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
      <View style={styles.statusContainer}>
        <Icon 
          name={getStatusIcon()} 
          size={16} 
          color={getStatusColor()} 
        />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
      
      {lastSyncTime && (
        <Text style={[styles.lastSyncText, { color: colors.textTertiary }]}>
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </Text>
      )}
      
      {syncStatus === 'error' && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={syncData}
        >
          <Text style={[styles.retryText, { color: colors.white }]}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border.light,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  lastSyncText: {
    fontSize: 12,
    marginLeft: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '500',
  },
})
