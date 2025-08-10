import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { onboardingData } from '@/utils/onBoardingData';
import { setOnboardingCompleted } from '@/utils/asyncStorage';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreenProps {
  onOnboardingComplete: () => void;
}

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onOnboardingComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    await setOnboardingCompleted();
    onOnboardingComplete();
  };

  const currentData = onboardingData[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Image taking full width from top */}
      <View style={styles.imageSection}>
        <Image source={currentData.image} style={styles.image} resizeMode="contain" />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Text Container with fixed width */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentData.title}</Text>
          <Text style={styles.subtitle}>{currentData.subtitle}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          {currentIndex === onboardingData.length - 1 ? (
            // Last screen - Show Get Started button
            <TouchableOpacity onPress={handleComplete} style={styles.getStartedButton}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            // Other screens - Show Skip and Next buttons
            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
                 <Ionicons name="arrow-forward" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageSection: {
    height: height * 0.55, // Takes about 55% of screen height
    width: width,
  },
  image: {
    width: width,
    height: '100%',
  },
  contentSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.04,
  },
  textContainer: {
    alignItems: 'center',
    width: 280, // Slightly narrower to force proper text wrapping
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26, // Slightly smaller for better wrapping
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15, // Slightly smaller for 3-line wrapping
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: 6,
    borderRadius: 8,
  },
  activeDot: {
    width: 24,
    height: 8,
    backgroundColor: '#6366f1',
  },
  inactiveDot: {
    width: 8,
    height: 8,
    backgroundColor: '#e5e7eb',
  },
  buttonSection: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextArrow: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  getStartedButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 28,
    alignSelf: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default OnboardingScreen;