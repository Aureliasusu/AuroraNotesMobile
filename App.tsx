/**
 * Aurora Notes Mobile App
 * AI-Powered Note Taking Application
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, ActivityIndicator } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/useAuthStore';
import { SignInScreen } from './src/screens/auth/SignInScreen';
import { NotesListScreen } from './src/screens/notes/NotesListScreen';
import { FileUploadService } from './src/services/fileUpload';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuthStore();
  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    // Initialize auth state
    useAuthStore.getState().setLoading(false);
    
    // Test file upload functionality
    FileUploadService.testUpload().then(success => {
      if (success) {
        console.log('✅ File upload test passed');
      } else {
        console.log('❌ File upload test failed');
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      {user ? <NotesListScreen /> : <SignInScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
