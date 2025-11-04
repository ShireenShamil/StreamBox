// app/favorites.tsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { useAppSelector } from '../../hooks';
import MovieCard from '../../components/MovieCard';
import { useToast } from '../../components/Toast';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

export default function Favourites() {
  const favIds = useAppSelector((s) => s.favourites.ids);
  const movies = useAppSelector((s) => s.movies.movies.filter((m) => favIds.includes(m.id)));

  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In a real app we'd re-fetch data; here we'll simulate and show a toast
    setTimeout(() => {
      setRefreshing(false);
      toast.show('Refreshed');
    }, 700);
  }, [toast]);

  if (!movies.length) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}><Text style={{ color: theme.text }}>No favourites yet.</Text></View>;
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(m) => m.id}
      renderItem={({ item }) => <MovieCard movie={item} />}
      contentContainerStyle={{ paddingVertical: 12, backgroundColor: theme.background }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
    />
  );
}
