// components/AppHeader.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Share, FlatList, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/theme';
import { clearFavs } from '../redux/favouritesSlice';
import { logout } from '../redux/authSlice';
import { useToast } from './Toast';
import * as ev from '../utils/eventBus';

export default function AppHeader() {
  const auth = useAppSelector((s) => s.auth);
  const router = useRouter();
  const { isDark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const favCount = useAppSelector((s) => s.favourites.ids.length);

  const items = [
    { key: 'home', icon: 'home', label: 'Home', action: () => router.push('/') },
    { key: 'settings', icon: 'settings', label: 'Settings', action: () => router.push('/settings') },
    { key: 'profile', icon: 'user', label: 'Profile', action: () => router.push('/profile') },
    { key: 'favorites', icon: 'heart', label: `Favorites${favCount ? ` (${favCount})` : ''}`, action: () => router.push('/favorites') },
    { key: 'share', icon: 'share-2', label: 'Share app', action: async () => { try { await Share.share({ message: 'Check out StreamBox — a tiny movie browser!' }); } catch {} } },
    { key: 'logout', icon: 'log-out', label: 'Logout', action: () => {
        Alert.alert('Logout', 'Do you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: async () => {
            try {
              dispatch(clearFavs());
              dispatch(logout());
              await ev.emit('auth:loggedOut');
              toast.show('Logged out');
              router.push('/');
            } catch (e) {
              toast.show('Could not logout');
            }
          } }
        ]);
      } },
  ];

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
        <TouchableOpacity onPress={toggle} style={styles.iconBtn} accessibilityLabel="Toggle theme">
          <Feather name={isDark ? 'sun' : 'moon'} size={20} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.iconBtn} accessibilityLabel="Open menu">
          <Feather name="menu" size={22} color={textColor} />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)}>
          <View style={[styles.menu, { backgroundColor: isDark ? '#0b1220' : '#fff' }]}>
            <FlatList
              data={items}
              keyExtractor={(i) => i.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuOpen(false);
                    setTimeout(() => item.action(), 120);
                  }}
                >
                  <View style={styles.menuItemRow}>
                    <Feather name={item.icon as any} size={18} color={isDark ? '#fff' : '#111'} />
                    <Text style={[{ color: isDark ? '#fff' : '#111', marginLeft: 12 }]}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start', paddingTop: 60 },
  menu: { margin: 12, borderRadius: 8, overflow: 'hidden', elevation: 6 },
  menuItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  badge: { position: 'absolute', right: -6, top: -6, backgroundColor: 'crimson', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  menuItemRow: { flexDirection: 'row', alignItems: 'center' },
});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
});
