import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from 'react-native'
import useSessionStore from '../store/useSessionStore';
import { router } from 'expo-router'

export function useActivities() {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<{ id: string, name: string, owner: string }[]>([])
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({})
  const { session } = useSessionStore()

  useEffect(() => {
    if (session) {
      getActivities()
    } else {
      console.log('no session in auth')
      router.replace('/auth')
    }
  }, [session])

  async function getActivities() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('activities')
        .select(`id, name, owner`)
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setActivities(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function addActivity(newActivity: string) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase
        .from('activities')
        .insert([{ name: newActivity, owner: session?.user.id }])
      if (error) {
        throw error
      }

      getActivities()
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function saveActivity(index: number) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase
        .from('activities')
        .update({ name: activities[index].name })
        .eq('id', activities[index].id)
      if (error) {
        throw error
      }

      setEditMode((prev) => ({ ...prev, [index]: false }))
      getActivities()
    } catch (error) {
      if (error instanceof Error) {
        setEditMode((prev) => ({ ...prev, [index]: false }))
        Alert.alert(error.message)
      }
    } finally {
      setEditMode((prev) => ({ ...prev, [index]: false }))
      setLoading(false)
    }
  }

  async function deleteActivity(index: number) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activities[index].id)
      if (error) {
        throw error
      }

      setActivities((prev) => prev.filter((_, i) => i !== index))
      setEditMode((prev) => ({ ...prev, [index]: false }))
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
      setEditMode((prev) => ({ ...prev, [index]: false }))
    } finally {
      setLoading(false)
      setEditMode((prev) => ({ ...prev, [index]: false }))
    }
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
