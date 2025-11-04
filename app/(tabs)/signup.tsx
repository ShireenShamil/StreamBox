// app/signup.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as yup from 'yup';
import { useAppDispatch } from '../../hooks';
import { useRouter } from 'expo-router';
import { useToast } from '../../components/Toast';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

const schema = yup.object({ username: yup.string().min(3).required(), password: yup.string().min(4).required(), email: yup.string().email().required() });

export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async () => {
    try {
      await schema.validate({ username, password, email });
      // show a confirmation toast then redirect to login page and prefill username/email
      toast.show('Account created — please login');
      const qs = `?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&signup=1`;
  // preserve optional next param if present so users can continue where they started
  // read next from current route query if present
  try {
    const lp = require('expo-router').useLocalSearchParams();
    const next = (lp.next as string) ?? undefined;
    const nextQs = next ? `&next=${encodeURIComponent(next)}` : '';
    router.replace((`/login${qs}${nextQs}` as unknown) as any);
  } catch {
    router.replace((`/login${qs}` as unknown) as any);
  }
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}>
      <View style={{ margin: 24 }}>
  <TextInput placeholder="Username" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={username} onChangeText={setUsername} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
  <TextInput placeholder="Email" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={email} onChangeText={setEmail} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} keyboardType="email-address" />
  <TextInput placeholder="Password" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={password} onChangeText={setPassword} secureTextEntry style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
        {!!err && <Text style={{ color: 'crimson' }}>{err}</Text>}

        <TouchableOpacity onPress={submit} style={[styles.btn, { backgroundColor: theme.tint }]}>
          <Text style={{ color: '#fff' }}>Create account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 12,
  } as any,
  btn: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#6c5ce7',
    alignItems: 'center',
  } as any,
};
