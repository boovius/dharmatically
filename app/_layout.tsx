import { Stack, Slot } from 'expo-router';
import { Text } from '@rneui/themed';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View>
      <Text>Header</Text>
      <Slot /> // Ensures child screens are rendered properly
    </View>
  )
}
