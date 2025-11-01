import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ThemedText } from '@/components/themed-text';
import { FormInput } from '@/components/atoms/FormInput';
import { FormButton } from '@/components/atoms/FormButton';
import { useAuth } from '@/contexts/AuthContext';

interface SignInFormData {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().trim().lowercase().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);

    try {
      console.log('🔐 Attempting sign in for:', data.email);

      const { error } = await signIn(data.email, data.password);

      console.log('📧 Sign in response:', { error });

      if (error) {
        console.error('❌ Sign in error:', error);
        Alert.alert('Sign In Failed', error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      console.log('✅ Sign in successful! Redirecting to home...');

      // Reset loading and navigate manually
      setLoading(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('💥 Unexpected sign in error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        <View className="flex-1 px-6 pt-20 pb-8">
          {/* Modern Minimal Header */}
          <View className="mb-12">
            {/* Logo/Brand - Subtle & Modern */}
            <View className="mb-8">
              <View className="w-16 h-16 bg-[#3B2F2F] rounded-2xl justify-center items-center mb-6">
                <ThemedText className="text-[28px] font-[PlayfairDisplay_700Bold]" style={{ color: '#FFFFFF' }}>
                  T
                </ThemedText>
              </View>
              <ThemedText className="text-[40px] font-[PlayfairDisplay_700Bold] leading-tight mb-3" style={{ color: '#3B2F2F' }}>
                Welcome{'\n'}Back
              </ThemedText>
              <ThemedText className="text-[15px] font-[NunitoSans_400Regular] leading-relaxed" style={{ color: '#6B7280' }}>
                Sign in to your account to continue
              </ThemedText>
            </View>
          </View>

          {/* Form - No Card, Clean & Minimal */}
          <View className="flex-1">
            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Email Address"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(text.toLowerCase())}
                  error={errors.email?.message}
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  isPassword
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity className="items-end mb-8">
              <ThemedText className="text-[14px] font-[NunitoSans_600SemiBold]" style={{ color: '#3B2F2F' }}>
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            {/* Sign In Button */}
            <FormButton
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              variant="primary"
            />

            {/* Sign Up Link */}
            <View className="mt-8">
              <View className="flex-row justify-center items-center">
                <ThemedText className="text-[14px] font-[NunitoSans_400Regular]" style={{ color: '#6B7280' }}>
                  Don't have an account?{' '}
                </ThemedText>
                <Link href="/(auth)/signup" asChild>
                  <TouchableOpacity>
                    <ThemedText className="text-[14px] font-[NunitoSans_700Bold]" style={{ color: '#3B2F2F' }}>
                      Sign Up
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          {/* Bottom Branding - Subtle */}
          <View className="mt-auto pt-8 pb-4">
            <ThemedText className="text-center text-xs font-[NunitoSans_400Regular]" style={{ color: '#9CA3AF' }}>
              ThriftVerse • Sustainable Fashion Marketplace
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
