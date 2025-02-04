import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import useSessionStore from '../store/useSessionStore';
import { router } from 'expo-router'
import { usePersistentStoreRequest } from './usePersistentStoreRequest'
import { ActivityInstance } from '../types'


export function useActivityInstances() {
  const [activityInstances, setActivityInstances] = useState<ActivityInstance[]>([])
  const { session } = useSessionStore()
  const { executeQuery, executeMutation} = usePersistentStoreRequest()

  useEffect(() => {
    if (session) {
      getActivityInstances()
    } else {
      router.replace('/auth')
    }
  }, [session])

  async function getActivityInstances(from: Date = new Date('1970-01-01T00:00:00Z')) {
    const { data } = await executeQuery(async () => {
      const { data, error, status } = await supabase
        .from('activity_instances')
        .select(`id, activity_id, created_at`)
        .gte('created_at', from.toISOString())
      if (error) throw error;
      return { data, error, status }
    })

    if (data) {
      setActivityInstances(data)
    }
  }

  async function addActivityInstance(activityId: string, callback: (() => void) | undefined = undefined) {
    await executeMutation(async () => {
      const { data, error, status } = await supabase
        .from('activity_instances')
        .insert([{ activity_id: activityId}])
        .select()
      if (error) {
        throw error
      }
      if (status === 201) {
        setActivityInstances((prev) => [...prev, data[0]])
      }
      if (callback) callback();
      return { data, error, status }
    })
  }

  async function updateActivityInstance(index: number) {
    await executeMutation(async () => {
      const { error, status } = await supabase
        .from('activity_instances')
        .update({ activity_id: activityInstances[index].activity_id })
        .eq('id', activityInstances[index].id)
      if (error) {
        throw error
      }

      getActivityInstances()

      return { error, status }
    })
  }

  async function deleteActivityInstance(index: number) {
    await executeMutation(async () => {
      const { error, status } = await supabase
        .from('activity_instances')
        .delete()
        .eq('id', activityInstances[index].id)
      if (error) {
        throw error
      }

      setActivityInstances((prev) => prev.filter((_, i) => i !== index))
      return { error, status }
    })
  }

  return {
    activityInstances,
    getActivityInstances,
    addActivityInstance,
    updateActivityInstance,
    deleteActivityInstance,
  }
}
