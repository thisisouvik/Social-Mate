import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';

export default function Index() {
  const { user, isLoading, isOnboarded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isOnboarded) {
      router.replace('/(onboarding)');
    } else if (!user) {
      router.replace('/(auth)');
    } else {
      router.replace('/(tabs)');
    }
  }, [isLoading, user, isOnboarded]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.gradientStart }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
