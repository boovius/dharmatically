import { Stack, useRouter } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';
import { Text } from '@rneui/themed';

export default function RootLayout() {
  const router = useRouter();

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
            <Image
              source={{ uri: 'https://i.pravatar.cc/300' }} // Placeholder Avatar
              style={{ width: 35, height: 35, borderRadius: 20 }}
            />
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
