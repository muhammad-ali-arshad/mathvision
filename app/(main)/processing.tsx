import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { useEquationStore } from '@/stores/equationStore';
import { colors } from '@/constants/colors';
import { getApiBaseUrl } from '@/constants/oauth';
import { MathExpression } from '@/components/MathExpression';

const STEPS = [
  'Parsing equation',
  'Detecting type',
  'Solving symbolically',
  'Generating steps',
  'Formatting result',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const { equation, setResult } = useEquationStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < STEPS.length) {
        setCurrentStep(stepIndex);

        // Animate pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 400,
              useNativeDriver: false,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: false,
            }),
          ])
        ).start();

        // Mark as done after 800ms
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, stepIndex]);
        }, 800);

        stepIndex++;
      } else {
        clearInterval(interval);
        // All steps done, call API
        callSolveAPI();
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const getSolveApiBaseUrl = () => {
    const configuredBase = getApiBaseUrl();
    if (configuredBase) {
      return configuredBase;
    }

    const hostUri = Constants.expoConfig?.hostUri ?? '';
    if (hostUri) {
      const host = hostUri.split(':')[0];
      if (host) {
        return `http://${host}:3000`;
      }
    }

    return 'http://localhost:3000';
  };

  const callSolveAPI = async () => {
    try {
      const apiUrl = getSolveApiBaseUrl();
      const response = await fetch(`${apiUrl}/api/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equation }),
      });

      const data = await response.json();
      setResult(data.type, data.result, data.steps);
      router.replace('/(main)/result' as any);
    } catch (error) {
      console.error('Error solving equation:', error);
      router.replace('/(main)/home' as any);
    }
  };

  const getStepState = (index: number) => {
    if (completedSteps.includes(index)) {
      return 'done';
    }
    if (currentStep === index) {
      return 'active';
    }
    return 'waiting';
  };

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
      <View style={{ gap: 24, alignItems: 'center' }}>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: colors.text,
            }}
          >
            Solving…
          </Text>
          <MathExpression value={equation} color={colors.accent} size={18} />
        </View>

        {/* Timeline */}
        <View style={{ gap: 0, alignItems: 'center' }}>
          {STEPS.map((step, index) => {
            const stepState = getStepState(index);
            const isActive = stepState === 'active';

            return (
              <View key={index} style={{ alignItems: 'center' }}>
                {/* Circle */}
                <Animated.View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor:
                      stepState === 'done'
                        ? colors.success
                        : stepState === 'active'
                        ? colors.gradientStart
                        : colors.subtext,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [
                      {
                        scale: isActive ? pulseAnim : new Animated.Value(1),
                      },
                    ],
                  }}
                >
                  {stepState === 'done' && (
                    <Text style={{ color: colors.text, fontSize: 12 }}>✓</Text>
                  )}
                </Animated.View>

                {/* Step Label */}
                <Text
                  style={{
                    color: colors.subtext,
                    fontSize: 12,
                    marginTop: 8,
                    marginBottom: 16,
                  }}
                >
                  {step}
                </Text>

                {/* Connecting Line */}
                {index < STEPS.length - 1 && (
                  <View
                    style={{
                      width: 1,
                      height: 32,
                      backgroundColor: colors.border,
                      marginBottom: 0,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
