import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../lib/supabase';  // Adjust path if needed
import { Button, Input, Text, Overlay } from '@rneui/themed';

export default function ResetPassword() {
  const router = useRouter();
  const { access_token } = useLocalSearchParams<{access_token: string}>();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      if (access_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token: '', // Not needed here
        });

        if (error) {
          Alert.alert('Error', 'Invalid or expired token.');
          router.replace('/forgot-password');
        } else {
          setLoading(false);
        }
      } else {
        Alert.alert('Error', 'No token found.');
        router.replace('/forgot-password');
      }
    };

    handleAuth();
  }, [access_token]);

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
