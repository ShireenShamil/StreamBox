// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = { username: string | null; email?: string | null };
const initialState: State = { username: null, email: null };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; email?: string }>) {
      state.username = action.payload.username;
      state.email = action.payload.email ?? null;
      // persist as JSON
      AsyncStorage.setItem('auth_user', JSON.stringify({ username: action.payload.username, email: action.payload.email ?? null })).catch(() => {});
    },
    logout(state) {
      state.username = null;
      state.email = null;
      AsyncStorage.removeItem('auth_user').catch(() => {});
    },
    setAuth(state, action: PayloadAction<{ username?: string | null; email?: string | null }>) {
      state.username = action.payload.username ?? null;
      state.email = action.payload.email ?? null;
    },
  },
});

export const { login, logout, setAuth } = slice.actions;
export default slice.reducer;
