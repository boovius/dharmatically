import { useState } from 'react';
import { Alert } from 'react-native';
import useSessionStore from '../store/useSessionStore';

export function usePersistentStoreRequest() {
  const [loading, setLoading] = useState(false);
  const { session } = useSessionStore(); // Get logged-in user from Zustand

  // Higher Order Function (HOF) to wrap get requests
  const executeQuery = async <T>(queryCallback: () => Promise<{data: T | null, error: Error | null, status: number | null }>) => {
    try {
      setLoading(true);

      if (!session?.user) {
        throw new Error('No user is logged in! Please sign in.');
      }

      const { data, error, status } = await queryCallback(); // Execute the query or mutation function

      if (error) throw error;

      return { data, error: null, status };
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Higher Order Function (HOF) to wrap mutation (insert/update) requests
  const executeMutation = async <T>(mutationCallback: () => Promise<{error: Error | null, status: number | null }>) => {
    try {
      setLoading(true);

      if (!session?.user) {
        throw new Error('No user is logged in! Please sign in.');
      }

      const { error, status } = await mutationCallback(); // Execute the query or mutation function

      if (error) throw error;

      return { error: null, status };
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return { loading, executeQuery, executeMutation };
}
