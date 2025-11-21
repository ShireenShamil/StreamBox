
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import { useToast } from '../../components/Toast';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../redux/authSlice';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

export default function Profile() {
  const auth = useAppSelector((s) => s.auth);
  const favCount = useAppSelector((s) => s.favourites.ids.length);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isDark, toggle } = useTheme();
  const toast = useToast();

  const [editingName, setEditingName] = useState(auth.username ?? '');
  const [editingEmail, setEditingEmail] = useState(auth.email ?? '');

  const theme = Colors[isDark ? 'dark' : 'light'];
  const bg = { backgroundColor: theme.background };
  const textColor = theme.text;

  const initials = (auth.username || 'G').slice(0, 2).toUpperCase();

  return (
    <View style={[styles.wrapper, bg]}>
      <View style={styles.header}>
        <View style={[styles.avatar, isDark && stylesDark.avatarBackground, { backgroundColor: isDark ? '#1f2937' : theme.tint }]}>
          <Text style={[styles.avatarText, { color: textColor }]}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <TextInput value={editingName} onChangeText={setEditingName} placeholder="Your name" placeholderTextColor={theme.icon} style={[styles.nameInput, { color: textColor }]} />
          <TextInput value={editingEmail} onChangeText={setEditingEmail} placeholder="you@example.com" placeholderTextColor={theme.icon} style={[styles.subInput, { color: theme.icon }]} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: textColor }]}>{favCount}</Text>
          <Text style={[styles.statLabel, { color: theme.icon }]}>Favourites</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: textColor }]}>{/* placeholder */}—</Text>
          <Text style={[styles.statLabel, { color: isDark ? '#ccc' : '#666' }]}>Watched</Text>
        </View>
      </View>

          <View style={[styles.rowBetween, { borderTopColor: theme.icon }]}>
            <Text style={[styles.optionLabel, { color: textColor }]}>Dark mode</Text>
            <Switch value={isDark} onValueChange={toggle} thumbColor={isDark ? '#fff' : '#fff'} trackColor={{ true: theme.tint, false: '#ccc' }} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => router.push('/favorites')}
              style={[styles.actionBtn, { flex: 1, borderColor: theme.icon }]}
            >
              <Text style={{ color: theme.text }}>View favourites ({favCount})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // save profile locally
                if (!editingName) { toast.show('Please enter a name'); return; }
                try {
                  // use login action to persist to AsyncStorage
                  const { login } = require('../../redux/authSlice');
                  dispatch(login({ username: editingName, email: editingEmail }));
                  toast.show('Profile saved');
                } catch (e) {
                  toast.show('Could not save profile');
                }
              }}
              style={[styles.actionBtn, { backgroundColor: theme.tint, flex: 1 }]}
            >
              <Text style={{ color: theme.background, fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert('Change password', 'Password change is not implemented in this demo.')}
            style={[styles.option, { marginTop: 12, borderColor: theme.icon }]}
          >
            <Text style={{ color: textColor }}>Change password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Delete account', 'This will remove your data. Continue?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: async () => {
                try {
                  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                  await AsyncStorage.multiRemove(['auth_user', 'favs']);
                  const { clearFavs } = require('../../redux/favouritesSlice');
                  dispatch(clearFavs());
                  dispatch(logout());
                  toast.show('Account deleted');
                  router.replace('/');
                } catch (e) { toast.show('Could not delete account'); }
              } }
            ])}
            style={[styles.option, { borderColor: '#e53935' }]}
          >
            <Text style={{ color: '#e53935' }}>Delete account</Text>
          </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          dispatch(logout());
          try {
            const { clearFavs } = require('../../redux/favouritesSlice');
            dispatch(clearFavs());
          } catch {}
          // show toast and navigate to home as logged-out
          try {
            const { useToast } = require('../../components/Toast');
            // we can't call hook here; instead use global provider by emitting a small delay event
          } catch {}
          router.replace('/');
        }}
        style={[styles.logoutBtn, isDark ? stylesDark.logoutBtn : null, { backgroundColor: theme.tint }]}
      >
        <Text style={[styles.logoutText, { color: theme.background }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20 },
  container: { backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700' },
  userInfo: { marginLeft: 12 },
  name: { fontSize: 20, fontWeight: '700' },
  sub: { marginTop: 4, fontSize: 13 },
  nameInput: { fontSize: 18, fontWeight: '700', padding: 0 },
  subInput: { marginTop: 6, fontSize: 13, padding: 0 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '700' },
  statLabel: { marginTop: 4, fontSize: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8 },
  optionLabel: { fontSize: 16 },
  actionBtn: { padding: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  option: { padding: 12, borderRadius: 8, borderWidth: 1, marginTop: 8, alignItems: 'center' },
  logoutBtn: { marginTop: 24, padding: 12, borderRadius: 10, backgroundColor: '#6c5ce7', alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '600' },
});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
  avatarBackground: { backgroundColor: '#1f2937' },
  logoutBtn: { backgroundColor: '#8b5cf6' },
});


