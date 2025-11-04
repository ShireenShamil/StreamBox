// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as yup from 'yup';
import { useAppDispatch } from '../../hooks';
import { login } from '../../redux/authSlice';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useToast } from '../../components/Toast';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

const schema = yup.object({ username: yup.string().min(3).required(), password: yup.string().min(4).required() });

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [username, setUsername] = useState(() => (params.username as string) ?? '');
  const [email, setEmail] = useState(() => (params.email as string) ?? '');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [showSuccess, setShowSuccess] = useState(!!params.signup);
  const toast = useToast();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];

  const submit = async () => {
    try {
      await schema.validate({ username, password });
      dispatch(login({ username, email }));
      // navigate to home
      toast.show('Logged in');
      router.replace('/');
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}>
      <View style={{ margin: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Feather name="film" size={48} color={theme.tint} />
          <Text style={{ fontSize: 20, marginTop: 8, color: theme.text }}>StreamBox</Text>
        </View>

          {showSuccess ? (
            <View style={{ backgroundColor: isDark ? '#064e3b' : '#d1fae5', padding: 8, borderRadius: 8, marginBottom: 12 }}>
              <Text style={{ color: isDark ? '#bbf7d0' : '#065f46' }}>Account created — please login</Text>
            </View>
          ) : null}

  <TextInput placeholder="Username" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={username} onChangeText={setUsername} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
  <TextInput placeholder="Email" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={email} onChangeText={setEmail} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} keyboardType="email-address" />
        <TextInput placeholder="Password" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={password} onChangeText={setPassword} secureTextEntry style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
        {!!err && <Text style={{ color: 'crimson' }}>{err}</Text>}

        <TouchableOpacity onPress={submit} style={[styles.btn, { backgroundColor: theme.tint }]}>
          <Text style={{ color: '#fff' }}>Login</Text>
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
