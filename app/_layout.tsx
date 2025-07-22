import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Drawer } from "expo-router/drawer";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 40 }}
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)/save")}
      >
        <MaterialIcons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Drawer Items */}
      <DrawerItem
        label={() => <Text style={styles.label}>Saving Suggestion</Text>}
        icon={({ size }) => (
          <MaterialIcons name="assistant" size={size} color="#F58221" />
        )}
        onPress={() => router.push("/save/savingSuggestion")}
      />

      <DrawerItem
        label={() => <Text style={styles.label}>History</Text>}
        icon={({ size }) => (
          <MaterialIcons name="history" size={size} color="#00A0EE" />
        )}
        onPress={() => router.push("/save/history")}
      />

      <DrawerItem
        label={() => <Text style={styles.label}>Insights</Text>}
        icon={({ size }) => (
          <MaterialIcons name="insights" size={size} color="#3636FF" />
        )}
        onPress={() => router.push("/save/insights")}
      />
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  const publishableKey =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Drawer
  screenOptions={{ headerShown: false }} // ✅ hides the drawer header globally
  drawerContent={(props) => <CustomDrawerContent {...props} />}
>
        {/* ✅ Hide tab navigation screens from the drawer */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerItemStyle: { display: "none" }, // hides from drawer UI
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="bank/ConnectBankPage"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="signup/signUp"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="goal/createGoal"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="goal/SavingMethod"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="goal/suggestion"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="previewGoal/deposit"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="previewGoal/withdraw"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="previewGoal/previewGoal"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="profile/profile"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="dashboard/activeChallenges"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="signup/components/progressBar"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="signup/components/multiSelectButton"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="+not-found"
          options={{ drawerItemStyle: { display: "none" } }}
        />

        <Drawer.Screen
          name="redirect"
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
      <Toast />
    </ClerkProvider>
  );
}
const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#000",
    fontWeight: "500",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  verticalLine: {
    width: 1,
    height: 24,
    backgroundColor: "#ccc",
    marginHorizontal: 12,
  },
  label: {
    fontSize: 16,
    color: "#121417",
    fontWeight: "500",
  },
});
