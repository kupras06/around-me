import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type LoaderProps = ViewProps & {
  loading: boolean;
};

export function LoaderView({ loading, children, ...props }: LoaderProps) {
  if (loading) {
    return (
      <View {...props} style={[styles.loadingContainer, props.style]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <View {...props}>{children}</View>;
}

const styles = StyleSheet.create((theme) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundScreen,
  },
}));
