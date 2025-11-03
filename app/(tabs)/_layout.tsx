// app/_layout.tsx
import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import AppHeader from '../../components/AppHeader';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader />
      <View style={styles.container}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
});
