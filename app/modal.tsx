import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { HeadingBoldText, BodyBoldText } from '@/components/Typography';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <HeadingBoldText style={{ fontSize: 32 }}>This is a modal</HeadingBoldText>
      <Link href="/" dismissTo style={styles.link}>
        <BodyBoldText style={{ color: '#0a7ea4' }}>Go to home screen</BodyBoldText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
