import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector } from '@/store/hooks';
import { BodyMediumText, HeadingBoldText } from '@/components/Typography';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type AppStatus =
  | 'initializing'      // Checking auth state
  | 'checking_profile'  // User authenticated, checking profile
  | 'profile_incomplete' // Profile exists but incomplete
  | 'ready'             // All checks passed
  | 'unauthenticated';  // No user session

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const profile = useAppSelector((state) => state.profile.profile);
  const profileLoading = useAppSelector((state) => state.profile.loading);
  const [appStatus, setAppStatus] = useState<AppStatus>('initializing');
  const [statusMessage, setStatusMessage] = useState('Starting up...');

  useEffect(() => {
    const determineStatus = async () => {
      // Step 1: Check auth state
      if (authLoading) {
        setAppStatus('initializing');
        setStatusMessage('Checking authentication...');
        return;
      }

      // Step 2: No user - redirect to signin
      if (!user) {
        setAppStatus('unauthenticated');
        setStatusMessage('Please sign in');
        return;
      }

      // Step 3: User exists, check profile
      if (profileLoading) {
        setAppStatus('checking_profile');
        setStatusMessage('Loading your profile...');
        return;
      }

      // Step 4: Check if profile is complete
      if (!profile) {
        setAppStatus('profile_incomplete');
        setStatusMessage('Setting up your store...');
        return;
      }

      // Step 5: Check required profile fields
      const isProfileComplete = profile.name && profile.store_username;
      if (!isProfileComplete) {
        setAppStatus('profile_incomplete');
        setStatusMessage('Complete your profile to continue');
        return;
      }

      // All checks passed
      setAppStatus('ready');
      setStatusMessage('Welcome back!');
    };

    determineStatus();
  }, [authLoading, user, profileLoading, profile]);

  // Handle redirects based on status
  if (appStatus === 'unauthenticated') {
    return <Redirect href="/(auth)/signin" />;
  }

  if (appStatus === 'ready') {
    return <Redirect href="/(tabs)" />;
  }

  // Show status screen for all intermediate states
  return (
    <View className="flex-1 bg-[#FAF7F2] justify-center items-center px-8">
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        className="items-center"
      >
        {/* Logo */}
        <View className="w-24 h-24 rounded-full bg-[#3B2F2F] justify-center items-center mb-8">
          <HeadingBoldText style={{ color: '#FFFFFF', fontSize: 32 }}>
            TV
          </HeadingBoldText>
        </View>

        {/* App Name */}
        <HeadingBoldText style={{ fontSize: 28, color: '#3B2F2F', marginBottom: 8 }}>
          ThriftVerse
        </HeadingBoldText>

        {/* Status Message */}
        <BodyMediumText style={{ color: '#6B7280', marginBottom: 24, textAlign: 'center' }}>
          {statusMessage}
        </BodyMediumText>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#3B2F2F" />

        {/* Status Indicators */}
        <View className="mt-8 w-full max-w-xs">
          <StatusStep
            label="Authentication"
            status={
              appStatus === 'initializing' ? 'loading' :
              user ? 'complete' : 'pending'
            }
          />
          <StatusStep
            label="Profile"
            status={
              appStatus === 'initializing' ? 'pending' :
              appStatus === 'checking_profile' ? 'loading' :
              profile ? 'complete' : 'pending'
            }
          />
          <StatusStep
            label="Store Setup"
            status={
              appStatus === 'profile_incomplete' ? 'loading' : 'pending'
            }
          />
        </View>
      </Animated.View>
    </View>
  );
}

function StatusStep({ label, status }: { label: string; status: 'pending' | 'loading' | 'complete' }) {
  return (
    <View className="flex-row items-center py-2">
      <View
        className="w-6 h-6 rounded-full mr-3 justify-center items-center"
        style={{
          backgroundColor:
            status === 'complete' ? '#059669' :
            status === 'loading' ? '#3B82F6' : '#E5E7EB'
        }}
      >
        {status === 'complete' && (
          <BodyMediumText style={{ color: '#FFFFFF', fontSize: 12 }}>✓</BodyMediumText>
        )}
        {status === 'loading' && (
          <ActivityIndicator size="small" color="#FFFFFF" />
        )}
      </View>
      <BodyMediumText
        style={{
          color: status === 'pending' ? '#9CA3AF' : '#1F2937',
          flex: 1
        }}
      >
        {label}
      </BodyMediumText>
    </View>
  );
}
