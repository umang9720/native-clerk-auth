import React, { useCallback, useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { base_url } from "@/config/url";
import { saveAuthToken, getAuthToken } from "@/utils/authToken";
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession();

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function Page() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState<
    null | "oauth_google" | "oauth_apple"
  >(null);
  const [showContent, setShowContent] = useState(false); // <-- control rendering

  const handleLogin = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        setLoadingStrategy(strategy);

        const redirectUrl = AuthSession.makeRedirectUri({
          native: "bbbj://redirect",
        });

        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl,
        });

        if (createdSessionId && setActive) {
          await setActive({ session: createdSessionId });
        }
      } catch (err) {
        console.error("SSO error:", err);
        Toast.show({
          type: "error",
          text1: "SSO Error",
          text2: "Something went wrong during sign-in.",
        });
      } finally {
        setIsLoading(false);
        setLoadingStrategy(null);
      }
    },
    [startSSOFlow, isLoading]
  );

  useEffect(() => {
    const checkAuthAndSignIn = async () => {
      const existingToken = await getAuthToken("user");

      if (existingToken) {
        // Token exists → redirect immediately
        Toast.show({
          type: "success",
          text1: "Welcome Back! Master",
          visibilityTime: 1000, // ⏱ Show for 1 second
        });
        router.replace("/(tabs)");
        return;
      }

      // No token, but Clerk session might exist → proceed
      if (!isSignedIn || !userId || !user) {
        setShowContent(true); // Show login UI
        return;
      }

      try {
        const response = await fetch(`${base_url}/signin/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl,
            providerInfo: {
              providerName: user.externalAccounts?.[0]?.provider,
              providerId: userId,
            },
          }),
        });

        const data = await response.json();
        const token = data?.data?.token;

        if (response.status === 201 && token) {
          await saveAuthToken(token);

          Toast.show({
            type: "success",
            text1: "Login Successful",
            visibilityTime: 1300, // ⏱ Show for 1 second
          });

          router.replace("/signup/signUp");
        } else {
          Toast.show({
            type: "error",
            text1: "Login Failed",
            text2: data?.message || "Could not authenticate user.",
          });
        }
      } catch (error) {
        console.error("Sign-in request failed:", error);
        Toast.show({
          type: "error",
          text1: "Server Error",
          text2: "Could not connect to server.",
        });
      } finally {
        setShowContent(true); // Show login UI if user not redirected
      }
    };

    checkAuthAndSignIn();
  }, [isSignedIn, userId, user]);

  if (!showContent) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3BA365" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.scrollContainer}>
      <View style={styles.loginContainer}>
        <View style={[styles.container, { paddingHorizontal: width * 0.08 }]}>
          <View style={styles.textWrapper}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.title}>GoodBreach</Text>
            <Text style={styles.subText}>Small Sacrifices, Big Rewards</Text>
          </View>

          <Image
            source={require("@/assets/images/logn_image.png")}
            style={[
              styles.loginImage,
              { width: width * 0.8, height: width * 0.8 },
            ]}
            resizeMode="contain"
          />

          {/* Google Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  loadingStrategy === "oauth_google" ? "#A1E6B4" : "#004110",
                width: width * 0.85,
              },
            ]}
            onPress={() => handleLogin("oauth_google")}
            disabled={isLoading}
          >
            <Image
              source={require("@/assets/images/logo_google.png")}
              style={styles.logo}
            />
            <Text style={styles.buttonText}>
              {loadingStrategy === "oauth_google"
                ? "Signing in..."
                : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          {/* Apple Button */}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    loadingStrategy === "oauth_apple" ? "#A1E6B4" : "#004110",
                  width: width * 0.85,
                },
              ]}
              onPress={() => handleLogin("oauth_apple")}
              disabled={isLoading}
            >
              <Image
                source={require("@/assets/images/logo_apple.png")}
                style={styles.logo}
              />
              <Text style={styles.buttonText}>
                {loadingStrategy === "oauth_apple"
                  ? "Signing in..."
                  : "Continue with Apple"}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.endText}>
            By continuing, you agree to our Privacy and Terms.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loginContainer: {
    flex: 1,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  textWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#363B4B",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3BA365",
  },
  subText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#767676",
  },
  loginImage: {
    marginBottom: 30,
  },
  button: {
    marginTop: 15,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  endText: {
    marginTop: 20,
    color: "#121417",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});
