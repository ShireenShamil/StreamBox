// components/AppHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../hooks';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/theme';

export default function AppHeader() {
  const auth = useAppSelector((s) => s.auth);
  const router = useRouter();
  const { isDark, toggle } = useTheme();

  const bg = isDark ? stylesDark.container : styles.container;
  const textColor = isDark ? '#fff' : '#111';

  return (
    <View style={[styles.root, bg]}>
      <TouchableOpacity
        style={styles.left}
        onPress={() => {
          // navigate to home and notify listeners (home may refresh/scroll-to-top)
          router.replace('/');
          try {
            // lazy import to avoid cycles
            const ev = require('../utils/eventBus');
            ev.emit('home:goHome');
          } catch {}
        }}
      >
        <Feather name="film" size={22} color={textColor} />
        <Text style={[styles.title, { color: textColor }]}>StreamBox</Text>
        {auth.username ? <Text style={[styles.greeting, { color: isDark ? '#ccc' : '#666' }]}>Hi, {auth.username}</Text> : null}
      </TouchableOpacity>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => router.push('/favorites')} style={styles.iconBtn}>
          <Feather name="heart" size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.iconBtn}>
          <Feather name="user" size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggle} style={styles.iconBtn}>
          <Feather name={isDark ? 'sun' : 'moon'} size={20} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
  greeting: { marginLeft: 12 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 6 },
  container: { backgroundColor: '#fff' },
});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
});
