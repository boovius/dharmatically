import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { usePersistentStoreRequest } from './usePersistentStoreRequest';
import useSessionStore from '../store/useSessionStore';

export function useProfile() {
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const { session } = useSessionStore();
  const { loading, executeQuery, executeMutation } = usePersistentStoreRequest();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    await executeQuery(async () => {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
      return { data, error, status };
    });
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    const updates = {
      id: session?.user.id,
      username,
      website,
      avatar_url,
      updated_at: new Date(),
    };

    await executeMutation(async () => {
      const { error, status } = await supabase.from('profiles').upsert(updates);
      if (error) {
        throw error;
      }
      return { error, status };
    });
  }

  return {
    username,
    setUsername,
    website,
    setWebsite,
    avatarUrl,
    setAvatarUrl,
    loading,
    getProfile,
    updateProfile,
  };
}
