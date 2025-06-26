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
  Modal,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  daysLeft: number;
  saved: number;
  target: number;
  status: 'on-track' | 'overdue' | 'completed';
  icon: string;
  color: string;
}

interface GoalSuggestion {
  id: string;
  title: string;
  duration: string;
  amount: string;
  icon: string;
  description: string;
}

const SmartGoalsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pause' | 'completed'>('active');
  const [showGoalSuggestions, setShowGoalSuggestions] = useState(false);

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Spain Trip',
      daysLeft: 47,
      saved: 200,
      target: 400,
      status: 'on-track',
      icon: '✈️',
      color: '#2196F3',
    },
    {
      id: '2',
      title: 'Medical Emergency',
      daysLeft: 32,
      saved: 300,
      target: 600,
      status: 'overdue',
      icon: '🏥',
      color: '#4CAF50',
    },
  ];

  const goalSuggestions: GoalSuggestion[] = [
    {
      id: '1',
      title: 'Charity',
      duration: '30 Days',
      amount: '£30.00',
      icon: '💜',
      description: 'Purchase one time subscription of all OTT is instead of buying every OTT subscription and save More',
    },
    {
      id: '2',
      title: 'Sony Camera',
      duration: '25 Days',
      amount: '£25.00',
      icon: '📷',
      description: 'Purchase one time subscription of all OTT is instead of buying every OTT subscription and save More',
    },
    {
      id: '3',
      title: 'Mother\'s Day',
      duration: '10 Days',
      amount: '£10.00',
      icon: '💐',
      description: 'Purchase one time subscription of all OTT is instead of buying every OTT subscription and save More',
    },
  ];

  const getProgressPercentage = (saved: number, target: number): number => {
    return Math.min((saved / target) * 100, 100);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'on-track':
        return '#4CAF50';
      case 'overdue':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'on-track':
        return 'On Track';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Active';
    }
  };

  const renderGoalCard = (goal: Goal) => (
    <View key={goal.id} style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleContainer}>
          <Text style={styles.goalIcon}>{goal.icon}</Text>
          <Text style={styles.goalTitle}>{goal.title}</Text>
        </View>
        <Text style={styles.goalStatus}>🌟</Text>
      </View>
      
      <Text style={styles.daysLeft}>Days Left: {goal.daysLeft}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${getProgressPercentage(goal.saved, goal.target)}%`,
                backgroundColor: goal.color 
              }
            ]} 
          />
        </View>
        <Text style={[styles.statusText, { color: getStatusColor(goal.status) }]}>
          • {getStatusText(goal.status)}
        </Text>
      </View>
      
      <View style={styles.goalFooter}>
        <Text style={styles.savedText}>Saved: £{goal.saved}</Text>
        <Text style={styles.targetText}>Target: £{goal.target}</Text>
      </View>
    </View>
  );

  const renderGoalSuggestion = (suggestion: GoalSuggestion) => (
    <View key={suggestion.id} style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <View style={styles.suggestionIcon}>
          <Text style={styles.suggestionIconText}>{suggestion.icon}</Text>
        </View>
        <View style={styles.suggestionContent}>
          <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
          <Text style={styles.suggestionDuration}>Duration: {suggestion.duration}</Text>
          <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
        </View>
        <View style={styles.suggestionRight}>
          <Text style={styles.suggestionAmount}>{suggestion.amount}</Text>
          <TouchableOpacity style={styles.addGoalButton}>
            <Text style={styles.addGoalButtonText}>Add Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Goals</Text>
        <TouchableOpacity>
          <Text style={styles.locationIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Total Saved Card */}
      <View style={styles.totalSavedCard}>
        <View style={styles.totalSavedLeft}>
          <Text style={styles.totalAmount}>£300</Text>
          <Text style={styles.totalLabel}>Total saved</Text>
          <Text style={styles.overallProgress}>Overall progress</Text>
          <Text style={styles.progressAmount}>£300 of £2248</Text>
        </View>
        <View style={styles.totalSavedRight}>
          <View style={styles.circularProgress}>
            <Text style={styles.circularProgressText}>🎯</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Goals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pause' && styles.activeTab]}
          onPress={() => setActiveTab('pause')}
        >
          <Text style={[styles.tabText, activeTab === 'pause' && styles.activeTabText]}>
            Pause
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed Goal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
        {goals.map(renderGoalCard)}
      </ScrollView>

      {/* Add Goal Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowGoalSuggestions(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Goal Suggestions Modal */}
      <Modal
        visible={showGoalSuggestions}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGoalSuggestions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowGoalSuggestions(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Goal Suggestions</Text>
            </View>

            {/* Modal Content */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {goalSuggestions.map(renderGoalSuggestion)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
  },
  locationIcon: {
    fontSize: width * 0.05,
  },
  totalSavedCard: {
    backgroundColor: '#8D6E63',
    marginHorizontal: width * 0.05,
    borderRadius: 16,
    padding: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  totalSavedLeft: {
    flex: 1,
  },
  totalAmount: {
    color: 'white',
    fontSize: width * 0.12,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  totalLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
  },
  overallProgress: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: width * 0.032,
    marginBottom: 4,
  },
  progressAmount: {
    color: 'white',
    fontSize: width * 0.035,
    fontWeight: '500',
  },
  totalSavedRight: {
    alignItems: 'center',
  },
  circularProgress: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularProgressText: {
    fontSize: width * 0.06,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.02,
  },
  tab: {
    flex: 1,
    paddingVertical: height * 0.015,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: width * 0.035,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  goalsList: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    fontSize: width * 0.05,
    marginRight: width * 0.02,
  },
  goalTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  goalStatus: {
    fontSize: width * 0.04,
  },
  daysLeft: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.015,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: width * 0.03,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    fontSize: width * 0.03,
    fontWeight: '600',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savedText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  targetText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#2196F3',
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    marginRight: width * 0.03,
  },
  closeButtonText: {
    fontSize: width * 0.06,
    color: '#666',
  },
  modalTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  suggestionCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.015,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionIcon: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  suggestionIconText: {
    fontSize: width * 0.06,
  },
  suggestionContent: {
    flex: 1,
    marginRight: width * 0.03,
  },
  suggestionTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestionDuration: {
    fontSize: width * 0.032,
    color: '#666',
    marginBottom: height * 0.01,
  },
  suggestionDescription: {
    fontSize: width * 0.03,
    color: '#888',
    lineHeight: width * 0.04,
  },
  suggestionRight: {
    alignItems: 'flex-end',
  },
  suggestionAmount: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: height * 0.01,
  },
  addGoalButton: {
    backgroundColor: '#FF7043',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.008,
    borderRadius: 16,
  },
  addGoalButtonText: {
    color: 'white',
    fontSize: width * 0.03,
    fontWeight: '600',
  },
});

export default SmartGoalsApp;