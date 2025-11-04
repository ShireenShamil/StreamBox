// app/index.tsx
import React, { useEffect } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, Platform, StyleSheet, Image } from 'react-native';
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchMovies } from '../../redux/movieSlice';
import MovieCard from '../../components/MovieCard';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

export default function Home() {
  const dispatch = useAppDispatch();
  const { movies, status } = useAppSelector((s) => s.movies);
  const auth = useAppSelector((s) => s.auth);
  const listRef = React.useRef<FlatList<any> | null>(null);
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];

  React.useEffect(() => {
    const ev = require('../../utils/eventBus');
    const unsub = ev.subscribe('home:goHome', () => {
      // scroll to top and refresh
      if (listRef.current) {
        try {
          listRef.current.scrollToOffset({ offset: 0, animated: true });
        } catch {}
      }
      dispatch(fetchMovies());
    });
    return unsub;
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
  <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        ref={(r) => { listRef.current = r; }}
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
      {!auth?.username ? (
        <Link href="/signup" asChild>
          <TouchableOpacity
            style={StyleSheet.flatten([
              { backgroundColor: theme.tint, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginBottom: 10 },
              { backgroundColor: theme.tint },
            ])}
          >
            <Text style={{ color: theme.background, fontWeight: '600', fontSize: 16 }}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      ) : null}
    </View>
  );
}
