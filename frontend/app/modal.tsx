import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// This modal route is unused; redirect to tabs
export default function Modal() {
  const router = useRouter();
  useEffect(() => { router.replace('/(tabs)'); }, [router]);
  return null;
}
