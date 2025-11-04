// components/AppHeader.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, Share, FlatList, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../hooks';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/theme';
import { Colors } from '../constants/theme';
import { clearFavs } from '../redux/favouritesSlice';
import { logout } from '../redux/authSlice';
import { useToast } from './Toast';
import * as ev from '../utils/eventBus';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppHeader() {
  const auth = useAppSelector((s) => s.auth);
  const router = useRouter();
  const { isDark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const favCount = useAppSelector((s) => s.favourites.ids.length);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      // close menu first
      setMenuOpen(false);
      // remove persisted data and clear redux
      await AsyncStorage.multiRemove(['auth_user', 'favs', 'theme']);
      dispatch(clearFavs());
      dispatch(logout());
      ev.emit('auth:loggedOut');
      toast.show('Logged out');
      router.replace('/');
    } catch (e) {
      toast.show('Could not logout');
    }
  };

  const handleLogoutConfirm = () => {
    // Open an in-app modal so confirmation is consistent across platforms (web + native)
    setMenuOpen(false);
    setLogoutModalOpen(true);
  };

  const items = [
    { key: 'home', icon: 'home', label: 'Home', action: () => router.push('/') },
    { key: 'settings', icon: 'settings', label: 'Settings', action: () => {
        if (!auth?.username) { toast.show('Please login to access Settings'); router.push(`/login?next=${encodeURIComponent('/settings')}`); return; }
        router.push('/settings');
      } },
    { key: 'profile', icon: 'user', label: 'Profile', action: () => {
        if (!auth?.username) { toast.show('Please login to access Profile'); router.push(`/login?next=${encodeURIComponent('/profile')}`); return; }
        router.push('/profile');
      } },
    { key: 'favorites', icon: 'heart', label: `Favorites${favCount ? ` (${favCount})` : ''}`, action: () => {
        if (!auth?.username) { toast.show('Please login to access Favourites'); router.push(`/login?next=${encodeURIComponent('/favorites')}`); return; }
        router.push('/favorites');
      } },
    { key: 'share', icon: 'share-2', label: 'Share app', action: async () => { try { await Share.share({ message: 'Check out StreamBox — a tiny movie browser!' }); } catch {} } },
    { key: 'logout', icon: 'log-out', label: 'Logout', action: () => {
        if (!auth?.username) { toast.show('Not signed in'); setMenuOpen(false); return; }
        handleLogoutConfirm();
      } },
  ];

  const theme = Colors[isDark ? 'dark' : 'light'];
  const bgStyle = { backgroundColor: theme.background };
  const textColor = theme.text;

  return (
    <View style={[styles.root, bgStyle]}>
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
  {auth.username ? <Text style={[styles.greeting, { color: theme.icon }]}>Hi, {auth.username}</Text> : null}
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
          <View style={[styles.menu, { backgroundColor: theme.background }]}>
              <FlatList
              data={items}
              keyExtractor={(i) => i.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomColor: theme.icon }]}
                  onPress={() => {
                    setMenuOpen(false);
                    setTimeout(() => item.action(), 120);
                  }}
                >
                  <View style={styles.menuItemRow}>
                    <Feather name={item.icon as any} size={18} color={theme.icon} />
                    <Text style={[{ color: theme.text, marginLeft: 12 }]}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal transparent visible={logoutModalOpen} animationType="fade" onRequestClose={() => setLogoutModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setLogoutModalOpen(false)}>
          <View style={[styles.logoutDialog, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>Confirm logout</Text>
            <Text style={{ color: theme.icon, marginTop: 8 }}>Are you sure you want to logout?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity onPress={() => setLogoutModalOpen(false)} style={[styles.dialogBtn, { marginRight: 8, backgroundColor: theme.tabIconDefault }]}>
                <Text style={{ color: theme.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setLogoutModalOpen(false); handleLogout(); }} style={[styles.dialogBtn, { backgroundColor: theme.tint }]}>
                <Text style={{ color: theme.background }}>Logout</Text>
              </TouchableOpacity>
            </View>
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
  logoutDialog: { margin: 24, padding: 16, borderRadius: 10, elevation: 8 },
  dialogBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
});
