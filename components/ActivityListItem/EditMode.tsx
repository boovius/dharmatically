import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from '@rneui/themed';

interface EditModeProps {
  activityId: string;
  activityName: string;
  saveActivity: (activityId: string, name: string, callback?: () => void) => void;
  editActivityCallback?: () => void;
  deleteActivity: (activityId: string, callback?: () => void) => void;
}

const EditMode: React.FC<EditModeProps> = ({
  activityId,
  activityName: initialName,
  saveActivity,
  editActivityCallback,
  deleteActivity,
}) => {
  const [activityName, setActivityName] = useState(initialName);

  return (
    <View>
      <Input
        value={activityName}
        onChangeText={(text) => setActivityName(text)}
      />
      <View style={styles.buttonRow}>
        <Button
          title="Save"
          onPress={() => saveActivity(activityId, activityName, editActivityCallback)}
        />
        <View style={styles.buttonSpacer} />
        <Button title="Delete" onPress={() => deleteActivity(activityId, editActivityCallback)} />
      </View>
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
});

export default EditMode;
