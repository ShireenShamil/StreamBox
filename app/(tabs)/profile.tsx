// app/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logout } from '../../redux/authSlice';

export default function Profile() {
  const auth = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Profile</Text>
      <Text style={{ marginTop: 12 }}>Username: {auth.username ?? 'Guest'}</Text>
      <TouchableOpacity onPress={() => dispatch(logout())} style={{ marginTop: 20, padding: 12, backgroundColor: '#6c5ce7', borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
