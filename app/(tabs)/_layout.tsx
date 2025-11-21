// app/_layout.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Platform } from 'react-native';
import { Slot, useRouter } from 'expo-router';
import AppHeader from '../../components/AppHeader';
import { useTheme } from '../../theme/theme';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore when focus is inside an input/textarea/contenteditable
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName?.toLowerCase();
        const isEditable = tag === 'input' || tag === 'textarea' || (target as any).isContentEditable;
        if (isEditable) return;
      }

      if (e.key === 'ArrowLeft') {
        // go back in SPA history; router.back() as fallback
        if (typeof window !== 'undefined' && window.history && typeof window.history.back === 'function') {
          window.history.back();
        } else {
          router.back();
        }
      }

      if (e.key === 'ArrowRight') {
        if (typeof window !== 'undefined' && window.history && typeof window.history.forward === 'function') {
          window.history.forward();
        } else {
          // No forward API from router; do nothing or implement custom logic
        }
      }
    };

    if (Platform.OS === 'web') {
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    return undefined;
  }, [router]);

  const { isDark } = useTheme();
  const bgColor = isDark ? '#151718' : '#f5f7fb';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <AppHeader />
      <View style={styles.container}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Add a small top padding so the UI doesn't sit flush to the very top on phones
  safe: { flex: 1, paddingTop: 40 },
  container: { flex: 1, paddingHorizontal: 0, paddingTop: 0 },
});
