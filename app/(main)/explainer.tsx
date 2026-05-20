import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useEquationStore } from '@/stores/equationStore';
import { colors } from '@/constants/colors';
import { GlassCard } from '@/components/GlassCard';
import { MathExpression } from '@/components/MathExpression';

export default function ExplainerScreen() {
  const router = useRouter();
  const { steps } = useEquationStore();

  if (!steps || steps.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: colors.text, textAlign: 'center' }}>
          No steps available for this solution.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: colors.bg }}
    >
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 40,
          gap: 18,
        }}
      >
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.text,
            }}
          >
            Solution Steps
          </Text>
          <Text style={{ color: colors.subtext, fontSize: 14 }}>
            {steps.length} step{steps.length === 1 ? '' : 's'}
          </Text>
        </View>

        {steps.map((step, index) => (
          <GlassCard key={`${step.stepNumber}-${index}`} style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: colors.gradientStart,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 13,
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Step {index + 1}
              </Text>
            </View>

            <MathExpression value={step.math} size={20} />

            <Text
              style={{
                fontSize: 15,
                color: colors.subtext,
                lineHeight: 22,
              }}
            >
              {step.explanation}
            </Text>
          </GlassCard>
        ))}

        <Pressable
          onPress={() => router.replace('/(main)/home' as any)}
          style={{ paddingVertical: 12 }}
        >
          <Text
            style={{
              color: colors.accent,
              fontSize: 14,
              fontWeight: '600',
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
