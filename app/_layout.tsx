import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';

import { store } from '../redux/store';
import { bootstrap } from '../redux/bootstrap';
import { ThemeProvider } from '../theme/theme';

export default function RootLayout() {
  useEffect(() => {
    // hydrate persisted state (favourites, auth)
    void bootstrap();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaView style={styles.safe}>
          <Slot />
        </SafeAreaView>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
});
