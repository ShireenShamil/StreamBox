// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = { username: string | null };
const initialState: State = { username: null };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string }>) {
      state.username = action.payload.username;
      AsyncStorage.setItem('auth_user', action.payload.username).catch(() => {});
    },
    logout(state) {
      state.username = null;
      AsyncStorage.removeItem('auth_user').catch(() => {});
    },
    setUsername(state, action: PayloadAction<string | null>) {
      state.username = action.payload;
    },
  },
});

export const { login, logout, setUsername } = slice.actions;
export default slice.reducer;
