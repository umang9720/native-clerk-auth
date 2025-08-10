import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

type Props = {
  step: number;
  totalSteps: number;
};

const ProgressBar = ({ step, totalSteps }: Props) => (
  <View style={styles.container}>
    <Text style={styles.label}>{`${step}/${totalSteps}`}</Text>
    <Progress.Bar
      progress={step / totalSteps}
      width={null}
      color="#4CAF50"
      height={10}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginBottom: 10 },
  label: { alignSelf: 'flex-end', marginBottom: 5, fontWeight: '500' },
});

export default ProgressBar;
