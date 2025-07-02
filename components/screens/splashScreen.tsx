import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image
} from 'react-native';

interface SplashScreenProps {
  onSplashComplete: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ onSplashComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSplashComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onSplashComplete]);

  return (
    <View style={styles.container}>
      <Image
  source={require('@/assets/images/splash_icon.png')}
  style={{ width: 200, height: 200 }}
/>


      <StatusBar barStyle="light-content" backgroundColor="#F0C0BE" />
      <Text style={styles.title}>Good Breach</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004110',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.03,
    color: '#5E5E5E',
    fontWeight: '300',
  },
});

export default SplashScreen;