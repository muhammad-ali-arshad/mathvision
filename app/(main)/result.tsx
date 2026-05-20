import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useEquationStore } from '@/stores/equationStore';
import { colors } from '@/constants/colors';
import { GradientButton } from '@/components/GradientButton';
import { GlassCard } from '@/components/GlassCard';
import { MathExpression } from '@/components/MathExpression';

export default function ResultScreen() {
  const router = useRouter();
  const { equation, type, result, steps } = useEquationStore();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: colors.bg }}
    >
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 40,
          gap: 24,
        }}
      >
        {/* Success Message */}
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.success,
            }}
          >
            ✓ Solution Found
          </Text>
        </View>

        {/* Equation Card */}
        <GlassCard style={{ alignItems: 'center' }}>
          <MathExpression value={equation} size={18} />
        </GlassCard>

        {/* Badges */}
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: colors.gradientStart,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {type}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.gradientEnd,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              AI Solver
            </Text>
          </View>
        </View>

        {/* Answer Card */}
        <GlassCard style={{ alignItems: 'center' }}>
          <MathExpression value={result} size={26} />
        </GlassCard>

        {/* View Steps Button */}
        <GradientButton
          label="View Steps →"
          onPress={() => router.push('/(main)/explainer' as any)}
        />

        {/* Back to Home */}
        <Pressable onPress={() => router.replace('/(main)/home' as any)}>
          <Text
            style={{
              color: colors.subtext,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            Back to Home
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
