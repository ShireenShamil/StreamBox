import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';

import { store } from '../redux/store';
import { bootstrap } from '../redux/bootstrap';
import { ThemeProvider } from '../theme/theme';
import { ToastProvider } from '../components/Toast';

export default function RootLayout() {
  useEffect(() => {
    // hydrate persisted state (favourites, auth)
    void bootstrap();
  }, []);

  const { isDark } = useTheme();
  const bgColor = isDark ? '#2b2b2b' : '#f5f7fb';

  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
            <Slot />
          </SafeAreaView>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
