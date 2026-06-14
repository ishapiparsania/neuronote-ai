import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Note } from '@/types/note';
import { useAppTheme } from '@/theme';
import { Card } from '@/components/ui';
import { formatRelativeDate, truncateText } from '@/utils/date';

type NoteCardProps = {
  note: Note;
  onPress: () => void;
};

export function NoteCard({ note, onPress }: NoteCardProps) {
  const { colors, typography, spacing } = useAppTheme();

  return (
    <Card onPress={onPress} style={{ marginBottom: spacing.md }}>
      <View style={styles.row}>
        <View style={[styles.accent, { backgroundColor: colors.primary }]} />
        <View style={styles.content}>
          <Text
            style={[typography.subtitle, { color: colors.textPrimary }]}
            numberOfLines={1}>
            {note.title}
          </Text>
          {note.content ? (
            <Text
              style={[
                typography.body,
                { color: colors.textSecondary, marginTop: spacing.xs },
              ]}
              numberOfLines={2}>
              {truncateText(note.content, 120)}
            </Text>
          ) : null}
          <Text
            style={[
              typography.caption,
              { color: colors.textSecondary, marginTop: spacing.sm },
            ]}>
            {formatRelativeDate(note.updatedAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  accent: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: { flex: 1 },
});
