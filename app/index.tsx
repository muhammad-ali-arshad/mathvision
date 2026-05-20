import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import type { RelativePathString } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/constants/colors';

export default function SplashScreen() {
  const router = useRouter();
  const { session } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        router.replace('/home' as RelativePathString);
      } else {
        router.replace('/login' as RelativePathString);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, router]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        <Text
          style={{
            fontSize: 44,
            fontWeight: 'bold',
            color: colors.text,
            textShadowColor: colors.gradientStart,
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 8,
          }}
        >
          MathVision
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: colors.accent,
            fontWeight: '500',
          }}
        >
          Your AI Math Tutor
        </Text>
        <ActivityIndicator
          size={60}
          color={colors.gradientStart}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}
