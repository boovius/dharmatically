import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { supabase } from '../lib/supabase';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'dharmatically://reset-password',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password reset email requested. Please check your email inbox.');
      setEmail('');
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Forgot Password</Text>
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;