// app/login.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import * as yup from 'yup';
import { useAppDispatch } from '../../hooks';
import { login } from '../../redux/authSlice';
import { Feather } from '@expo/vector-icons';

const schema = yup.object({ username: yup.string().min(3).required(), password: yup.string().min(4).required() });

export default function Login() {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async () => {
    try {
      await schema.validate({ username, password });
      dispatch(login({ username }));
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ margin: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Feather name="film" size={48} />
          <Text style={{ fontSize: 20, marginTop: 8 }}>StreamBox</Text>
        </View>

        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        {!!err && <Text style={{ color: 'crimson' }}>{err}</Text>}

        <TouchableOpacity onPress={submit} style={styles.btn}>
          <Text style={{ color: '#fff' }}>Login / Register</Text>
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
