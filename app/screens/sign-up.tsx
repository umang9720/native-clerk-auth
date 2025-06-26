import * as React from 'react'
import { Text, TextInput, Button, View,StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

const { width } = Dimensions.get("window");

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <>
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} />
      </>
    )
  }

  return (
        <View style={styles.container}>
       <View style={styles.textWrapper}>
         <Text style={styles.text}>Sign up</Text>
         <View style={{ flexDirection: 'row', gap: 4 }}>
          <Text style={{color:"#757575", fontWeight:"medium", fontSize:15}}>Have an account?</Text>
          <Link href="/screens/sign-in">
            <Text style={{color:"#1C1825", fontWeight:"semibold", fontSize:15}}>Sign in</Text>
          </Link>
        </View>
       </View>
        <TextInput
          autoCapitalize="none"
        style={styles.input}
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#666666"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <TextInput
          value={password}
        style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#666666"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
         <TouchableOpacity style={styles.logBtn} onPress={onSignUpPress} >
               <Text style={styles.btnText}>Log In</Text>
             </TouchableOpacity>
       
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  textWrapper:{
    marginTop:20,
    marginBottom:10,
    width:300,
    height:60,
    textAlign:"left",
    justifyContent:"space-between",
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
});