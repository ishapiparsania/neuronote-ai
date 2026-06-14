import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useAppTheme } from '@/theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...props }: InputProps) {
  const { colors, typography, spacing } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, marginBottom: spacing.xs },
          ]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={[
          typography.bodyLarge,
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary,
            padding: spacing.md,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text
          style={[
            typography.caption,
            { color: colors.error, marginTop: spacing.xs },
          ]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 48,
  },
});
