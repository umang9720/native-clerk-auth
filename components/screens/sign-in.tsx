import React, { useCallback, useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { base_url} from "@/config/url";
import { saveAuthToken } from "@/utils/authToken";

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
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { width } = useWindowDimensions();

  const handleLogin = useCallback(
    async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
      try {
        const redirectUrl = AuthSession.makeRedirectUri({
          native: "your.app.scheme://redirect",
        });

        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl,
        });

        if (createdSessionId) {
          await setActive?.({ session: createdSessionId });
        }
      } catch (err) {
        console.error("SSO error:", JSON.stringify(err, null, 2));
      }
    },
    [startSSOFlow]
  );

  useEffect(() => {
    const handleSignIn = async () => {
  const endpoint="/signin/user"
      if (isSignedIn) {
        console.log(user?.imageUrl)
        console.log(userId)
        console.log("User is signed in"); //for checking user is signed in or not
        console.log("User email:", user?.emailAddresses[0].emailAddress); //for checking user mail
        console.log("User fullname:", user?.fullName); //for checking user full name
        console.log("your provider:", user?.externalAccounts?.[0]?.provider); //for checking user provider either google or apple
        router.push("/(tabs)");

        try {
          console.log("full api", base_url+endpoint)
          const response = await fetch(`${base_url}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName: user?.fullName,
              email: user?.emailAddresses[0].emailAddress,
              imageUrl:user?.imageUrl,
              providerInfo:{
                providerName: user?.externalAccounts?.[0]?.provider,
                providerId:userId
              }
            }),
          });

          const data = await response.json();
          console.log("Response status:", response); //for checking response status
          console.log("Response body:", data); //for checking response body
          const token = data.data?.token;

          if (response.status === 201 && token) {
            // console.log("token stored"); //for checking token is stored or not
            await saveAuthToken(token);
          } else {
            // console.log("token not stored"); //for checking token is stored or not
          }
        } catch (error) {
          console.error("Sign-in request failed:", error);
        }
      } else {
        console.log("User is not signed in");
      }
    };

    handleSignIn();
  }, [isSignedIn, router, user, userId]);

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

          <TouchableOpacity
            style={[styles.button, { width: width * 0.85 }]}
            onPress={() => handleLogin("oauth_google")}
          >
            <Image
              source={require("@/assets/images/logo_google.png")}
              style={styles.logo}
            />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { width: width * 0.85 }]}
            onPress={() => handleLogin("oauth_apple")}
          >
            <Image
              source={require("@/assets/images/logo_apple.png")}
              style={styles.logo}
            />
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </TouchableOpacity>

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
    backgroundColor: "#004110",
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
