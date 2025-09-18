import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = '+',
  size = 'md',
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles[size],
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.icon, styles[`${size}Icon`]]}>
        {icon}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sm: {
    width: 48,
    height: 48,
    bottom: 20,
    right: 20,
  },
  md: {
    width: 56,
    height: 56,
    bottom: 24,
    right: 24,
  },
  lg: {
    width: 64,
    height: 64,
    bottom: 28,
    right: 28,
  },
  icon: {
    color: '#fff',
    fontWeight: 'bold',
  },
  smIcon: {
    fontSize: 20,
  },
  mdIcon: {
    fontSize: 24,
  },
  lgIcon: {
    fontSize: 28,
  },
});
