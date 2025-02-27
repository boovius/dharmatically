import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';  // Adjust path if needed
import { Button, Input, Text, Overlay } from '@rneui/themed';
import useSessionStore from '../store/useSessionStore';

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  // const { setSession } = useSessionStore();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) handleDeepLink(url);
    };

    const handleDeepLink = (url: string) => {
      setLoading(false);
      console.log("Deep Link Received:", url);

      debugger;
      // Extract error from URL fragment (#error=...)
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const fragment = url.substring(hashIndex + 1); // Get everything after #
        const params = new URLSearchParams(fragment);
        const errorMessage = params.get('error_description'); // Extract the 'error' parameter
        if (errorMessage) {
          setError(errorMessage);
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
  //   const fetchSession = async () => {
  //     if (error) {
  //       Alert.alert('Error', error);
  //       router.replace('/forgot-password');
  //       return;
  //     }

  //     const { data } = await supabase.auth.getSession();

  //     if (!data) {
  //       Alert.alert('Error', 'Unable to retrieve authenticated user session.');
  //       router.replace('/auth');
  //       setLoading(false); // Done loading once session is set
  //       return;
  //     }

  //     setSession(data.session);
  //     setLoading(false); // Done loading once session is set
  //   };

  //   fetchSession();
  // }, []);
  // useEffect(() => {
  //   const handleAuth = async () => {
  //     if (access_token) {
  //       const { error } = await supabase.auth.setSession({
  //         access_token,
  //         refresh_token: '', // Not needed here
  //       });

  //       if (error) {
  //         Alert.alert('Error', 'Invalid or expired token.');
  //         router.replace('/forgot-password');
  //       } else {
  //         setLoading(false);
  //       }
  //     } else {
  //       Alert.alert('Error', 'No token found.');
  //       router.replace('/forgot-password');
  //     }
  //   };

  //   handleAuth();
  // }, [access_token]);

  const handleChangePassword = async () => {
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
