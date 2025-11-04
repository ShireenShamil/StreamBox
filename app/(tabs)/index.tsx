// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, Platform, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
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
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const listRef = React.useRef<FlatList<any> | null>(null);
  const inputRef = React.useRef<any>(null);
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

  React.useEffect(() => {
    const ev = require('../../utils/eventBus');
    const unsub2 = ev.subscribe('home:focusSearch', () => {
      try {
        inputRef.current?.focus();
      } catch {}
    });
    return unsub2;
  }, []);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const filtered = movies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));
  const visible = filtered.slice(0, visibleCount);

  return (
  <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 12 }}>
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search movies..."
          placeholderTextColor={isDark ? '#9BA1A6' : '#888'}
          style={{ backgroundColor: isDark ? '#0f1720' : '#fff', padding: 10, borderRadius: 8, color: theme.text }}
        />
      </View>
      <FlatList
        ref={(r) => { listRef.current = r; }}
        data={visible}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={() => dispatch(fetchMovies())} tintColor={theme.tint} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReached={() => {
          if (visibleCount < filtered.length) setVisibleCount((c) => c + 12);
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (visibleCount < filtered.length ? <ActivityIndicator style={{ margin: 12 }} color={theme.tint} /> : null)}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 48, alignItems: 'center' }}>
            <Text style={{ color: theme.text }}>No items. Pull to refresh.</Text>
          </View>
        )}
      />
      {!auth?.username ? (
        <Link href="/signup" asChild>
          <TouchableOpacity
            style={{ backgroundColor: theme.tint, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginBottom: 10, alignSelf: 'center' }}
          >
            <Text style={{ color: theme.background, fontWeight: '600', fontSize: 16 }}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      ) : null}
    </View>
  );
}
