import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import useSessionStore from '../store/useSessionStore';

export default function App() {
  const router = useRouter();
  const { setSession, session } = useSessionStore();
  const [loading, setLoading] = useState(true); // Prevents flickering redirects

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false); // Done loading once session is set
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    if (!loading) {
      if (session && session.user) {
        router.replace('/activities');
      } else {
        router.replace('/auth');
      }
    }
  }, [session, loading]);

  // Show loading screen while checking session
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <View />;
}
