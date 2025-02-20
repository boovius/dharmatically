import { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Modal, TouchableWithoutFeedback } from 'react-native'
import { Button, Input, Tab } from '@rneui/themed'
import { useActivities } from '../hooks/useActivities'
import { useActivityInstances } from '../hooks/useActivityInstances'
import { usePersistentStoreRequest } from '../hooks/usePersistentStoreRequest'
import ActivityListItem from '../components/ActivityListItem'
import KeyboardAwareComponent from '../components/KeyboardAvoidingComponent'
import { oneWeekAgo, oneMonthAgo } from '../utils/dates'

export default function Activities() {
  const [newActivity, setNewActivity] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
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
      getActivityInstances(oneMonthAgo())
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
          style={{ flex: 1, marginBottom: 100 }}
          renderItem={({ item, index }) => (
            <View style={styles.verticallySpaced}>
              <ActivityListItem
                activity={item}
                activityInstances={activityInstances.filter(
                  (instance) => instance.activity_id === item.id
                )}
                pressAction={addActivityInstance}
                saveActivity={saveActivity}
                deleteActivity={deleteActivity}
              />
            </View>
          )}
        />
        <View style={[styles.verticallySpaced, styles.newActivityContainer, { flex: 0.2 }]}>
          <Button
            title="Add Activity"
            onPress={() => {
              setModalVisible(true);
            }}
            disabled={loading}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <KeyboardAwareComponent>
                <View style={styles.modalContent}>
                  <Input
                    label="New Activity"
                    value={newActivity}
                    onChangeText={setNewActivity}
                    placeholder="Enter new activity"
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <Button
                      title="Cancel"
                      color="secondary"
                      onPress={() => setModalVisible(false)}
                    />
                    <Button
                      title="Add Activity"
                      onPress={() => {
                        addActivity(newActivity, () => {
                          setNewActivity("");
                          setModalVisible(false);
                        });
                      }}
                      disabled={loading || !newActivity}
                      color="primary"
                    />
                  </View>
                </View>
              </KeyboardAwareComponent>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    position: 'relative',
    height: '100%',
    flex: 1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  newActivityContainer: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    left: 0,
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
})