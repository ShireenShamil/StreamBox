// components/AppHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../hooks';
import { useRouter } from 'expo-router';
import { useTheme } from '../theme/theme';

export default function AppHeader() {
  const auth = useAppSelector((s) => s.auth);
  const router = useRouter();
  const { isDark, toggle } = useTheme();

  return (
    <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Feather name="film" size={22} />
        <Text style={{ fontSize: 18, fontWeight: '700' }}>StreamBox</Text>
        {auth.username ? <Text style={{ marginLeft: 12, color: '#666' }}>Hi, {auth.username}</Text> : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity onPress={() => router.push('/favorites')}>
          <Feather name="heart" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Feather name="user" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggle}>
          <Feather name={isDark ? 'sun' : 'moon'} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
