// components/MovieCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavourite } from '../redux/favouritesSlice';
import { Feather } from '@expo/vector-icons';

type Movie = {
  id: string;
  title: string;
  description: string;
  image?: string;
  movie_banner?: string;
  release_date?: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.favourites.ids.includes(movie.id));
  const { isDark } = useTheme();
  const bg = isDark ? stylesDark.container : null;
  const textColor = isDark ? '#fff' : '#111';

  return (
    <TouchableOpacity onPress={() => router.push(`/details?id=${movie.id}`)} style={[cardStyles.container, bg]}>
      <Image source={{ uri: movie.image || movie.movie_banner }} style={cardStyles.image} />
      <View style={cardStyles.content}>
        <Text numberOfLines={1} style={[cardStyles.title, { color: textColor }]}>{movie.title}</Text>
        <Text numberOfLines={2} style={[cardStyles.desc, { color: isDark ? '#ccc' : '#666' }]}>{movie.description}</Text>
        <View style={cardStyles.row}>
          <TouchableOpacity onPress={() => dispatch(toggleFavourite(movie.id))}>
            <Feather name="heart" size={18} color={isFav ? 'crimson' : '#333'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = StyleSheet.create({
  container: { flexDirection: 'row', marginVertical: 8, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 1 },
  image: { width: 110, height: 110 },
  content: { flex: 1, padding: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  desc: { marginTop: 6 },
  row: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

const styles = StyleSheet.create({});

const stylesDark = StyleSheet.create({
  container: { backgroundColor: '#0b1220' },
});
