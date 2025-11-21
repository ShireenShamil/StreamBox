// components/MovieCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';
import { Colors } from '../constants/theme';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavourite, addFavourite, removeFavourite } from '../redux/favouritesSlice';
import { useToast } from './Toast';
import { Feather } from '@expo/vector-icons';

type Movie = {
  id: string;
  title: string;
  description: string;
  image?: string;
  movie_banner?: string;
  release_date?: string;
  status?: 'Active' | 'Upcoming' | 'Popular';
  category?: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.favourites.ids.includes(movie.id));
  const auth = useAppSelector((s) => s.auth);
  const toast = useToast();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const textColor = theme.text;

  return (
    <TouchableOpacity onPress={() => router.push(`/details?id=${movie.id}`)} style={[cardStyles.container, { backgroundColor: isDark ? '#292a2cff' : '#e9eef6ff' }]}>
      <Image source={{ uri: movie.image || movie.movie_banner }} style={cardStyles.image} />
      <View style={cardStyles.content}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text numberOfLines={1} style={[cardStyles.title, { color: textColor }]}>{movie.title}</Text>
          {movie.status ? (
            <View style={[cardStyles.status, { backgroundColor: movie.status === 'Upcoming' ? '#f59e0b' : movie.status === 'Popular' ? '#8b5cf6' : '#10b981' }]}>
              <Text style={cardStyles.statusText}>{movie.status}</Text>
            </View>
          ) : null}
        </View>
        <Text numberOfLines={2} style={[cardStyles.desc, { color: theme.icon }]}>{movie.description}</Text>
        <View style={cardStyles.rowBetween}>
          {movie.category ? <Text style={[cardStyles.category, { color: theme.tint }]}>{movie.category}</Text> : <Text />}
          <TouchableOpacity
            onPress={() => {
              if (!auth?.username) {
                // redirect to login and return to current page (home)
                toast.show('Please sign in to add favourites');
                router.push(`/login?next=${encodeURIComponent('/')}`);
                return;
              }

              if (isFav) {
                // remove and show undo
                dispatch(removeFavourite(movie.id));
                toast.show('Removed from favourites', 5000, 'Undo', () => dispatch(addFavourite(movie.id)));
              } else {
                dispatch(addFavourite(movie.id));
                toast.show('Added to favourites');
              }
            }}
          >
            <Feather name="heart" size={18} color={isFav ? 'crimson' : theme.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  container: { flexDirection: 'row', marginVertical: 8, borderRadius: 12, overflow: 'hidden', elevation: 1 },
  image: { width: 110, height: 120 },
  content: { flex: 1, padding: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  desc: { marginTop: 6 },
  category: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  status: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  row: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBetween: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

const styles = StyleSheet.create({});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
});
