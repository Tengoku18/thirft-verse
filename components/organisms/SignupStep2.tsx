import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { FormButton } from '@/components/atoms/FormButton';
import { supabase } from '@/lib/supabase';
import { createUserProfile } from '@/lib/database-helpers';

interface SignupStep2Props {
  email: string;
  password: string;
  name: string;
  username: string;
  profileImage: string | null;
  onNext: () => void;
  onBack: () => void;
}

export const SignupStep2: React.FC<SignupStep2Props> = ({ email, password, name, username, profileImage, onNext, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Verifying OTP:', { email, code: otpCode });

      // Use 'magiclink' type since we used signInWithOtp (not signup)
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'magiclink', // Changed from 'email' to 'magiclink'
      });

      console.log('📧 OTP verification response:', { data, error });

      if (error) {
        console.error('❌ Verification error:', error);
        Alert.alert('Verification Failed', error.message || 'Invalid or expired code. Please try again.');
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('✅ OTP verified successfully! User ID:', data.user.id);

        // Now set the password for the user
        console.log('🔑 Setting password and metadata for user...');

        // Upload profile image if provided (for now, store local URI)
        // In production, you would upload to Supabase Storage
        const profile_image = profileImage || null;

        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
          data: {
            name,
            username,
            profile_image,
          },
        });

        if (updateError) {
          console.error('❌ Error setting password:', updateError);
          console.log('Error message:', updateError.message);

          // If error is "password should be different", it means password is already set
          // This can happen if user verifies OTP multiple times
          if (updateError.message && (
            updateError.message.toLowerCase().includes('should be different') ||
            updateError.message.toLowerCase().includes('same as the old password')
          )) {
            console.log('⚠️  Password already set, skipping password update...');
            // Password is already set, continue to create profile
          } else {
            // Unexpected error
            console.error('💥 Unexpected password error:', updateError.message);
            Alert.alert('Setup Error', 'Account created but failed to set password. Please contact support.');
            setLoading(false);
            return;
          }
        } else {
          console.log('✅ Password and metadata set successfully!');
        }

        // Create profile in database
        console.log('📝 Creating user profile in database...');
        const profileResult = await createUserProfile({
          userId: data.user.id,
          name,
          store_username: username,
          bio: '',
          profile_image: profile_image,
          currency: 'NPR',
        });

        if (!profileResult.success) {
          const error = profileResult.error as any;
          const errorMessage = error?.message || error?.toString() || '';

          // Check if it's a duplicate key error (profile already created by trigger)
          if (errorMessage.toLowerCase().includes('duplicate') ||
              errorMessage.toLowerCase().includes('already exists') ||
              errorMessage.toLowerCase().includes('unique constraint')) {
            console.log('✅ Profile already created by database trigger!');
            // Profile already exists from trigger, that's perfect - proceed
          }
          // Check if table doesn't exist
          else if ((profileResult as any).tableNotFound || error?.code === 'PGRST205') {
            console.error('❌ Failed to create profile:', profileResult.error);
            console.error('⚠️  Profiles table not found!');
            console.error('📝 ACTION REQUIRED: Run the SQL migration in Supabase Dashboard → SQL Editor');
            Alert.alert(
              'Setup Required',
              'Profile table not found. Please run the SQL migration in Supabase.\n\nYour account is created, but you may need to complete your profile later.',
              [{ text: 'OK' }]
            );
            // Still allow signup to complete
          }
          // Other unexpected errors
          else {
            console.error('❌ Unexpected error creating profile:', profileResult.error);
            Alert.alert(
              'Profile Error',
              'Account created successfully, but there was an issue creating your profile. You may need to update it later.',
              [{ text: 'OK' }]
            );
            // Still allow signup to complete
          }
        } else {
          console.log('✅ Profile created successfully in database!');
        }

        // All done! Proceed to next step
        setLoading(false);
        onNext();
      } else {
        console.warn('⚠️  No user in response');
        Alert.alert('Verification Failed', 'No user found. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('💥 Unexpected verification error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);

    try {
      console.log('📧 Resending OTP to:', email);

      // Send a new OTP using signInWithOtp (same as initial signup)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            name,
            username,
          },
        },
      });

      if (error) {
        console.error('❌ Resend error:', error);
        Alert.alert('Error', error.message || 'Failed to resend code. Please try again.');
        setResendLoading(false);
        return;
      }

      console.log('✅ New OTP sent successfully');
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');

      // Reset timer and clear inputs
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('💥 Unexpected resend error:', error);
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="mb-10">
        <ThemedText className="text-[15px] leading-6 font-[NunitoSans_400Regular] mb-2" style={{ color: '#6B7280' }}>
          We&apos;ve sent a 6-digit verification code to
        </ThemedText>
        <ThemedText className="text-[17px] font-semibold font-[NunitoSans_700Bold]" style={{ color: '#3B2F2F' }}>
          {email}
        </ThemedText>
      </View>

      {/* OTP Input */}
      <View className="mb-10">
        <ThemedText className="text-[13px] font-semibold mb-4 font-[NunitoSans_600SemiBold] tracking-wide uppercase" style={{ color: '#3B2F2F' }}>
          Enter Verification Code
        </ThemedText>

        <View className="flex-row justify-between mb-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              className="w-[52px] h-[58px] border-[2px] border-transparent bg-[#FAFAFA] rounded-2xl text-center text-[22px] font-[NunitoSans_700Bold] text-[#3B2F2F]"
              style={{
                borderColor: digit ? '#3B2F2F' : 'transparent',
                backgroundColor: digit ? '#FFFFFF' : '#FAFAFA',
              }}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        {/* Resend Code */}
        <View className="flex-row justify-center items-center mt-2">
          {canResend ? (
            <TouchableOpacity onPress={handleResendCode} disabled={resendLoading}>
              <ThemedText className="text-[14px] font-[NunitoSans_600SemiBold]" style={{ color: '#3B2F2F' }}>
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText className="text-[14px] font-[NunitoSans_400Regular]" style={{ color: '#9CA3AF' }}>
              Resend code in {timer}s
            </ThemedText>
          )}
        </View>
      </View>

      {/* Info */}
      <View className="mb-8 p-5 bg-[#FAFAFA] rounded-2xl border-[2px] border-[#E5E1DB]">
        <ThemedText className="text-[14px] font-[NunitoSans_400Regular] leading-6" style={{ color: '#6B7280' }}>
          Check your spam folder if you don&apos;t see the email. The code will expire in 60 minutes.
        </ThemedText>
      </View>

      {/* Buttons */}
      <View className="mt-auto">
        <FormButton
          title="Verify & Continue"
          onPress={handleVerifyOtp}
          loading={loading}
          variant="primary"
          className="mb-4"
        />

        <FormButton
          title="Back"
          onPress={onBack}
          variant="outline"
        />
      </View>
    </View>
  );
};
