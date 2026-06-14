import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '@/theme';

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  rightAction?: { label: string; onPress: () => void };
};

export function ScreenHeader({
  title,
  showBack = false,
  rightAction,
}: ScreenHeaderProps) {
  const { colors, typography, spacing } = useAppTheme();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.row,
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}>
      {showBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={styles.side}>
          <Text style={[typography.bodyLarge, { color: colors.primary }]}>
            ← Back
          </Text>
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <Text
        style={[typography.subtitle, { color: colors.textPrimary, flex: 1 }]}
        numberOfLines={1}>
        {title}
      </Text>
      {rightAction ? (
        <Pressable onPress={rightAction.onPress} hitSlop={8} style={styles.side}>
          <Text
            style={[
              typography.body,
              { color: colors.primary, textAlign: 'right' },
            ]}>
            {rightAction.label}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: { width: 72 },
});
