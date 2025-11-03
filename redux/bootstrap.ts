// redux/bootstrap.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './store';
import { loadFavs } from './favouritesSlice';
import { setUsername } from './authSlice';

export async function bootstrap() {
  const [favsRaw, user] = await Promise.all([AsyncStorage.getItem('favs'), AsyncStorage.getItem('auth_user')]);
  if (favsRaw) {
    try {
      const favs = JSON.parse(favsRaw) as string[];
      store.dispatch(loadFavs(favs));
    } catch {}
  }
  if (user) store.dispatch(setUsername(user));
}
