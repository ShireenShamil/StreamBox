// app/favorites.tsx
import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useAppSelector } from '../../hooks';
import MovieCard from '../../components/MovieCard';

export default function Favourites() {
  const favIds = useAppSelector((s) => s.favourites.ids);
  const movies = useAppSelector((s) => s.movies.movies.filter((m) => favIds.includes(m.id)));

  if (!movies.length) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>No favourites yet.</Text></View>;
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => <MovieCard movie={item} />}
      contentContainerStyle={{ paddingVertical: 12 }}
    />
  );
}
