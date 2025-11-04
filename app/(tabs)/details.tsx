// app/details.tsx
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleFavourite } from '../../redux/favouritesSlice';
import { Feather } from '@expo/vector-icons';
import { useToast } from '../../components/Toast';
import { useTheme } from '../../theme/theme';
import { Colors } from '../../constants/theme';

export default function Details() {
  const params = useLocalSearchParams();
  const id = (params.id as string) ?? '';
  const movie = useAppSelector((s) => s.movies.movies.find((m) => m.id === id));
  const isFav = useAppSelector((s) => s.favourites.ids.includes(id));
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];
  const toast = useToast();

  if (!movie) return <View style={{ padding: 16, backgroundColor: theme.background }}><Text style={{ color: theme.text }}>Item not found</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.background }}>
      <Image source={{ uri: movie.image || movie.movie_banner }} style={{ width: '100%', height: 220, borderRadius: 12 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text }}>{movie.title}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => dispatch(toggleFavourite(movie.id))} style={{ padding: 6 }}>
            <Feather name={isFav ? 'heart' : 'heart'} size={22} color={isFav ? 'crimson' : theme.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              try {
                await Share.share({ message: `${movie.title}\n\n${movie.description?.slice(0, 200) ?? ''}` });
              } catch (e: any) {
                toast.show('Could not share');
              }
            }}
            style={{ padding: 6 }}
          >
            <Feather name="share-2" size={20} color={theme.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ marginTop: 8, color: isDark ? '#ccc' : '#666' }}>{movie.release_date} • {movie.running_time} min</Text>
      <Text style={{ marginTop: 12, lineHeight: 20, color: theme.text }}>{movie.description}</Text>
    </ScrollView>
  );
}
