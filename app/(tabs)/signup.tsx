// app/signup.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as yup from 'yup';
import { useAppDispatch } from '../../hooks';
import { useRouter } from 'expo-router';
import { useToast } from '../../components/Toast';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

const schema = yup.object({ username: yup.string().min(3).required('Username is required'), password: yup.string().min(4).required('Password is required'), confirmPassword: yup.string().required('Confirm password').oneOf([yup.ref('password')], 'Passwords must match'), email: yup.string().email('Invalid email').required('Email is required') });

export default function Signup() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [err, setErr] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setErr('');
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await schema.validate({ username, password, confirmPassword, email }, { abortEarly: false });
      // call dummy user creation
      try {
        const payload = { username, email, password, firstName: username };
        const res = await fetch('https://dummyjson.com/users/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Signup failed');
        }
        const created = await res.json();
        // Persist the created user locally by dispatching login (stores in AsyncStorage)
        const createdUsername = created.username || username || created.firstName || '';
        const createdEmail = created.email || email || '';
        try {
          dispatch(require('../../redux/authSlice').login({ username: createdUsername, email: createdEmail }));
        } catch {
          // fallback: dispatch directly if require didn't return action
          try {
            // safe: import named action and dispatch
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { login: loginAction } = require('../../redux/authSlice');
            dispatch(loginAction({ username: createdUsername, email: createdEmail }));
          } catch {
            // ignore if dispatch fails
          }
        }
        // finally show toast and redirect to home
        toast.show('Account created — signed in');
        router.replace('/');
      } catch (apiErr: any) {
        setErr(apiErr.message || 'Signup failed');
      }
    } catch (e: any) {
      if (e.name === 'ValidationError' && Array.isArray(e.inner)) {
        const fe: any = {};
        e.inner.forEach((errItem: any) => {
          if (errItem.path) fe[errItem.path] = errItem.message;
        });
        if (!Object.keys(fe).length) setErr(e.message || 'Validation failed');
        setFieldErrors(fe);
      } else {
        setErr(e.message || 'Signup failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}>
      <View style={{ margin: 24 }}>
  <TextInput placeholder="Username" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={username} onChangeText={(v) => { setUsername(v); setFieldErrors((s) => ({ ...s, username: undefined })); }} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
  {!!fieldErrors.username && <Text style={{ color: 'crimson' }}>{fieldErrors.username}</Text>}

  <TextInput placeholder="Email" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={email} onChangeText={(v) => { setEmail(v); setFieldErrors((s) => ({ ...s, email: undefined })); }} style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} keyboardType="email-address" />
  {!!fieldErrors.email && <Text style={{ color: 'crimson' }}>{fieldErrors.email}</Text>}

  <TextInput placeholder="Password" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={password} onChangeText={(v) => { setPassword(v); setFieldErrors((s) => ({ ...s, password: undefined })); }} secureTextEntry style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
  {!!fieldErrors.password && <Text style={{ color: 'crimson' }}>{fieldErrors.password}</Text>}

  <TextInput placeholder="Confirm password" placeholderTextColor={isDark ? '#9BA1A6' : '#666'} value={confirmPassword} onChangeText={(v) => { setConfirmPassword(v); setFieldErrors((s) => ({ ...s, confirmPassword: undefined })); }} secureTextEntry style={[styles.input, { backgroundColor: isDark ? '#0f1720' : '#fff', color: theme.text, borderColor: isDark ? '#222' : '#eee' }]} />
  {!!fieldErrors.confirmPassword && <Text style={{ color: 'crimson' }}>{fieldErrors.confirmPassword}</Text>}

        {!!err && <Text style={{ color: 'crimson' }}>{err}</Text>}

        <TouchableOpacity onPress={submit} disabled={isSubmitting} style={[styles.btn, { backgroundColor: isSubmitting ? '#9aa4a8' : theme.tint }]}>
          <Text style={{ color: '#fff' }}>{isSubmitting ? 'Creating...' : 'Create account'}</Text>
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
