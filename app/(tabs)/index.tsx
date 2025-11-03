// app/index.tsx
import React, { useEffect } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, Platform, StyleSheet, Image } from 'react-native';
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchMovies } from '../../redux/movieSlice';
import MovieCard from '../../components/MovieCard';

export default function Home() {
  const dispatch = useAppDispatch();
  const { movies, status } = useAppSelector((s) => s.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={movies}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={() => dispatch(fetchMovies())} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 48, alignItems: 'center' }}>
            <Text>No items. Pull to refresh.</Text>
          </View>
        )}
      />
      <Link href="/signup" asChild>
        <TouchableOpacity
          style={StyleSheet.flatten([
            { backgroundColor: '#6C63FF', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginBottom: 10 },
            { backgroundColor: '#8C7BFF' },
          ])}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Sign Up</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
