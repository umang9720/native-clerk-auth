import { View, Image, Text, Button } from 'react-native';
import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function Profile() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn]);

  return (
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
  );
}