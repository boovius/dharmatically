import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {Activity, ActivityInstance} from '../../types';
import EditMode from './EditMode';

interface ActivityInstancesProps {
  activity: Activity;
  activityInstances: ActivityInstance[];
  pressAction: (activityId: string) => void;
  saveActivity: (activityId: string, name: string, callback?: () => void) => void;
  deleteActivity: (activityId: string, callback?: () => void) => void;
}

const ActivityInstancesComponent: React.FC<ActivityInstancesProps> = ({
  activity,
  activityInstances,
  pressAction,
  saveActivity,
  deleteActivity,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [detailMode, setDetailMode] = useState(false);

  const MainRow = () => (
    <TouchableOpacity onPress={() => pressAction(activity.id)}>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {activity.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginRight: 30 }}>
            {activityInstances.length}
          </Text>
          <TouchableOpacity onPress={() => setEditMode((prev) => !prev)}>
            <MaterialIcons name="more-vert" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const DetailArrow = () => (
    <TouchableOpacity
      style={{ flexDirection: "row", justifyContent: "center" }}
      onPress={() => setDetailMode((prev) => !prev)}
    >
      <MaterialIcons
        name={detailMode ? "expand-less" : "expand-more"}
        size={24}
        color="black"
      />
    </TouchableOpacity>
  );

  const ActivityInstances = () => (
    <View>
      {activityInstances.map((instance) => (
        <View
          key={instance.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <Text>{new Date(instance.created_at).toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View>
      {editMode ? (
        <EditMode
          activityId={activity.id}
          activityName={activity.name}
          saveActivity={saveActivity}
          editActivityCallback={() => setEditMode(false)}
          deleteActivity={deleteActivity}
        />
      ) : (
        <View>
          <MainRow />
          <DetailArrow />
          {detailMode && <ActivityInstances />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ActivityInstancesComponent;