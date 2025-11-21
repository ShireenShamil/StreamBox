// app/details.tsx
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, ScrollView, TouchableOpacity, Share, Linking } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleFavourite, addFavourite, removeFavourite } from '../../redux/favouritesSlice';
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
  const auth = useAppSelector((s) => s.auth);
  const toast = useToast();
  const router = useRouter();
  const { isDark } = useTheme();
  const theme = Colors[isDark ? 'dark' : 'light'];

  if (!movie) return <View style={{ padding: 16, backgroundColor: theme.background }}><Text style={{ color: theme.text }}>Item not found</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.background }}>
      <Image source={{ uri: movie.image || movie.movie_banner }} style={{ width: '100%', height: 220, borderRadius: 12 }} />
      {/* Action buttons: Watch Now, Download, Watch Trailer */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <TouchableOpacity
          onPress={() => {
            // navigate to a player screen if available; fallback to toast
            try {
              // push to a player route; cast to any to avoid strict route typing if route isn't declared
              router.push((`/player?id=${movie.id}`) as any);
            } catch (e) {
              toast.show('Cannot open player');
            }
          }}
          style={{ flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.tint }}
        >
          <Text style={{ color: theme.background, fontWeight: '700' }}>Watch Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            // Try to open the image/banner URL so user can save it; show toast as fallback
            const url = movie.movie_banner || movie.image;
            if (url) {
              try {
                await Linking.openURL(url);
                toast.show('Opened media — use your browser to save');
              } catch (e) {
                toast.show('Could not open media');
              }
            } else {
              toast.show('No downloadable media available');
            }
          }}
          style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.tint, backgroundColor: theme.background }}
        >
          <Text style={{ color: theme.tint, fontWeight: '700' }}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            // Placeholder: open a YouTube search for trailer
            const q = encodeURIComponent(`${movie.title} trailer`);
            const url = `https://www.youtube.com/results?search_query=${q}`;
            try {
              await Linking.openURL(url);
            } catch (e) {
              toast.show('Could not open trailer');
            }
          }}
          style={{ paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background, borderWidth: 1, borderColor: theme.icon }}
        >
          <Feather name="video" size={16} color={theme.icon} />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text }}>{movie.title}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              if (!auth?.username) {
                toast.show('Please sign in to add favourites');
                router.push(`/login?next=${encodeURIComponent(`/details?id=${movie.id}`)}`);
                return;
              }

              if (isFav) {
                dispatch(removeFavourite(movie.id));
                toast.show('Removed from favourites', 5000, 'Undo', () => dispatch(addFavourite(movie.id)));
              } else {
                dispatch(addFavourite(movie.id));
                toast.show('Added to favourites');
              }
            }}
            style={{ padding: 6 }}
          >
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
      <Text style={{ marginTop: 12, lineHeight: 20, color: theme.text, backgroundColor: isDark ? '#111' : '#e9eef6ff' , padding:10, borderRadius: 8}}>{movie.description}</Text>
    </ScrollView>
  );
}
