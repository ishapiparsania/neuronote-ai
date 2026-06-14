import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, AppDispatch } from '@/store';
import { hydrateNotes } from '@/store/notesSlice';
import { hydrateSettings } from '@/store/settingsSlice';
import { loadNotes, loadSettings } from '@/storage/mmkv';
import { ThemeProvider, useAppTheme } from '@/theme';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RootNavigator } from '@/navigation/RootNavigator';

function AppBootstrap() {
  const dispatch = useDispatch<AppDispatch>();
  const { colors, isDark } = useAppTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(hydrateNotes(loadNotes()));
    dispatch(hydrateSettings(loadSettings()));
    setReady(true);
  }, [dispatch]);

  if (!ready) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

function AppRoot() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <Provider store={store}>
          <ThemeProvider>
            <ErrorBoundary>
              <AppBootstrap />
            </ErrorBoundary>
          </ThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default AppRoot;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
