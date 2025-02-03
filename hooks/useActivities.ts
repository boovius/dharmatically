import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import useSessionStore from '../store/useSessionStore';
import { router } from 'expo-router'
import { usePersistentStoreRequest } from './usePersistentStoreRequest'

interface Activity {
  id: string;
  name: string;
  owner: string;
}

export function useActivities() {
  const [activities, setActivities] = useState<{ id: string, name: string, owner: string }[]>([])
  const { session } = useSessionStore()
  const { loading, executeQuery, executeMutation} = usePersistentStoreRequest()

  useEffect(() => {
    if (session) {
      getActivities()
    } else {
      router.replace('/auth')
    }
  }, [session])

  async function getActivities() {
    const { data } = await executeQuery(async () => {
      const { data, error, status } = await supabase
        .from('activities')
        .select(`id, name, owner`)
      if (error) throw error;
      return { data, error, status }
    })

    if (data) {
      setActivities(data)
    }
  }

  async function addActivity(newActivity: string, callback?: () => void) {
    await executeMutation(async () => {
      const { data, error, status } = await supabase
        .from('activities')
        .insert([{ name: newActivity, owner: session?.user.id }])
        .select()
      if (error) {
        throw error
      }
      if (status === 201) {
        setActivities((prev) => [...prev, data[0]])
        callback && callback()
      }
      return { error, status }
    })
  }

  async function saveActivity(activityId: string, name: string, callback?: (activity: Activity) => void) {
    await executeMutation(async () => {
      const { data, error, status } = await supabase
        .from('activities')
        .update({ name: name })
        .eq('id', activityId)
        .select()
      if (error) {
        throw error
      }

      if (status === 200) {
        setActivities((prev) => prev.map((activity) => {
          if (activity.id === activityId) {
            return data[0]
          }
          return activity
        }))
        if (callback) {
          console.log('we are calling back here')
          callback(data[0])
        }
      }

      return { error, status }
    })
  }

  async function deleteActivity(activityId: string, callback?: () => void) {
    await executeMutation(async () => {
      const { error, status } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
      if (error) {
        throw error
      }

      if (status === 204) {
        setActivities((prev) => prev.filter((activity) => activity.id !== activityId))
        if (callback) callback()
      }

      return { error, status }
    })
  }

  return {
    loading,
    activities,
    setActivities,
    addActivity,
    saveActivity,
    deleteActivity,
  }
}
