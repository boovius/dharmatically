import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';  // Adjust path if needed
import { Button, Input, Text, Overlay } from '@rneui/themed';

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>('');
  const [errorCode, setErrorCode] = useState<string | null>('');
  const [errorDescription, setErrorDescription] = useState<string | null>('');

  useEffect(() => {
    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink(url);
    };

    const handleDeepLink = (url: string) => {
      setLoading(false);

      // Extract fragment (#error=...)
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const fragment = url.substring(hashIndex + 1); // Remove the `#`
        console.log("Extracted Fragment:", fragment); // Debugging

        // Manually parse the fragment string
        const params: { [key: string]: string } = {};
        fragment.split('&').forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key && value) {
            params[key] = decodeURIComponent(value.replace(/\+/g, ' ')); // Handle URL encoding
          }
        });

        // Update state with extracted values
        setError(params.error || null);
        setErrorCode(params.error_code || null);
        setErrorDescription(params.error_description || null);

        if (params.error) {
          Alert.alert('Error', params.error_description || 'An unknown error occurred.');
          router.replace('/auth');
        }
      }
    };

    // Listen for new deep links
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    getInitialURL(); // Check if the app was opened from a deep link initially

    return () => {
      subscription.remove();
    };
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully!');
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <Overlay isVisible>
        <Text>Loading...</Text>
      </Overlay>
    );
  }

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Reset Password</Text>
      <Input
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Input
        placeholder="Confirm new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
});
