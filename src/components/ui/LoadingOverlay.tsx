import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme';

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

export function LoadingOverlay({
  visible,
  message = 'Loading…',
}: LoadingOverlayProps) {
  const { colors, typography, spacing } = useAppTheme();

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.box,
            { backgroundColor: colors.surface, padding: spacing.xl },
          ]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              typography.body,
              { color: colors.textPrimary, marginTop: spacing.md },
            ]}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 160,
  },
});
