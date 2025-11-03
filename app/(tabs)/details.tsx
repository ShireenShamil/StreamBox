// app/details.tsx
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleFavourite } from '../../redux/favouritesSlice';
import { Feather } from '@expo/vector-icons';

export default function Details() {
  const params = useLocalSearchParams();
  const id = (params.id as string) ?? '';
  const movie = useAppSelector((s) => s.movies.movies.find((m) => m.id === id));
  const isFav = useAppSelector((s) => s.favourites.ids.includes(id));
  const dispatch = useAppDispatch();

  if (!movie) return <View style={{ padding: 16 }}><Text>Item not found</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: movie.image || movie.movie_banner }} style={{ width: '100%', height: 220, borderRadius: 12 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>{movie.title}</Text>
        <TouchableOpacity onPress={() => dispatch(toggleFavourite(movie.id))}>
          <Feather name={isFav ? 'heart' : 'heart'} size={22} color={isFav ? 'crimson' : '#333'} />
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 8, color: '#666' }}>{movie.release_date} • {movie.running_time} min</Text>
      <Text style={{ marginTop: 12, lineHeight: 20 }}>{movie.description}</Text>
    </ScrollView>
  );
}
