import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

export default function Settings() {
  const { isDark, toggle } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: theme.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggle} thumbColor={isDark ? '#fff' : '#fff'} trackColor={{ true: theme.tint, false: '#ccc' }} />
      </View>

      <Text style={{ color: theme.text, marginTop: 24, fontSize: 14 }}>More settings coming soon.</Text>
    </View>
  );
}
