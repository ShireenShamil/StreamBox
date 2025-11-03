// components/MovieCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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

  return (
    <TouchableOpacity onPress={() => router.push(`/details?id=${movie.id}`)} style={cardStyles.container}>
      <Image source={{ uri: movie.image || movie.movie_banner }} style={cardStyles.image} />
      <View style={cardStyles.content}>
        <Text numberOfLines={1} style={cardStyles.title}>{movie.title}</Text>
        <Text numberOfLines={2} style={cardStyles.desc}>{movie.description}</Text>
        <View style={cardStyles.row}>
          <TouchableOpacity onPress={() => dispatch(toggleFavourite(movie.id))}>
            <Feather name="heart" size={18} color={isFav ? 'crimson' : '#333'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const cardStyles = {
  container: { flexDirection: 'row', marginVertical: 8, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 1 } as any,
  image: { width: 110, height: 110 } as any,
  content: { flex: 1, padding: 12 } as any,
  title: { fontSize: 16, fontWeight: '700' } as any,
  desc: { marginTop: 6, color: '#666' } as any,
  row: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as any,
};
