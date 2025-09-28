/**
 * AuroraNotes Mobile App
 * AI-powered note taking application
 *
 * @format
 */

import React, { useEffect } from 'react'
import { StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Colors } from './src/constants/colors'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { AppNavigator } from './src/navigation/AppNavigator'
import { useAuth } from './src/hooks/useAuth'
import { ThemeProvider } from './src/contexts/ThemeContext'
import { OfflineProvider } from './src/contexts/OfflineContext'

const App: React.FC = () => {
  const { user, loading, initializeAuth } = useAuth()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  return (
    <OfflineProvider>
      <ThemeProvider>
        <GestureHandlerRootView style={styles.container}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
              <AppNavigator user={user} />
            </NavigationContainer>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </OfflineProvider>
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
    backgroundColor: Colors.white,
  },
})

export default App