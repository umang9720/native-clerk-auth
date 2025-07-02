import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from '@/components/screens/splashScreen';
import OnboardingScreen from '@/components/screens/onBoardingScreen';
import LoginScreen from '@/components/screens/sign-in';
// import MainApp from '@/app/component/BottomTabNavigator';
import { getOnboardingStatus } from '@/utils/asyncStorage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ← Track login state

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await getOnboardingStatus();
      setOnboardingCompleted(completed);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsLoading(false);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true);
  };



  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (showSplash) {
    return <SplashScreen onSplashComplete={handleSplashComplete} />;
  }

  if (!onboardingCompleted) {
    return <OnboardingScreen onOnboardingComplete={handleOnboardingComplete} />;
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // return <MainApp />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;