import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";

interface SplashScreenProps {
  onSplashComplete: () => void;
}

const { width, height } = Dimensions.get("window");

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
        source={require("@/assets/images/splash_icon.png")}
        style={{ width: 80, height: 80, marginBottom: 15 }}
      />
      <StatusBar barStyle="light-content" backgroundColor="#F0C0BE" />
      <Text style={styles.title}>Good Breach</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "semibold",
    color: "#000",
    marginBottom: height * 0.01,
  },
});

export default SplashScreen;
