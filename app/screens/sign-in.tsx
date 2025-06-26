import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useAuth, useSignIn, useSSO, useUser } from "@clerk/clerk-expo";
import { View,  StyleSheet, TouchableOpacity,Image, Text, TextInput, Dimensions } from "react-native";
import { Link, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Warm up browser for auth redirects
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {


  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

   useWarmUpBrowser();

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, signIn, emailAddress, password, setActive, router])

 

  const { startSSOFlow } = useSSO();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const handleLogin = useCallback(
    async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
      try {
        const redirectUrl = AuthSession.makeRedirectUri({
          native: "your.app.scheme://redirect", // Optional custom scheme for standalone app
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

  // Redirect after login
  useEffect(() => {
    if (isSignedIn) {
      console.log("User is signed in:", user);
      router.push("/screens/screen");
    } else {
      console.log("User is not signed in");
    }
  }, [isSignedIn, router, user]);

  return (
    <View style={styles.container}>
       <Image
        source={require('@/assets/images/Group 1.png')}
        style={{ width: 70, height: 70, marginBottom:30 }}
      />
       <Text style={styles.text}>Welcome Back To</Text>
       <Text style={styles.text}>Good Breach!</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        value={password}
        style={styles.input}
        placeholder="Enter password"
        placeholderTextColor="#666666"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.logBtn} onPress={onSignInPress} >
        <Text style={styles.btnText}>Log In</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Text>Don&apos;t have an account?</Text>
        <Link href="/screens/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
  

       <TouchableOpacity style={styles.button} onPress={() => handleLogin("oauth_google")}>
      <Image source={require('@/assets/images/logo_google.png')} style={styles.logo} />
      <Text style={styles.buttonText}>Continue with Google</Text>
    </TouchableOpacity>


    <TouchableOpacity style={styles.button} onPress={() => handleLogin("oauth_apple")}>
      <Image source={require('@/assets/images/logo_apple.png')} style={styles.logo} />
      <Text style={styles.buttonText}>Continue with Apple</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.button} onPress={() => handleLogin("oauth_facebook")}>
      <Image source={require('@/assets/images/logo_facebook.png')} style={styles.logo} />
      <Text style={styles.buttonText}>Continue with Facebook</Text>
    </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text:{
    color:"#1C1825",
    fontSize: 24,
    fontWeight:"bold",
    fontFamily:"Ouicksand",
  },
  input: {
    backgroundColor: "#FFEAE9",
    borderRadius: 10,
    width: width * 0.8,
    padding: 12,
    marginTop: 15,
  },
  spacer: {
    height: 12,
  },
  logBtn: {
    backgroundColor: "#F0C0BE",
    padding: 15,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    width: width * 0.8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16 },
   button: {
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#FFEAE9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    width: 346,
   
  },
  logo: {
    marginRight: 10,
  },
  buttonText: {
    color: '#1C1825',
    fontSize: 16,
    fontWeight: 'medium',
  },

});
