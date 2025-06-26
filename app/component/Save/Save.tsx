import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SavingItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  amount: string;
}

interface Goal {
  id: string;
  title: string;
  isActive: boolean;
}

const SmartSavingsApp: React.FC = () => {
  const [, setActiveGoal] = useState<string>('vacation');

  const savingItems: SavingItem[] = [
    {
      id: '1',
      icon: '☕',
      title: 'Skip Coffee',
      subtitle: 'Made coffee at home instead',
      amount: '£4.50',
    },
    {
      id: '2',
      icon: '🍽️',
      title: 'Bring Lunch',
      subtitle: 'Packed lunch from home',
      amount: '£9.50',
    },
    {
      id: '3',
      icon: '🚶',
      title: 'Walk Instead',
      subtitle: 'Walked instead of taking transport',
      amount: '£8.75',
    },
  ];

  const goals: Goal[] = [
    { id: 'vacation', title: 'Vacation', isActive: true },
    { id: 'newcar', title: 'New Car', isActive: false },
    { id: 'emergency', title: 'Emergency Fund', isActive: false },
  ];

  const streakDays = [
    { day: 'M', active: true },
    { day: 'T', active: true },
    { day: 'W', active: true },
    { day: 'T', active: true },
    { day: 'F', active: false },
    { day: 'S', active: true },
    { day: 'S', active: true },
  ];

  const renderStreakDay = (day: any, index: number) => (
    <View
      key={index}
      style={[
        styles.streakDay,
        { backgroundColor: day.active ? '#4CAF50' : '#E0E0E0' },
      ]}
    >
      <Text style={[styles.streakDayText, { color: day.active ? 'white' : '#999' }]}>
        {day.day}
      </Text>
    </View>
  );

  const renderSavingItem = (item: SavingItem) => (
    <View key={item.id} style={styles.savingItem}>
      <View style={styles.savingItemLeft}>
        <Text style={styles.savingItemIcon}>{item.icon}</Text>
        <View style={styles.savingItemText}>
          <Text style={styles.savingItemTitle}>{item.title}</Text>
          <Text style={styles.savingItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.savingItemRight}>
        <Text style={styles.savingItemAmount}>{item.amount}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGoal = (goal: Goal) => (
    <TouchableOpacity
      key={goal.id}
      style={[
        styles.goalItem,
        { backgroundColor: goal.isActive ? '#FF7043' : 'transparent' },
      ]}
      onPress={() => setActiveGoal(goal.id)}
    >
      <Text style={[styles.goalText, { color: goal.isActive ? 'white' : '#666' }]}>
        {goal.title}
      </Text>
      {goal.isActive && <Text style={styles.goalIndicator}>🎯</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A237E" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Savings</Text>
        <TouchableOpacity>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Savings Card */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <View>
              <Text style={styles.savingsLabel}>Today&apos;s Saving</Text>
              <Text style={styles.savingsAmount}>£13.00</Text>
            </View>
            <View style={styles.weeklyContainer}>
              <Text style={styles.weeklyLabel}>This Week</Text>
              <Text style={styles.weeklyAmount}>£40.00</Text>
            </View>
          </View>
          
          {/* Streak */}
          <View style={styles.streakContainer}>
            <View style={styles.streakDays}>
              {streakDays.map(renderStreakDay)}
            </View>
            <View style={styles.streakInfo}>
              <Text style={styles.streakText}>3 Days</Text>
              <Text style={styles.streakLabel}>Saving Streak</Text>
            </View>
          </View>

          {/* No Takeout Messages */}
          <View style={styles.messagesContainer}>
            <View style={styles.messageItem}>
              <Text style={styles.messageIcon}>✅</Text>
              <View>
                <Text style={styles.messageTitle}>No takeout Week</Text>
                <Text style={styles.messageSubtitle}>Great delivery for a week and came close</Text>
              </View>
              <Text style={styles.messageAmount}>£40</Text>
            </View>
            
            <View style={styles.messageItem}>
              <Text style={styles.messageIcon}>💪</Text>
              <View>
                <Text style={styles.messageTitle}>No takeout Week</Text>
                <Text style={styles.messageSubtitle}>Track daily habits & hit your goals</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Saving Items */}
        <View style={styles.savingItemsContainer}>
          {savingItems.map(renderSavingItem)}
        </View>

        {/* Custom Save Button */}
        <TouchableOpacity style={styles.customSaveButton}>
          <Text style={styles.customSaveText}>+ Custom Save</Text>
        </TouchableOpacity>

        {/* Apply to Goal Section */}
        <View style={styles.goalsSection}>
          <Text style={styles.goalsSectionTitle}>Apply to Goal</Text>
          <View style={styles.goalsList}>
            {goals.map(renderGoal)}
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1A237E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  headerTitle: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
  menuIcon: {
    color: 'white',
    fontSize: width * 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  savingsCard: {
    backgroundColor: '#1E88E5',
    borderRadius: 16,
    padding: width * 0.05,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  savingsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: width * 0.035,
    marginBottom: 4,
  },
  savingsAmount: {
    color: 'white',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  weeklyContainer: {
    alignItems: 'flex-end',
  },
  weeklyLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: width * 0.035,
    marginBottom: 4,
  },
  weeklyAmount: {
    color: 'white',
    fontSize: width * 0.05,
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  streakDays: {
    flexDirection: 'row',
    gap: 6,
  },
  streakDay: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDayText: {
    fontSize: width * 0.03,
    fontWeight: '600',
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  streakLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: width * 0.03,
  },
  messagesContainer: {
    gap: height * 0.015,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageIcon: {
    fontSize: width * 0.04,
  },
  messageTitle: {
    color: 'white',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  messageSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: width * 0.03,
  },
  messageAmount: {
    color: 'white',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  savingItemsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: width * 0.04,
    marginBottom: height * 0.02,
  },
  savingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  savingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savingItemIcon: {
    fontSize: width * 0.06,
    marginRight: width * 0.04,
  },
  savingItemText: {
    flex: 1,
  },
  savingItemTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
  },
  savingItemSubtitle: {
    fontSize: width * 0.032,
    color: '#666',
    marginTop: 2,
  },
  savingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  savingItemAmount: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#333',
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  customSaveButton: {
    backgroundColor: '#333',
    paddingVertical: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  customSaveText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  goalsSection: {
    marginBottom: height * 0.1,
  },
  goalsSectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.02,
  },
  goalsList: {
    gap: height * 0.015,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  goalText: {
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  goalIndicator: {
    fontSize: width * 0.04,
  },
  
});

export default SmartSavingsApp;