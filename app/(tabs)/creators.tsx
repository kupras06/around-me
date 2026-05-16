import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import AuthGate from '@/components/AuthGate/AuthGate';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { InputSearch } from '@/craftrn-ui/components/InputSearch';
import { ListItem } from '@/craftrn-ui/components/ListItem';
import { Text } from '@/craftrn-ui/components/Text';
import type { Tables } from '@/lib/database.types';

// TODO: Replace with real data fetching from Supabase
type Creator = Tables<'creators'> & {
  avatar_url?: string | null;
  followed: boolean;
};

const CREATORS: Creator[] = [];

function ActualCreators() {
  const [search, setSearch] = useState('');
  const [creators, setCreators] = useState<Creator[]>(CREATORS);

  const filteredCreators = creators.filter(
    (c) =>
      (c.handle ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (c.bio ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const toggleFollow = (id: number) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, followed: !c.followed } : c))
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text variant="heading3" style={styles.title}>
        Creators
      </Text>
      <View style={styles.search}>
        <InputSearch
          placeholder="Search creators..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={filteredCreators}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem
            itemLeft={
              <Avatar
                source={item.avatar_url ? { uri: item.avatar_url } : undefined}
                size="small"
              />
            }
            text={item.handle ?? 'Creator'}
            textBelow={item.bio ?? item.platform ?? undefined}
            itemRight={
              <Button
                variant={item.followed ? 'neutral' : 'primary'}
                size="small"
                onPress={() => toggleFollow(item.id)}
              >
                {item.followed ? 'Following' : 'Follow'}
              </Button>
            }
            divider
            style={styles.listItem}
          />
        )}
      />
    </View>
  );
}

export default function CreatorsScreen() {
  return (
    <AuthGate>
      <ActualCreators />
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    paddingTop: runtime.insets.top + theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: runtime.insets.bottom + theme.spacing.large,
    backgroundColor: theme.colors.backgroundScreen,
  },
  title: {
    marginBottom: theme.spacing.medium,
  },
  search: {
    marginBottom: theme.spacing.large,
  },
  listItem: {
    paddingVertical: theme.spacing.medium,
  },
}));
