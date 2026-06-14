import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '@/theme';
import { EmptyState, SearchBar } from '@/components/ui';
import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from '../components/NoteCard';
import { NotesStackParamList } from '@/types/navigation';
import { loadNotes } from '@/storage/mmkv';
import { useDispatch } from 'react-redux';
import { hydrateNotes } from '@/store/notesSlice';
import { AppDispatch } from '@/store';
import { Note } from '@/types/note';

type Nav = NativeStackNavigationProp<NotesStackParamList, 'NotesList'>;

export function NotesListScreen() {
  const { colors, typography, spacing, shadows } = useAppTheme();
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch<AppDispatch>();
  const { filterNotes } = useNotes();
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredNotes = useMemo(
    () => filterNotes(query),
    [filterNotes, query],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(hydrateNotes(loadNotes()));
    setRefreshing(false);
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteCard
        note={item}
        onPress={() =>
          navigation.navigate('NoteEditor', { noteId: item.id })
        }
      />
    ),
    [navigation],
  );

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top']}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.heading, { color: colors.textPrimary }]}>
          NeuroNote
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginTop: spacing.xs },
          ]}>
          Your AI-powered notes
        </Text>
        <View style={{ marginTop: spacing.lg }}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      </View>

      {filteredNotes.length === 0 ? (
        <EmptyState
          icon={query ? '🔍' : '📝'}
          title={query ? 'No matching notes' : 'No notes yet'}
          subtitle={
            query
              ? 'Try a different search term'
              : 'Create your first note to get started'
          }
          actionLabel={query ? undefined : 'Create Note'}
          onAction={
            query ? undefined : () => navigation.navigate('NoteEditor', {})
          }
        />
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <Pressable
        onPress={() => navigation.navigate('NoteEditor', {})}
        style={({ pressed }) => [
          styles.fab,
          shadows.fab,
          {
            backgroundColor: colors.fab,
            opacity: pressed ? 0.9 : 1,
            bottom: spacing.xl,
            right: spacing.xl,
          },
        ]}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
  },
});
