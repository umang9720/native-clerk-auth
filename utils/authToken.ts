// utils/authToken.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const saveAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    // console.log('✅ Token stored successfully:', token);
  } catch (error) {
    console.error('❌ Failed to store token:', error);
  }
};

export const getAuthToken = async (p0: string): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    // console.log('📝 Retrieved token:', token);
    return token;
  } catch (error) {
    console.error('❌ Failed to retrieve token:', error);
    return null;
  }
};

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    console.log('✅ Token cleared');
  } catch (error) {
    console.error('❌ Failed to clear token:', error);
  }
};
