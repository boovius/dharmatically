import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, FlatList } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<{ id: string, name: string, owner: string }[]>([])
  const [newActivity, setNewActivity] = useState('')
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    if (session) getActivities()
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

  async function addActivity() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { error } = await supabase
        .from('activities')
        .insert([{ name: newActivity, owner: session?.user.id }])
      if (error) {
        throw error
      }

      setNewActivity('')
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

  return (
    <View style={styles.container}>
      <Text h1>Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.verticallySpaced}>
            {editMode[index] ? (
              <View>
                <Input
                  value={item.name}
                  onChangeText={(text) => {
                    const updatedActivities = [...activities]
                    updatedActivities[index].name = text
                    setActivities(updatedActivities)
                  }}
                />
                <View style={styles.buttonRow}>
                  <Button title="Save" onPress={() => saveActivity(index)} />
                  <View style={styles.buttonSpacer} />
                  <Button title="Delete" onPress={() => deleteActivity(index)} />
                </View>
              </View>
            ) : (
              <Input
                value={item.name}
                disabled
                rightIcon={{
                  type: 'material',
                  name: 'more-vert',
                  onPress: () => setEditMode((prev) => ({ ...prev, [index]: true })),
                }}
              />
            )}
          </View>
        )}
      />
      <View style={styles.verticallySpaced}>
        <Input
          label="New Activity"
          value={newActivity}
          onChangeText={setNewActivity}
          placeholder="Enter new activity"
        />
        <Button title="Add Activity" onPress={addActivity} disabled={loading || !newActivity} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 16,
  },
  mt20: {
    marginTop: 20,
  },
})