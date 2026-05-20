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

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.bg }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <GlassCard style={{ alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 32 }}>✅</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.success,
                textAlign: 'center',
              }}
            >
              Check your email to confirm your account
            </Text>
            <Pressable
              onPress={() => router.replace('/(auth)/login' as any)}
              style={{ marginTop: 16 }}
            >
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Back to Login
              </Text>
            </Pressable>
          </GlassCard>
        </View>
      </ScrollView>
    );
  }

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
              Create Account
            </Text>

            {/* Full Name Input */}
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={colors.subtext}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
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

            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Confirm Password Input */}
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
                placeholder="Confirm Password"
                placeholderTextColor={colors.subtext}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  color: colors.text,
                  fontSize: 16,
                }}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ padding: 8 }}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.accent}
                />
              </Pressable>
            </View>

            {/* Error Message */}
            {error ? (
              <Text style={{ color: colors.error, fontSize: 14 }}>{error}</Text>
            ) : null}

            {/* Sign Up Button */}
            <GradientButton
              label="Create Account"
              onPress={handleSignUp}
              loading={loading}
            />
          </GlassCard>

          {/* Bottom Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            <Text style={{ color: colors.subtext, fontSize: 14 }}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.replace('/(auth)/login' as any)}>
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
