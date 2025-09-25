/**
 * AuroraNotes Mobile App
 * AI-powered note taking application
 *
 * @format
 */

import React, { useEffect } from 'react'
import { StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppNavigator } from './src/navigation/AppNavigator'
import { useAuth } from './src/hooks/useAuth'

const App: React.FC = () => {
  const { user, loading, initializeAuth } = useAuth()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <AppNavigator user={user} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
})

export default App