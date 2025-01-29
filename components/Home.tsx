import { useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Button, Input, Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { useActivities } from '../hooks/useActivities'

export default function Account({ session }: { session: Session }) {
  const [newActivity, setNewActivity] = useState('')
  const {
    loading,
    activities,
    setActivities,
    editMode,
    setEditMode,
    addActivity,
    saveActivity,
    deleteActivity,
  } = useActivities(session)

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
        <Button title="Add Activity" onPress={() => addActivity(newActivity)} disabled={loading || !newActivity} />
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