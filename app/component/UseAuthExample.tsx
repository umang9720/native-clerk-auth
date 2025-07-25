import { useAuth, useUser } from '@clerk/clerk-expo'
import { Text, View, TouchableOpacity,StyleSheet,Image,Button } from 'react-native'
import React, { useEffect } from 'react';
import { router } from 'expo-router';


export default function UseAuthExample() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken,signOut } = useAuth()

  const { user } = useUser();
  
    useEffect(() => {
      if (!isSignedIn) {
        router.push('/');
      }
    }, [isSignedIn]);
  const fetchExternalData = async () => {
    // Use `getToken()` to get the current user's session token
    const token = await getToken()
   

    // Use `token` to fetch data from an external API
    const response = await fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
 console.log(token)
    return response.json()
  }

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <Text>Loading...</Text>
  }

  // Use `isSignedIn` to check if the user is signed in
  if (!isSignedIn) {
    // You could also add a redirect to the sign-in page here
    return <Text>Sign in to view this page</Text>
  }

  return (
    <View style={styles.container}>
      <Text>
        Hello, {userId}! Your current active session is {sessionId}.
      </Text>
      <TouchableOpacity onPress={fetchExternalData}>
        <Text>Fetch Data</Text>
      </TouchableOpacity>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap:5 }}>
            <Image
              width={100}
              height={100}
              source={{ uri: user?.imageUrl }}
              style={{ borderRadius: 50 }}
            />
            <View>
              <Text style={{ fontSize: 12, color: 'black', fontWeight: 'bold', marginTop: 4 }}>
                User Email: {user?.emailAddresses[0].emailAddress}
              </Text>
              <Text style={{ fontSize: 12, color: 'black', fontWeight: 'bold', marginTop: 4, marginBottom: 4 }}>
                User Name: {user?.fullName}
              </Text>
            </View>
            <Button title="Sign Out" onPress={async () => await signOut()} />
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#fff",
  },
})