import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useProfile } from '../hooks/useProfile';
import useSessionStore from '../store/useSessionStore';
import AvatarImage from '../components/AvatarImage';
import { downloadImage } from '../lib/fileStorage';

export default function RootLayout() {
  const router = useRouter();
  const { avatarUrl, getProfile } = useProfile();
  const { session } = useSessionStore();
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  useEffect(() => {
    if (avatarUrl) {
      downloadImage(avatarUrl, setImageData)
    }
  }, [avatarUrl])

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' }, // Dark header example
        headerTitle: ({ children }) => (
          <Text style={{ textTransform: 'capitalize', fontSize: 18, fontWeight: 'bold', color: 'white' }}>
            {children}
          </Text>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/account')} style={{ marginRight: 15 }}>
            <AvatarImage avatarUrl={imageData} size={24} round />
          </TouchableOpacity>
        ),
      }}
    >
      {/* Override screen options to remove Account avatar for the Account and Auth screens */}
      <Stack.Screen name="account" options={{ headerRight: () => null }} />
      <Stack.Screen name="auth" options={{ headerRight: () => null }} />
    </Stack>
  )
}
