
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setupErrorLogging } from '../utils/errorLogger';

const STORAGE_KEY = 'natively_emulate_device';

export default function RootLayout() {
  const [emulate, setEmulate] = useState<string | null>(null);
  const { emulate: emulateParam } = useGlobalSearchParams();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setupErrorLogging();
    console.log('Study App initialized');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="subject/[id]" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="content/[id]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
