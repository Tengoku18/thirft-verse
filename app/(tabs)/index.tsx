import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.mainTitle}>ThriftVerse</ThemedText>
        <ThemedText style={styles.subtitle}>Vintage Finds, Modern Style</ThemedText>
      </ThemedView>

      {/* Color Palette Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Color Palette</ThemedText>

        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: '#3B2F2F' }]}>
            <Text style={styles.colorLabel}>Primary</Text>
            <Text style={styles.colorCode}>#3B2F2F</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: '#D4A373' }]}>
            <Text style={styles.colorLabel}>Secondary</Text>
            <Text style={styles.colorCode}>#D4A373</Text>
          </View>
        </View>

        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: '#6B705C' }]}>
            <Text style={styles.colorLabel}>Accent 1</Text>
            <Text style={styles.colorCode}>#6B705C</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: '#CB997E' }]}>
            <Text style={styles.colorLabel}>Accent 2</Text>
            <Text style={styles.colorCode}>#CB997E</Text>
          </View>
        </View>

        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: '#FAF7F2' }]}>
            <Text style={[styles.colorLabel, { color: '#3B2F2F' }]}>Background</Text>
            <Text style={[styles.colorCode, { color: '#3B2F2F' }]}>#FAF7F2</Text>
          </View>
          <View style={[styles.colorBox, { backgroundColor: '#C7BFB3' }]}>
            <Text style={styles.colorLabel}>Border</Text>
            <Text style={styles.colorCode}>#C7BFB3</Text>
          </View>
        </View>
      </ThemedView>

      {/* Font Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Typography</ThemedText>

        <View style={styles.fontDemo}>
          <Text style={styles.playfairTitle}>Playfair Display</Text>
          <Text style={styles.playfairSubtext}>Elegant serif for headings</Text>
        </View>

        <View style={styles.fontDemo}>
          <Text style={styles.nunitoTitle}>Nunito Sans</Text>
          <Text style={styles.nunitoSubtext}>Clean sans-serif for body text</Text>
        </View>
      </ThemedView>

      {/* Card Example */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Example Card</ThemedText>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vintage Denim Jacket</Text>
          <Text style={styles.cardPrice}>$45.00</Text>
          <Text style={styles.cardDescription}>
            Classic 90s style denim jacket in excellent condition.
            Perfect for layering in any season.
          </Text>
          <View style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Add to Cart</Text>
          </View>
        </View>
      </ThemedView>

      {/* Font Weights Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Font Weights</ThemedText>

        <Text style={styles.playfairRegular}>Playfair Regular</Text>
        <Text style={styles.playfairSemiBold}>Playfair SemiBold</Text>
        <Text style={styles.playfairBold}>Playfair Bold</Text>

        <View style={styles.spacer} />

        <Text style={styles.nunitoRegular}>Nunito Sans Regular</Text>
        <Text style={styles.nunitoSemiBold}>Nunito Sans SemiBold</Text>
        <Text style={styles.nunitoBold}>Nunito Sans Bold</Text>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#3B2F2F',
    alignItems: 'center',
  },
  mainTitle: {
    color: '#FAF7F2',
    marginBottom: 8,
  },
  subtitle: {
    color: '#D4A373',
    fontSize: 16,
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colorBox: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  colorCode: {
    color: '#FFFFFF',
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 11,
  },
  fontDemo: {
    marginBottom: 20,
  },
  playfairTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 32,
    color: '#3B2F2F',
    marginBottom: 4,
  },
  playfairSubtext: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 14,
    color: '#6B705C',
  },
  nunitoTitle: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 28,
    color: '#3B2F2F',
    marginBottom: 4,
  },
  nunitoSubtext: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 14,
    color: '#6B705C',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C7BFB3',
  },
  cardTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 24,
    color: '#3B2F2F',
    marginBottom: 8,
  },
  cardPrice: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 20,
    color: '#D4A373',
    marginBottom: 12,
  },
  cardDescription: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 15,
    color: '#3B2F2F',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardButton: {
    backgroundColor: '#D4A373',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cardButtonText: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  spacer: {
    height: 16,
  },
  playfairRegular: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: '#3B2F2F',
    marginBottom: 8,
  },
  playfairSemiBold: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#3B2F2F',
    marginBottom: 8,
  },
  playfairBold: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 20,
    color: '#3B2F2F',
    marginBottom: 8,
  },
  nunitoRegular: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 18,
    color: '#3B2F2F',
    marginBottom: 8,
  },
  nunitoSemiBold: {
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: 18,
    color: '#3B2F2F',
    marginBottom: 8,
  },
  nunitoBold: {
    fontFamily: 'NunitoSans_700Bold',
    fontSize: 18,
    color: '#3B2F2F',
    marginBottom: 8,
  },
});
