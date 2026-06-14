import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { Button } from './Button';

type EmptyStateProps = {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = '📝',
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors, typography, spacing } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text
        style={[
          typography.title,
          { color: colors.textPrimary, textAlign: 'center' },
        ]}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            typography.body,
            {
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.sm,
            },
          ]}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: spacing.xl, width: '100%' }}>
          <Button title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
});
