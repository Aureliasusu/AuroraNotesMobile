import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';

// Screens
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { NotesListScreen } from '../screens/notes/NotesListScreen';
import { NoteEditorScreen } from '../screens/notes/NoteEditorScreen';

// Types
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  NotesList: undefined;
  NoteEditor: { noteId?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Authenticated screens
          <>
            <Stack.Screen name="NotesList" component={NotesListScreen} />
            <Stack.Screen 
              name="NoteEditor" 
              component={NoteEditorScreen}
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Edit Note',
              }}
            />
          </>
        ) : (
          // Auth screens
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
