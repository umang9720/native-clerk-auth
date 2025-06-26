import { View, Text,SafeAreaView, Dimensions, StatusBar,StyleSheet, Image, Button } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Responsive dimensions
const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

const hp = (percentage: number) => {
  return (height * percentage) / 100;
};



export default function Community() {
  const { signOut, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn]);

  return (
    <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Community</Text>
          </View>
    
    <View style={styles.body}>
            <Image
          source={require('@/assets/images/community.png')}
        
        />
       <Text style={styles.text}>Coming Soon</Text>
             <Button title="Sign Out" onPress={async () => await signOut()} />
       
    </View>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: wp(7),
    fontWeight: '600',
    color: '#121417',
    fontFamily:"Poppins",

  },
  body:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  text:{
    color:"#637587",
    fontWeight:"500",
    fontSize:wp(8),
    marginTop:10,
    fontFamily:"Poppins",
  }
  
  
});