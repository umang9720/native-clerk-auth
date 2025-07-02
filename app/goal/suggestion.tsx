import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface GoalSuggestion {
  id: string;
  title: string;
  duration: string;
  amount: string;
  description: string;
  icon: string;
  color: string;
}

const GoalSuggestionsPage: React.FC = () => {
  const router =useRouter();
  const [goalSuggestions] = useState<GoalSuggestion[]>([
    {
      id: '1',
      title: 'Charity',
      duration: '30 Days',
      amount: '£30.00',
      description: 'Purchase one time subscriptions of all OTTs instead of buying every OTTs description and save More.',
      icon: '💜',
      color: '#8B5CF6',
    },
    {
      id: '2',
      title: 'Sony Camera',
      duration: '25 Days',
      amount: '£25.00',
      description: 'Purchase one time subscriptions of all OTTs instead of buying every OTTs description and save More.',
      icon: '📷',
      color: '#EC4899',
    },
    {
      id: '3',
      title: 'Mother\'s Day',
      duration: '10 Days',
      amount: '£10.00',
      description: 'Purchase one time subscriptions of all OTTs instead of buying every OTTs description and save More.',
      icon: '💐',
      color: '#F59E0B',
    },
  ]);

  const CrossIcon = () => (
    <View style={styles.crossIcon}>
      <View style={styles.crossLine1} />
      <View style={styles.crossLine2} />
    </View>
  );

  const handleAddGoal = (goalId: string) => {
    console.log(`Adding goal with ID: ${goalId}`);
    // Add your goal adding logic here
  };

  const renderGoalCard = (goal: GoalSuggestion) => (
    <View key={goal.id} style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={[styles.iconContainer, { backgroundColor: goal.color }]}>
          <Text style={styles.goalIcon}>{goal.icon}</Text>
        </View>
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalDuration}>Duration: {goal.duration}</Text>
        </View>
        <Text style={styles.goalAmount}>{goal.amount}</Text>
      </View>
      
      <Text style={styles.goalDescription}>{goal.description}</Text>
      
      <TouchableOpacity
        style={styles.addGoalButton}
        onPress={() => handleAddGoal(goal.id)}
        activeOpacity={0.8}
      >
        <Text style={styles.addGoalButtonText}>Add Goal</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton}  onPress={() => router.back()}
          >
            <CrossIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Goal Suggestions</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {goalSuggestions.map(renderGoalCard)}
          
          {/* Empty space at bottom */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 5,
  },
  crossIcon: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  crossLine1: {
    position: 'absolute',
    width: 14,
    height: 1.5,
    backgroundColor: '#666',
    top: 9,
    left: 3,
    transform: [{ rotate: '45deg' }],
  },
  crossLine2: {
    position: 'absolute',
    width: 14,
    height: 1.5,
    backgroundColor: '#666',
    top: 9,
    left: 3,
    transform: [{ rotate: '-45deg' }],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  goalDuration: {
    fontSize: 14,
    color: '#666',
  },
  goalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  addGoalButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default GoalSuggestionsPage;