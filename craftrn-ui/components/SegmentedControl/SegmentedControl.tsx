import React from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from '../Text';

export type SegmentedControlProps = {
  values: string[];
  labels: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export function SegmentedControl({
  values,
  labels,
  selectedValue,
  onValueChange,
}: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <Pressable
          key={value}
          style={[
            styles.segment,
            selectedValue === value && styles.segmentSelected,
          ]}
          onPress={() => onValueChange(value)}
        >
          <Text
            variant="body2"
            style={[
              styles.segmentText,
              selectedValue === value && styles.segmentTextSelected,
            ]}
          >
            {labels[index]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.borderRadius.medium,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.borderNeutralSecondary,
  },
  segmentSelected: {
    backgroundColor: theme.colors.interactivePrimary,
  },
  segmentText: {
    color: theme.colors.contentSecondary,
  },
  segmentTextSelected: {
    color: theme.colors.interactivePrimaryContent,
  },
}));
