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
  // UX fields added: status and category
  status?: 'Active' | 'Upcoming' | 'Popular';
  category?: string;
};

type State = { movies: Movie[]; status: 'idle' | 'loading' | 'failed' };

const initialState: State = { movies: [], status: 'idle' };

export const fetchMovies = createAsyncThunk('movies/fetch', async () => {
  const res = await axios.get<Movie[]>('https://ghibliapi.vercel.app/films');
  const nowYear = new Date().getFullYear();
  const categories = ['Drama', 'Fantasy', 'Adventure', 'Sci-Fi', 'Family', 'Romance'];

  const pick = (seed: string, arr: string[]) => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return arr[Math.abs(h) % arr.length];
  };

  const determineStatus = (release?: string, seed?: string) => {
    const year = parseInt(release || '0', 10) || 0;
    if (year > nowYear) return 'Upcoming' as const;
    if (year >= nowYear - 5) return 'Active' as const;
    // fallback: use seed to pseudo-randomly mark some as Popular
    const pickVal = Math.abs(seed ? seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0) % 10;
    return pickVal > 7 ? 'Popular' as const : 'Active' as const;
  };

  return res.data.map((m) => {
    const image = m.image || m.movie_banner || `https://picsum.photos/seed/${encodeURIComponent(m.id)}/300/200`;
    const category = pick(m.title || m.id, categories);
    const status = determineStatus(m.release_date, m.id || m.title || '');
    return { ...m, image, category, status };
  });
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
