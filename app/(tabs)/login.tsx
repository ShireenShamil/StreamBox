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

const schema = yup
  .object({ username: yup.string().min(3), email: yup.string().email(), password: yup.string().min(4).required('Password is required') })
  .test('username-or-email', 'Please provide a username or a valid email', (value) => {
    if (!value) return false;
    const hasUsername = !!value.username && value.username.trim().length >= 3;
    const hasEmail = !!value.email && value.email.trim().length > 0;
    return hasUsername || hasEmail;
  });

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();
  // optional next path to navigate after successful login
  const next = (params.next as string) ?? undefined;
  const [username, setUsername] = useState(() => (params.username as string) ?? '');
  const [email, setEmail] = useState(() => (params.email as string) ?? '');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(!!params.signup);
  const toast = useToast();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];

  const submit = async () => {
    setErr('');
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await schema.validate({ username, email, password }, { abortEarly: false });
      // call dummy auth API
      try {
        // dummyjson expects `username` and `password`.
        const usernameToSend = (username && username.trim()) || (email && email.trim() ? email.split('@')[0] : '');
        const body: any = { username: usernameToSend, password };
        const res = await fetch('https://dummyjson.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          // try parse json body for message otherwise fall back to text
          let msg = 'Authentication failed';
          try {
            const j = await res.json();
            if (j && j.message) msg = j.message;
            else if (j && j.error) msg = j.error;
            else msg = JSON.stringify(j);
          } catch {
            try { msg = await res.text(); } catch { /* ignore */ }
          }
          throw new Error(msg || 'Authentication failed');
        }
        const data = await res.json();
        // data contains 'token' and 'user' object
        const user = data.user || {};
        const uname = user.username || username || user.firstName || '';
        const uemail = user.email || email || '';
        dispatch(login({ username: uname, email: uemail }));
        toast.show('Logged in');
        if (next) router.replace(decodeURIComponent(next) as any);
        else router.replace('/');
      } catch (apiErr: any) {
        setErr(apiErr.message || 'Login failed');
      }
    } catch (e: any) {
      // collect field errors if validation error
      if (e.name === 'ValidationError' && Array.isArray(e.inner)) {
        const fe: any = {};
        e.inner.forEach((errItem: any) => {
          if (errItem.path) fe[errItem.path] = errItem.message;
        });
        // if the custom test failed without a path, show general message
        if (!fe.username && !fe.email && !fe.password) setErr(e.message || 'Validation failed');
        setFieldErrors(fe);
      } else {
        setErr(e.message || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
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

  <TextInput placeholder="Username" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={username} onChangeText={(v) => { setUsername(v); setFieldErrors((s) => ({ ...s, username: undefined })); }} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
  {!!fieldErrors.username && <Text style={{ color: 'crimson' }}>{fieldErrors.username}</Text>}

  <TextInput placeholder="Email" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={email} onChangeText={(v) => { setEmail(v); setFieldErrors((s) => ({ ...s, email: undefined })); }} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} keyboardType="email-address" />
  {!!fieldErrors.email && <Text style={{ color: 'crimson' }}>{fieldErrors.email}</Text>}

        <TextInput placeholder="Password" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={password} onChangeText={(v) => { setPassword(v); setFieldErrors((s) => ({ ...s, password: undefined })); }} secureTextEntry style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
        {!!fieldErrors.password && <Text style={{ color: 'crimson' }}>{fieldErrors.password}</Text>}
        {!!err && <Text style={{ color: 'crimson' }}>{err}</Text>}

        <TouchableOpacity onPress={submit} disabled={isSubmitting} style={[styles.btn, { backgroundColor: isSubmitting ? '#9aa4a8' : theme.tint }]}>
          <Text style={{ color: '#fff' }}>{isSubmitting ? 'Signing in...' : 'Login'}</Text>
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
