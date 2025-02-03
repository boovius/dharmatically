import { useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { useActivities } from '../hooks/useActivities'
import { useActivityInstances } from '../hooks/useActivityInstances'
import { usePersistentStoreRequest } from '../hooks/usePersistentStoreRequest'
import ActivityListItem from '../components/ActivityListItem'

export default function Activities() {
  const [newActivity, setNewActivity] = useState('')
  const { loading } = usePersistentStoreRequest()
  const {
    activities,
    addActivity,
    saveActivity,
    deleteActivity,
  } = useActivities()
  const { activityInstances, addActivityInstance } = useActivityInstances()

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.verticallySpaced}>
            <ActivityListItem
              activity={item}
              activityInstances={activityInstances.filter((instance) => instance.activity_id === item.id)}
              pressAction={addActivityInstance}
              saveActivity={saveActivity}
              deleteActivity={deleteActivity}
            />
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
        <Button title="Add Activity" onPress={() => addActivity(newActivity, () => setNewActivity(''))} disabled={loading || !newActivity} />
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
})