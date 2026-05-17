import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/craftrn-ui/components/Text';
import { getPasswordRequirements } from '@/lib/password-validation';

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <View style={styles.container}>
      {getPasswordRequirements(password).map((requirement) => (
        <Text
          key={requirement.id}
          variant="body3"
          color={requirement.met ? 'sentimentPositive' : 'contentSecondary'}
        >
          {requirement.met ? '✓' : '○'} {requirement.label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xsmall,
  },
}));
