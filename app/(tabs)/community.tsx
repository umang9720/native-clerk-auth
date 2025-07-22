import { View, Text, Dimensions, StatusBar,StyleSheet, Image } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get('window');

// Responsive dimensions
const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

const hp = (percentage: number) => {
  return (height * percentage) / 100;
};



export default function Community() {


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
         backgroundColor: '#F9FAFB',


  },
  text:{
    color:"#637587",
    fontWeight:"500",
    fontSize:wp(8),
    marginTop:10,
    fontFamily:"Poppins",
  }
  
  
});