import { InputSearch } from '@/craftrn-ui/components/InputSearch/InputSearch';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardStickyView, useKeyboardAnimation } from 'react-native-keyboard-controller';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
export default function SearchScreen() {
  const { height, progress } = useKeyboardAnimation();

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2],
  });
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Search' }} />
      <View style={styles.content}>
        <KeyboardStickyView>
          <TextInput placeholder="Type a message..." />
        </KeyboardStickyView>
        <InputSearch onPress={() => {}} editable={false} placeholder="Search places or creators" />
        <Text variant="body2" style={{ marginTop: 16 }}>
          Search is a demo placeholder. Implement search flow when ready.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingTop: UnistylesRuntime.insets.top + theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
  },
  content: {
    padding: theme.spacing.large,
  },
}));