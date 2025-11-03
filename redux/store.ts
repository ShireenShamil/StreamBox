// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './movieSlice';
import favouritesReducer from './favouritesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    favourites: favouritesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
