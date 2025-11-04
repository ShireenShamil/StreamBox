import React from 'react';
import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
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

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggle} thumbColor={isDark ? '#fff' : '#fff'} trackColor={{ true: theme.tint, false: '#ccc' }} />
      </View>

      <TouchableOpacity onPress={clearData} style={{ marginTop: 20, padding: 12, backgroundColor: '#ef4444', borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Clear app data</Text>
      </TouchableOpacity>

      <Text style={{ color: theme.text, marginTop: 24, fontSize: 14 }}>More settings coming soon.</Text>
    </View>
  );
}
