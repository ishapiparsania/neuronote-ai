import React, { useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppTheme } from '@/theme';
import { Button, Input, ScreenHeader } from '@/components/ui';
import { useNotes } from '@/hooks/useNotes';
import { NotesStackParamList } from '@/types/navigation';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string(),
});

type FormData = z.infer<typeof schema>;
type Route = RouteProp<NotesStackParamList, 'NoteEditor'>;

export function NoteEditorScreen() {
  const { colors, spacing } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { noteId } = route.params ?? {};
  const { getNoteById, createNote, editNote, removeNote } = useNotes();
  const isEditing = Boolean(noteId);
  const existingNote = noteId ? getNoteById(noteId) : undefined;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '' },
  });

  useEffect(() => {
    if (existingNote) {
      reset({ title: existingNote.title, content: existingNote.content });
    }
  }, [existingNote, reset]);

  const onSubmit = (data: FormData) => {
    if (isEditing && noteId) {
      editNote(noteId, data.title, data.content);
    } else {
      createNote(data.title, data.content);
    }
    navigation.goBack();
  };

  const onDelete = () => {
    if (!noteId) return;
    Alert.alert('Delete Note', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeNote(noteId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}>
      <ScreenHeader
        title={isEditing ? 'Edit Note' : 'New Note'}
        showBack
        rightAction={{ label: 'Save', onPress: handleSubmit(onSubmit) }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
          keyboardShouldPersistTaps="handled">
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Title"
                placeholder="Note title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Content"
                placeholder="Write your note…"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={10}
                style={{ minHeight: 200, textAlignVertical: 'top' }}
              />
            )}
          />
          {isEditing ? (
            <View style={{ marginTop: spacing.md }}>
              <Button title="Delete Note" onPress={onDelete} variant="danger" />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
