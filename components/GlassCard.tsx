import React from 'react';
import { View, ViewProps } from 'react-native';
import { colors } from '@/constants/colors';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export function GlassCard({ children, style, ...props }: GlassCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 20,
          padding: 20,
          shadowColor: colors.gradientStart,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
