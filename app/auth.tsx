import React, { useState } from 'react'
import { Alert, StyleSheet, View, AppState } from 'react-native'
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from '../lib/supabase'
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Button, Input, Text } from '@rneui/themed'
import PasswordInput from '../components/PasswordInput';
import { useRouter } from 'expo-router'
import useSessionStore from '../store/useSessionStore';


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()
  const { setSession } = useSessionStore();

  async function signInWithEmail() {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message);
    } else if (data.session) {
      setSession(data.session)
      router.replace("activities");
    } else {
      Alert.alert("Error", "Error retrieving user session.");
    }

    setLoading(false)
  }

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    // if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
    // remove the following and remove the comment above to alert users to email confirmation when
    // email confirmation is put back in place for sign up
    router.replace("activities");
  }

  const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;

    if (!access_token) return;

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    router.replace("activities");
    return data.session;
  };

  type OAuthProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'gitlab' | 'bitbucket';
  const performOAuth = async (provider: OAuthProvider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });
    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(
      data?.url ?? "",
      redirectTo
    );

    if (res.type === "success") {
      const { url } = res;
      await createSessionFromUrl(url);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{height: 200, width: 200, alignSelf: "center", justifyContent: "center", alignItems: "center", backgroundColor: "gray"}}>
        <Text>Logo Placeholder</Text>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <PasswordInput value={password} onChangeText={(text) => setPassword(text)} />
      </View>
      {isSignUp && (
        <View style={styles.verticallySpaced}>
          <PasswordInput value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)} />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
      )}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={isSignUp ? "Sign up" : "Sign in"}
          disabled={loading}
          onPress={isSignUp ? signUpWithEmail : signInWithEmail}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title={isSignUp ? "Switch to Sign in" : "Switch to Sign up"}
          type="clear"
          onPress={() => setIsSignUp(!isSignUp)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Forgot Password"
          type="clear"
          onPress={() => router.push("forgot-password")}
        />
      </View>
      {/* <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Google" disabled={loading} onPress={() => performOAuth('google')} />
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    paddingTop: 100,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
})