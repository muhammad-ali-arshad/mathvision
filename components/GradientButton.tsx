import React from 'react';
import { Pressable, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export function GradientButton({
  label,
  onPress,
  loading = false,
  style,
  disabled = false,
}: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        {
          opacity: pressed && !loading && !disabled ? 0.8 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 52,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
