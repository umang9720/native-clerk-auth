import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllChallenges() {
  const router = useRouter();

  const challenges = [
    {
      title: '🥗 No takeout Week',
      desc: 'Ditch delivery for a week and save more.',
      progress: '3/5',
      save: '£40',
    },
    {
      title: '📉 No takeout Week',
      desc: 'Track daily habits & hit your goal.',
      progress: '2/5',
      save: '£20',
    },
  ];

  return (
  <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>All Challenge</Text>
      </View>

      {challenges.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text>{item.desc}</Text>
          <Text style={styles.progress}>{item.progress} • Save: {item.save}</Text>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeContainer:{
        flex:1,
    },
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '600' },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  progress: { marginTop: 6, color: '#FB923C' },
});

export const options = {
  title: 'All Challenges',
};