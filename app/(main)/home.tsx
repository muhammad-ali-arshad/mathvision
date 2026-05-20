import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useEquationStore } from '@/stores/equationStore';
import { colors } from '@/constants/colors';
import { GradientButton } from '@/components/GradientButton';
import { GlassCard } from '@/components/GlassCard';

const QUICK_EQUATIONS = [
  'x² − 5x + 6 = 0',
  '∫ x² dx',
  'sin²(x) + cos²(x)',
  'dy/dx + y = eˣ',
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setEquation } = useEquationStore();
  const [equation, setLocalEquation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!equation.trim()) {
      return;
    }

    setLoading(true);
    setEquation(equation);

    try {
      router.push('/(main)/processing' as any);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChipPress = (eq: string) => {
    setLocalEquation(eq);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login' as any);
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'User';
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 24, paddingVertical: 20, gap: 24 }}>
          {/* Top Bar */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.text,
              }}
            >
              Hi, {userName.split(' ')[0]} 👋
            </Text>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.gradientStart,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: 'bold',
                  fontSize: 14,
                }}
              >
                {initials}
              </Text>
            </View>
          </View>

          {/* Input Card */}
          <GlassCard style={{ gap: 16 }}>
            <TextInput
              placeholder="Enter your equation…"
              placeholderTextColor={colors.subtext}
              value={equation}
              onChangeText={setLocalEquation}
              multiline
              style={{
                color: colors.text,
                fontSize: 16,
                fontFamily: 'Courier New',
                minHeight: 80,
                textAlignVertical: 'top',
              }}
            />
            <GradientButton
              label="Solve"
              onPress={handleSolve}
              loading={loading}
              disabled={!equation.trim()}
            />
          </GlassCard>

          {/* Quick Equations */}
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.subtext,
              }}
            >
              Quick Examples
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {QUICK_EQUATIONS.map((eq, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleChipPress(eq)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 20,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 12,
                      fontFamily: 'Courier New',
                    }}
                  >
                    {eq}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 24,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Pressable onPress={handleLogout}>
          <Text
            style={{
              color: colors.subtext,
              fontSize: 12,
              textAlign: 'center',
            }}
          >
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
