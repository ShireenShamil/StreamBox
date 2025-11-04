// redux/bootstrap.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './store';
import { loadFavs } from './favouritesSlice';
import { setAuth } from './authSlice';

export async function bootstrap() {
  const [favsRaw, userRaw] = await Promise.all([AsyncStorage.getItem('favs'), AsyncStorage.getItem('auth_user')]);
  if (favsRaw) {
    try {
      const favs = JSON.parse(favsRaw) as string[];
      store.dispatch(loadFavs(favs));
    } catch {}
  }
  if (userRaw) {
    try {
      const parsed = JSON.parse(userRaw) as { username?: string | null; email?: string | null };
      store.dispatch(setAuth({ username: parsed.username ?? null, email: parsed.email ?? null }));
    } catch {
      // older format might be plain username string
      store.dispatch(setAuth({ username: userRaw }));
    }
  }
}
