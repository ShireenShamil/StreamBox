import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, Share } from 'react-native';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../hooks';
import { clearFavs } from '../../redux/favouritesSlice';
import { logout } from '../../redux/authSlice';
import { useToast } from '../../components/Toast';

export default function Settings() {
  const { isDark, toggle } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const dispatch = useAppDispatch();
  const toast = useToast();

  const clearData = () => {
    Alert.alert('Clear data', 'This will clear saved auth, favourites and theme. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        try {
          await AsyncStorage.multiRemove(['auth_user', 'favs', 'theme']);
          dispatch(clearFavs());
          dispatch(logout());
          toast.show('App data cleared');
        } catch (e) {
          toast.show('Could not clear data');
        }
      } },
    ]);
  };

  // Additional settings stored in AsyncStorage
  const [highRes, setHighRes] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);

  useEffect(() => {
    (async () => {
      try {
        const hr = await AsyncStorage.getItem('high_res_images');
        const ipp = await AsyncStorage.getItem('items_per_page');
        if (hr !== null) setHighRes(hr === '1');
        if (ipp !== null) setItemsPerPage(parseInt(ipp, 10) || 12);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const toggleHighRes = async (v?: boolean) => {
    const nv = typeof v === 'boolean' ? v : !highRes;
    try {
      await AsyncStorage.setItem('high_res_images', nv ? '1' : '0');
      setHighRes(nv);
      toast.show(nv ? 'High quality images enabled' : 'High quality images disabled');
    } catch (e) {
      toast.show('Could not update setting');
    }
  };

  const changeItemsPerPage = async (delta: number) => {
    const nv = Math.max(6, Math.min(48, itemsPerPage + delta));
    try {
      await AsyncStorage.setItem('items_per_page', String(nv));
      setItemsPerPage(nv);
      toast.show(`Items per page: ${nv}`);
    } catch (e) {
      toast.show('Could not update setting');
    }
  };

  const exportFavourites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favs');
      const payload = stored ?? '[]';
      await Share.share({ message: payload });
    } catch (e) {
      toast.show('Could not export favourites');
    }
  };

  const resetApp = () => {
    Alert.alert('Reset app', 'This will clear all app data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: async () => {
        try {
          await AsyncStorage.clear();
          dispatch(clearFavs());
          dispatch(logout());
          toast.show('App reset. Restarting.');
          // best-effort reload: window location for web
          try { if ((global as any).location) (global as any).location.reload(); } catch {}
        } catch (e) {
          toast.show('Could not reset app');
        }
      } }
    ]);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('auth_user');
      dispatch(logout());
      toast.show('Logged out');
    } catch (e) {
      toast.show('Could not logout');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggle} thumbColor={isDark ? '#fff' : '#fff'} trackColor={{ true: theme.tint, false: '#ccc' }} />
      </View>

      <TouchableOpacity onPress={clearData} style={{ marginTop: 20, padding: 12, backgroundColor: theme.tint, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: isDark ? '#000000' : '#fff', fontWeight: '600' }}>Clear auth & favourites</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 18, padding: 12, borderRadius: 8, backgroundColor: theme.background, borderWidth: 0, borderColor: theme.icon }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ color: theme.text }}>High quality images</Text>
          <Switch value={highRes} onValueChange={() => toggleHighRes()} thumbColor={highRes ? '#fff' : '#fff'} trackColor={{ true: theme.tint, false: '#ccc' }} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: theme.text }}>Items per page</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={() => changeItemsPerPage(-6)} style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: theme.icon }}>
              <Text style={{ color: theme.text }}>-</Text>
            </TouchableOpacity>
            <Text style={{ color: theme.text, minWidth: 40, textAlign: 'center' }}>{itemsPerPage}</Text>
            <TouchableOpacity onPress={() => changeItemsPerPage(6)} style={{ padding: 8, borderRadius: 6, borderWidth: 1, borderColor: theme.icon }}>
              <Text style={{ color: theme.text }}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 18, flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity onPress={exportFavourites} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.icon, alignItems: 'center' }}>
          <Text style={{ color: theme.text }}>Export favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetApp} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#e53935', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Reset app</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={{ marginTop: 18, padding: 12, borderRadius: 8, backgroundColor: theme.tint, alignItems: 'center' }}>
        <Text style={{ color: theme.background, fontWeight: '600' }}>Log out</Text>
      </TouchableOpacity>

      <Text style={{ color: theme.text, marginTop: 24, fontSize: 14 }}>More settings coming soon.</Text>
    </View>
  );
}
