import { ActiveGoalsList } from "@/components/ActiveGoals/ActiveGoalList";
import { base_url } from "@/config/url";
import { useNotification } from "@/context/NotificationContext";
import { getAuthToken } from "@/utils/authToken";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const wp = (percentage: any) => (width * percentage) / 100;
const hp = (percentage: any) => (height * percentage) / 100;

export default function Index() {
  const [prevPermissionStatus, setPrevPermissionStatus] = useState<
    string | null
  >(null);

  const { notification, expoPushToken, error } = useNotification();
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();
  //  if(expoPushToken)Alert.alert("notification");
  //  if(error) Alert.alert("error");

  // if (error) {
  //   return <View>Error: {error.message}</View>;
  // }

  useEffect(() => {
    const updateDeviceTokenIfPermissionChanged = async () => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        // Only run if first check OR status changed
        if (
          prevPermissionStatus === null ||
          prevPermissionStatus !== existingStatus
        ) {
          setPrevPermissionStatus(existingStatus);

          // Only send token if granted & token exists
          const token = await getAuthToken("user");
          if (!token) {
            console.warn("No auth token found");
            return;
          }

          let deviceToken = "null";

          if (existingStatus === "granted" && expoPushToken) {
            deviceToken = expoPushToken;
          } else {
            console.log("🚫 Notifications permission not granted");
          }

          const formData = new FormData();
          formData.append("deviceToken", deviceToken);

          try {
            const response = await axios.patch(
              `${base_url}/create/user`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response) {
              console.log("✅ Device token updated:", deviceToken);
              console.log("response", response);
            }
          } catch (error) {
            console.error("❌ Failed to update device token:", error);
          }
        }
      } catch (err) {
        console.error("Error updating device token:", err);
      }
    };
    updateDeviceTokenIfPermissionChanged();
  }, [expoPushToken, prevPermissionStatus]);

  useEffect(() => {
    if (isUpdatePending) {
      dummyFunction();
    }
  }, [isUpdatePending]);

  const dummyFunction = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      Alert.alert("Error");
    }
  };

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable;

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "This app is running from built-in code"
    : "This app is running an update";

  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const endpoint = "/goals/user";

  // 📌 Check notification permission + send device token
  useEffect(() => {
    const registerForPushNotifications = async () => {
      try {
        const token = await getAuthToken("user");

        let deviceToken = "";

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus === "granted") {
          const pushToken = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId,
          });
          deviceToken = pushToken.data;
        }

        // 📤 Send token (or empty string) to backend

        const formData = new FormData();
        const isActive = true;

        formData.append("isActive", String(isActive));
        // formData.append("preferences[pushNotification]", true);
        formData.append("deviceToken", deviceToken);

        const response = await axios.patch(
          `${base_url}/api/create/user`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response) {
          // console.log(response)
        }
        console.log("Device token updated:", deviceToken || "empty");
      } catch (err) {
        // console.error("Error updating device token:", err);
      }
    };

    registerForPushNotifications();
  }, []);

  // 📌 Fetch active goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken("user");
        if (!token) {
          console.warn("User not found in storage");
          setLoading(false);
          return;
        }

        const response = await fetch(`${base_url}${endpoint}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response?.status === 201 && Array.isArray(data?.data?.data)) {
          const activeGoals = data.data.data.filter(
            (goal: any) => goal.status === "active"
          );
          setGoals(activeGoals);
        } else {
          setGoals([]);
        }
      } catch (error: any) {
        console.error("Error fetching goals:", error.message);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchGoals();
  }, [isFocused]);

  // 🔹 The rest of your renderHeader, renderFooter, styles remain unchanged
  const renderHeader = () => (
    <>
      <View style={styles.container}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/splash_icon.png")}
            style={styles.headerLeftIcon}
          />
          <Text style={styles.headerText}>BuckUp</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications-none" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.walletIcon]}>
            <MaterialIcons
              name="account-balance-wallet"
              size={20}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/profile/profile")}
          >
            <MaterialIcons name="account-circle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Card}>
        <View style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <View>
              <Text style={styles.cardLabel}>Today&apos;s Saving</Text>
              <Text style={styles.cardAmount}>£13.00</Text>
              <Text style={styles.cardQuote}>
                “Your habits are creating financial freedom.”
              </Text>
            </View>
            <Text style={styles.streak}>🔥 3 Days</Text>
          </View>
          <View style={styles.habitRow}>
            {"🟢🟢🟢🟢🟢🔴🟢".split("").map((circle, idx) => (
              <Text key={idx} style={{ fontSize: 18 }}>
                {circle}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderFooter = () => (
    <>
      <View style={styles.Card}>
        {/* Active Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity
              onPress={() => router.push("/dashboard/activeChallenges")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.challengeRow}>
            {[
              {
                title: "🥗 No takeout Week",
                desc: "Ditch delivery for a week and save more.",
                progress: "3/5",
                save: "£40",
              },
              {
                title: "📉 Track habits",
                desc: "Track daily habits & hit your goal.",
                progress: "2/5",
                save: "£20",
              },
            ].map((item, idx) => (
              <View key={idx} style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDesc}>{item.desc}</Text>
                <Text style={styles.challengeProgress}>
                  {item.progress} • Save: {item.save}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <FlatList
        data={goals}
        keyExtractor={(item: any, index) =>
          item._id?.toString() || index.toString()
        }
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            <ActiveGoalsList goals={goals} />
          </>
        )}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.noGoalsText}>No Active Goals</Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  Card: {
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  walletIcon: {
    backgroundColor: "#DBFFE9",
  },
  savingsCard: {
    backgroundColor: "#024b2f",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  savingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLabel: {
    color: "#C0EFC0",
    fontSize: 14,
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardQuote: {
    color: "#C0EFC0",
    fontSize: 12,
    marginTop: 4,
    maxWidth: 200,
  },
  streak: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "600",
    marginTop: 6,
  },
  habitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: wp(2),
    padding: wp(3),
    marginBottom: hp(1),
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
  },
  goalEmoji: {
    fontSize: wp(4),
    marginRight: wp(2),
  },
  goalTitle: {
    fontSize: wp(3.5),
    fontWeight: "500",
    color: "#1F2937",
  },
  goalTarget: {
    fontSize: wp(3),
    color: "#6B7280",
    marginBottom: hp(1),
  },
  goalStat: {
    fontSize: wp(2.5),
    color: "#6B7280",
    marginBottom: hp(0.5),
  },
  progressBarContainer: {
    width: "100%",
    height: hp(0.7),
    backgroundColor: "#E5E7EB",
    borderRadius: wp(1),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: wp(1),
  },
  challengeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  challengeCard: {
    flex: 1,
    backgroundColor: "#FFF6ED",
    padding: 14,
    borderRadius: 12,
  },
  challengeTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 13,
    color: "#444",
  },
  challengeProgress: {
    fontSize: 13,
    color: "#FB923C",
    marginTop: 6,
  },
  impactCard: {
    marginTop: 28,
    backgroundColor: "#E7F8EE",
    borderRadius: 12,
    padding: 16,
  },
  impactTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  impactAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#034a2f",
  },
  impactPercent: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34C759",
  },
  impactLabel: {
    fontSize: 13,
    color: "#444",
  },
  impactList: {
    gap: 8,
  },
  noGoalsText: {
    fontSize: wp(3.5),
    color: "#6B7280",
    textAlign: "center",
    marginVertical: hp(2),
  },
});
