import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive dimensions
const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

const hp = (percentage: number) => {
  return (height * percentage) / 100;
};

const GoodBreachApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const HabitCircle = ({ status }: { status: 'success' | 'fail' }) => (
    <View
      style={[
        styles.habitCircle,
        { backgroundColor: status === 'success' ? '#10B981' : '#EF4444' }
      ]}
    >
      <Text style={styles.habitText}>
        {status === 'success' ? '✓' : '✗'}
      </Text>
    </View>
  );

  const ProgressBar = ({ progress, color = '#FB923C' }: { progress: number; color?: string }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  );

  const Dashboard = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.headerTitle}>GoodBreach</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.notificationIcon}>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>
          <View style={styles.orangeDot} />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Saving Card */}
        <View style={styles.savingCard}>
          <Text style={styles.savingLabel}>Today&apos;s Saving</Text>
          <Text style={styles.savingAmount}>£13.00</Text>
          <Text style={styles.savingQuote}>
            &quot;Your habits are creating financial freedom.&quot;
          </Text>
          
          <View style={styles.habitStreak}>
            <View style={styles.habitCircles}>
              <HabitCircle status="success" />
              <HabitCircle status="success" />
              <HabitCircle status="success" />
              <HabitCircle status="success" />
              <HabitCircle status="fail" />
              <HabitCircle status="success" />
              <HabitCircle status="success" />
            </View>
            <View style={styles.streakDays}>
              <Text style={styles.streakNumber}>3</Text>
              <Text style={styles.streakLabel}>Days</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💰</Text>
            <Text style={styles.statAmount}>£47</Text>
            <Text style={styles.statLabel}>This week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statAmount}>£200</Text>
            <Text style={styles.statLabel}>Monthly goal</Text>
          </View>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalsContainer}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalEmoji}>✈️</Text>
                <Text style={styles.goalTitle}>Spain Trip</Text>
              </View>
              <Text style={styles.goalTarget}>Target: £47</Text>
              <View style={styles.goalStats}>
                <Text style={styles.goalStat}>Saved: £300</Text>
                <Text style={styles.goalStat}>Target: £400</Text>
              </View>
            </View>
            
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalEmoji}>🏥</Text>
                <Text style={styles.goalTitle}>Medical Emergency</Text>
              </View>
              <Text style={styles.goalTarget}>Target: £4</Text>
            </View>
          </View>
        </View>

        {/* Active Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity onPress={() => setCurrentView('challenges')}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.challengesContainer}>
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeEmoji}>🌱</Text>
                <Text style={styles.challengeTitle}>No takeout Week</Text>
              </View>
              <Text style={styles.challengeDescription}>
                Ditch delivery for a week and save more.
              </Text>
              <View style={styles.challengeProgress}>
                <Text style={styles.progressText}>3/5</Text>
                <Text style={styles.saveText}>Save: £40</Text>
              </View>
              <ProgressBar progress={60} />
            </View>
            
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeEmoji}>🌸</Text>
                <Text style={styles.challengeTitle}>No takeout Week</Text>
              </View>
              <Text style={styles.challengeDescription}>
                Track daily habits & hit your goal.
              </Text>
              <View style={styles.challengeProgress}>
                <Text style={styles.progressText}>2/5</Text>
                <Text style={styles.saveText}>Save: £30</Text>
              </View>
              <ProgressBar progress={40} />
            </View>
          </View>
        </View>

        {/* Your Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          
          <View style={styles.impactStats}>
            <View style={styles.impactCard}>
              <Text style={styles.impactAmount}>£1,508</Text>
              <Text style={styles.impactLabel}>Potential yearly savings</Text>
            </View>
            <View style={styles.impactCard}>
              <Text style={styles.impactAmount}>68%</Text>
              <Text style={styles.impactLabel}>Success rate</Text>
            </View>
          </View>
          
          <View style={styles.impactList}>
            <View style={styles.impactItem}>
              <View style={[styles.impactIcon, { backgroundColor: '#DCFCE7' }]}>
                <Text>🥤</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactTitle}>Avoided 18 sugary drinks</Text>
                <Text style={styles.impactSubtitle}>
                  Reduced sugar intake by approximately 450g
                </Text>
              </View>
            </View>
            
            <View style={styles.impactItem}>
              <View style={[styles.impactIcon, { backgroundColor: '#DBEAFE' }]}>
                <Text>👟</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactTitle}>Added 5,000+ steps weekly</Text>
                <Text style={styles.impactSubtitle}>
                  by walking instead of using rideshares
                </Text>
              </View>
            </View>
            
            <View style={styles.impactItem}>
              <View style={[styles.impactIcon, { backgroundColor: '#FED7AA' }]}>
                <Text>☕</Text>
              </View>
              <View style={styles.impactContent}>
                <Text style={styles.impactTitle}>Reduced caffeine by 20%</Text>
                <Text style={styles.impactSubtitle}>
                  by skipping afternoon coffee
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const ChallengesView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => setCurrentView('dashboard')}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Challenge</Text>
        </View>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Challenge Cards */}
        <View style={styles.fullChallengeCard}>
          <View style={styles.challengeContent}>
            <View style={[styles.challengeIconLarge, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.challengeEmojiLarge}>🌱</Text>
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitleLarge}>No takeout Week</Text>
              <Text style={styles.challengeDescriptionLarge}>
                Ditch delivery for a week and save more.
              </Text>
              <View style={styles.challengeProgressLarge}>
                <Text style={styles.progressTextLarge}>3/5</Text>
                <Text style={styles.saveTextLarge}>Save: £40</Text>
              </View>
              <ProgressBar progress={60} />
            </View>
          </View>
        </View>

        <View style={styles.fullChallengeCard}>
          <View style={styles.challengeContent}>
            <View style={[styles.challengeIconLarge, { backgroundColor: '#FCE7F3' }]}>
              <Text style={styles.challengeEmojiLarge}>🌸</Text>
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitleLarge}>No takeout Week</Text>
              <Text style={styles.challengeDescriptionLarge}>
                Track daily habits & hit your goal.
              </Text>
              <View style={styles.challengeProgressLarge}>
                <Text style={styles.progressTextLarge}>2/5</Text>
                <Text style={styles.saveTextLarge}>Save: £30</Text>
              </View>
              <ProgressBar progress={40} />
            </View>
          </View>
        </View>

        <View style={styles.fullChallengeCard}>
          <View style={styles.challengeContent}>
            <View style={[styles.challengeIconLarge, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.challengeEmojiLarge}>💧</Text>
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitleLarge}>Hydration Challenge</Text>
              <Text style={styles.challengeDescriptionLarge}>
                Drink 8 glasses of water daily for a week.
              </Text>
              <View style={styles.challengeProgressLarge}>
                <Text style={styles.progressTextLarge}>5/7</Text>
                <Text style={styles.saveTextLarge}>Save: £25</Text>
              </View>
              <ProgressBar progress={71} color="#3B82F6" />
            </View>
          </View>
        </View>

        <View style={styles.fullChallengeCard}>
          <View style={styles.challengeContent}>
            <View style={[styles.challengeIconLarge, { backgroundColor: '#F3E8FF' }]}>
              <Text style={styles.challengeEmojiLarge}>📱</Text>
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitleLarge}>Digital Detox</Text>
              <Text style={styles.challengeDescriptionLarge}>
                Limit social media to 1 hour per day.
              </Text>
              <View style={styles.challengeProgressLarge}>
                <Text style={styles.progressTextLarge}>1/7</Text>
                <Text style={styles.saveTextLarge}>Save: £15</Text>
              </View>
              <ProgressBar progress={14} color="#8B5CF6" />
            </View>
          </View>
        </View>

        <View style={styles.fullChallengeCard}>
          <View style={styles.challengeContent}>
            <View style={[styles.challengeIconLarge, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.challengeEmojiLarge}>🚶</Text>
            </View>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitleLarge}>Walking Challenge</Text>
              <Text style={styles.challengeDescriptionLarge}>
                Walk 10,000 steps daily instead of using transport.
              </Text>
              <View style={styles.challengeProgressLarge}>
                <Text style={styles.progressTextLarge}>4/7</Text>
                <Text style={styles.saveTextLarge}>Save: £35</Text>
              </View>
              <ProgressBar progress={57} color="#EAB308" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return currentView === 'dashboard' ? <Dashboard /> : <ChallengesView />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp(6),
    height: wp(6),
    backgroundColor: '#2563EB',
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: wp(3),
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: wp(2),
  },
  bellIcon: {
    fontSize: wp(4),
  },
  orangeDot: {
    width: wp(2),
    height: wp(2),
    backgroundColor: '#FB923C',
    borderRadius: wp(1),
    marginRight: wp(2),
  },
  avatar: {
    width: wp(8),
    height: wp(8),
    backgroundColor: '#D1D5DB',
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: wp(3.5),
  },
  backButton: {
    marginRight: wp(3),
    padding: wp(1),
  },
  backIcon: {
    fontSize: wp(5),
    color: '#6B7280',
  },
  closeButton: {
    padding: wp(1),
  },
  closeIcon: {
    fontSize: wp(6),
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  savingCard: {
    backgroundColor: '#2563EB',
    borderRadius: wp(4),
    padding: wp(6),
    marginBottom: hp(2),
  },
  savingLabel: {
    color: '#FFFFFF',
    fontSize: wp(3.5),
    opacity: 0.9,
    marginBottom: hp(0.5),
  },
  savingAmount: {
    color: '#FFFFFF',
    fontSize: wp(8),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  savingQuote: {
    color: '#FFFFFF',
    fontSize: wp(3.5),
    opacity: 0.9,
    marginBottom: hp(3),
  },
  habitStreak: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitCircles: {
    flexDirection: 'row',
  },
  habitCircle: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(1),
  },
  habitText: {
    color: '#FFFFFF',
    fontSize: wp(2),
    fontWeight: 'bold',
  },
  streakDays: {
    alignItems: 'center',
  },
  streakNumber: {
    color: '#FFFFFF',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  streakLabel: {
    color: '#FFFFFF',
    fontSize: wp(3),
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: wp(4),
    width: wp(42),
    alignItems: 'flex-start',
  },
  statEmoji: {
    fontSize: wp(4),
    marginBottom: hp(0.5),
  },
  statAmount: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: hp(0.5),
  },
  statLabel: {
    fontSize: wp(3),
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllButton: {
    fontSize: wp(3.5),
    color: '#2563EB',
    fontWeight: '500',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp(2),
    padding: wp(3),
    width: wp(40),
    marginBottom: hp(1),
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  goalEmoji: {
    fontSize: wp(4),
    marginRight: wp(2),
  },
  goalTitle: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#1F2937',
  },
  goalTarget: {
    fontSize: wp(3),
    color: '#6B7280',
    marginBottom: hp(1),
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalStat: {
    fontSize: wp(2.5),
    color: '#6B7280',
  },
  challengesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  challengeCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: wp(2),
    padding: wp(3),
    width: wp(40),
    marginBottom: hp(1),
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  challengeEmoji: {
    fontSize: wp(4),
    marginRight: wp(2),
  },
  challengeTitle: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  challengeDescription: {
    fontSize: wp(3),
    color: '#6B7280',
    marginBottom: hp(1),
  },
  challengeProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  progressText: {
    fontSize: wp(3),
    color: '#6B7280',
  },
  saveText: {
    fontSize: wp(3),
    color: '#6B7280',
  },
  progressBarContainer: {
    width: '100%',
    height: hp(0.7),
    backgroundColor: '#E5E7EB',
    borderRadius: wp(1),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: wp(1),
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  impactCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: wp(2),
    padding: wp(3),
    width: wp(40),
    alignItems: 'flex-start',
  },
  impactAmount: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#EA580C',
    marginBottom: hp(0.5),
  },
  impactLabel: {
    fontSize: wp(3),
    color: '#6B7280',
  },
  impactList: {
    gap: hp(1.5),
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  impactContent: {
    flex: 1,
  },
  impactTitle: {
    fontSize: wp(3.5),
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: hp(0.3),
  },
  impactSubtitle: {
    fontSize: wp(3),
    color: '#6B7280',
  },
  fullChallengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  challengeIconLarge: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  challengeEmojiLarge: {
    fontSize: wp(5),
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitleLarge: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: hp(0.5),
  },
  challengeDescriptionLarge: {
    fontSize: wp(3.5),
    color: '#6B7280',
    marginBottom: hp(1.5),
  },
  challengeProgressLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  progressTextLarge: {
    fontSize: wp(3.5),
    color: '#6B7280',
  },
  saveTextLarge: {
    fontSize: wp(3.5),
    color: '#6B7280',
  },
});

export default GoodBreachApp;