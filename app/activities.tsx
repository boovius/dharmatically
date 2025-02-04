import { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Button, Input, Tab } from '@rneui/themed'
import { useActivities } from '../hooks/useActivities'
import { useActivityInstances } from '../hooks/useActivityInstances'
import { usePersistentStoreRequest } from '../hooks/usePersistentStoreRequest'
import ActivityListItem from '../components/ActivityListItem'
import { oneWeekAgo, oneMonthAgo } from '../utils/dates'

export default function Activities() {
  const [newActivity, setNewActivity] = useState('')
  const { loading } = usePersistentStoreRequest()
  const {
    activities,
    addActivity,
    saveActivity,
    deleteActivity,
  } = useActivities()
  const { activityInstances, addActivityInstance, getActivityInstances } = useActivityInstances()
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (tabIndex === 0) {
      getActivityInstances(oneWeekAgo())
    } else {
      getActivityInstances(new Date()) // this is purposefully off right now to show a difference in behavior
    }
  }, [tabIndex])

  return (
    <View style={styles.container}>
      <Tab value={tabIndex} onChange={setTabIndex} dense>
        <Tab.Item title="Week" />
        <Tab.Item title="Month" />
      </Tab>
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
      <View style={[styles.verticallySpaced, styles.newActivityContainer]}>
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
    padding: 12,
    position: 'relative',
    height: '100%',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  newActivityContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    padding: 12,
  },
})