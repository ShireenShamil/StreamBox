// redux/favouritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = { ids: string[] };
const initialState: State = { ids: [] };

const slice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    loadFavs(state, action: PayloadAction<string[]>) {
      state.ids = action.payload;
    },
    toggleFavourite(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx >= 0) state.ids.splice(idx, 1);
      else state.ids.push(id);
      AsyncStorage.setItem('favs', JSON.stringify(state.ids)).catch(() => {});
    },
    clearFavs(state) {
      state.ids = [];
      AsyncStorage.setItem('favs', JSON.stringify(state.ids)).catch(() => {});
    },
  },
});

export const { loadFavs, toggleFavourite, clearFavs } = slice.actions;
export default slice.reducer;

