import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

interface FloatingActionButtonProps {
  onPress: () => void
  icon?: string
  size?: number
  backgroundColor?: string
  iconColor?: string
  style?: any
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  size = 56,
  backgroundColor = '#3b82f6',
  iconColor = '#ffffff',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Icon name={icon} size={size * 0.5} color={iconColor} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
})