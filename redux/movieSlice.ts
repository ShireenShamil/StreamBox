// redux/movieSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export type Movie = {
  id: string;
  title: string;
  description: string;
  director?: string;
  producer?: string;
  release_date?: string;
  running_time?: string;
  image?: string;
  movie_banner?: string;
};

type State = { movies: Movie[]; status: 'idle' | 'loading' | 'failed' };

const initialState: State = { movies: [], status: 'idle' };

export const fetchMovies = createAsyncThunk('movies/fetch', async () => {
  const res = await axios.get<Movie[]>('https://ghibliapi.vercel.app/films');
  return res.data.map((m) => ({ ...m, image: m.image || m.movie_banner || `https://picsum.photos/seed/${encodeURIComponent(m.id)}/300/200` }));
});

const slice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMovies.pending, (s) => { s.status = 'loading'; });
    b.addCase(fetchMovies.fulfilled, (s, a) => { s.status = 'idle'; s.movies = a.payload; });
    b.addCase(fetchMovies.rejected, (s) => { s.status = 'failed'; });
  },
});

export default slice.reducer;
