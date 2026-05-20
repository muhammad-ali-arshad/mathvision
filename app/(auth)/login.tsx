import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { colors } from '@/constants/colors';
import { GradientButton } from '@/components/GradientButton';
import { GlassCard } from '@/components/GlassCard';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.replace('/(main)/home' as any);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.bg }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 40,
            justifyContent: 'space-between',
          }}
        >
          {/* Top Section */}
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: 'bold',
                color: colors.text,
              }}
            >
              MathVision
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.subtext,
              }}
            >
              Solve. Learn. Understand.
            </Text>
          </View>

          {/* Middle Section */}
          <GlassCard style={{ gap: 16 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: colors.text,
              }}
            >
              Welcome Back
            </Text>

            {/* Email Input */}
            <View>
              <TextInput
                placeholder="Email"
                placeholderTextColor={colors.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.bg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16,
                }}
              />
            </View>

            {/* Password Input */}
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.bg,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                }}
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor={colors.subtext}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    color: colors.text,
                    fontSize: 16,
                  }}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ padding: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.accent}
                  />
                </Pressable>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <Text style={{ color: colors.error, fontSize: 14 }}>{error}</Text>
            ) : null}

            {/* Sign In Button */}
            <GradientButton
              label="Sign In"
              onPress={handleSignIn}
              loading={loading}
            />
          </GlassCard>

          {/* Bottom Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text style={{ color: colors.subtext, fontSize: 14 }}>
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push('/(auth)/signup' as any)}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
