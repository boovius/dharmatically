import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import useSessionStore from '../store/useSessionStore';
import { router } from 'expo-router'
import { usePersistentStoreRequest } from './usePersistentStoreRequest'

interface Activity {
  id: string;
  name: string;
  owner: string;
}

export function useActivities() {
  // const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<{ id: string, name: string, owner: string }[]>([])
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({})
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

  async function addActivity(newActivity: string, callback: () => void) {
    await executeMutation(async () => {
      const { error, status } = await supabase
        .from('activities')
        .insert([{ name: newActivity, owner: session?.user.id }])
      if (error) {
        throw error
      }
      getActivities()
      callback()
      return { error, status }
    })
  }

  async function saveActivity(index: number) {
    await executeMutation(async () => {
      const { error, status } = await supabase
        .from('activities')
        .update({ name: activities[index].name })
        .eq('id', activities[index].id)
      if (error) {
        throw error
      }

      setEditMode((prev) => ({ ...prev, [index]: false }))
      getActivities()

      return { error, status }
    })
  }

  async function deleteActivity(index: number) {
    await executeMutation(async () => {
      const { error, status } = await supabase
        .from('activities')
        .delete()
        .eq('id', activities[index].id)
      if (error) {
        throw error
      }

      setActivities((prev) => prev.filter((_, i) => i !== index))
      setEditMode((prev) => ({ ...prev, [index]: false }))
      return { error, status }
    })
  }

  return {
    loading,
    activities,
    setActivities,
    editMode,
    setEditMode,
    addActivity,
    saveActivity,
    deleteActivity,
  }
}
