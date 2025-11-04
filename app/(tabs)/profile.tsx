
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
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

  const theme = Colors[isDark ? 'dark' : 'light'];
  const bg = { backgroundColor: theme.background };
  const textColor = theme.text;

  const initials = (auth.username || 'G').slice(0, 2).toUpperCase();

  return (
    <View style={[styles.wrapper, bg]}>
      <View style={styles.header}>
        <View style={[styles.avatar, isDark && stylesDark.avatarBackground, { backgroundColor: isDark ? '#1f2937' : '#eee' }]}>
          <Text style={[styles.avatarText, { color: textColor }]}>{initials}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: textColor }]}>{auth.username ?? 'Guest'}</Text>
          <Text style={[styles.sub, { color: theme.icon }]}>{auth.username ? (auth.email ?? `${auth.username}@example.com`) : 'Not signed in'}</Text>
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

          <View style={[styles.rowBetween, { borderTopColor: theme.icon }]}
          >
            <Text style={[styles.optionLabel, { color: textColor }]}>Dark mode</Text>
            <Switch value={isDark} onValueChange={toggle} thumbColor={isDark ? '#fff' : '#fff'} trackColor={{ true: theme.tint, false: '#ccc' }} />
          </View>

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
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '700' },
  statLabel: { marginTop: 4, fontSize: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8 },
  optionLabel: { fontSize: 16 },
  logoutBtn: { marginTop: 24, padding: 12, borderRadius: 10, backgroundColor: '#6c5ce7', alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '600' },
});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
  avatarBackground: { backgroundColor: '#1f2937' },
  logoutBtn: { backgroundColor: '#8b5cf6' },
});

