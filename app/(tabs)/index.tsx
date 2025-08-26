import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { getAuthToken } from "@/utils/authToken";
import { base_url } from "@/config/url";
import { useIsFocused } from "@react-navigation/native";
import { ActiveGoalsList } from "@/components/ActiveGoals/ActiveGoalList";
import { fetchGoals } from "@/utils/fetchgoals";

const { width, height } = Dimensions.get("window");
const wp = (percentage: any) => (width * percentage) / 100;
const hp = (percentage: any) => (height * percentage) / 100;

type StreakActivity = {
  date: string;
  day: string;
  sacrificed: boolean;
};

type Calculated = {
  totalSaveAmount: number;
  totalSacrificeSaveAmount: number;
  todaySaving: number;
  thisWeekSaving: number;
  streakDays: number;
  streakActivity: StreakActivity[];
};

type Wallet = {
  _id: string;
  totalSaveAmount: number;
  totalTargetAmount: number;
  isBankConnected: boolean;
  userId: string;
  __v: number;
  calculated: Calculated;
};

export default function Index() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const isFocused = useIsFocused();
  const endpoint = "/goals/user";
  useFocusEffect(
    useCallback(() => {
      const loadGoals = async () => {
        setLoading(true);
        const data = await fetchGoals();
        setGoals(data);
        setLoading(false);
      };
      loadGoals();
    }, [])
  );
  //for fetching wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = await getAuthToken("user");
        const response = await fetch(`${base_url}/wallet/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log("Parsed response data:", JSON.stringify(json, null, 2));

        const payload = json?.data?.data as Wallet | undefined;
        if (payload) {
          setWalletData(payload);
        } else {
          console.warn("Unexpected wallet response shape:", json);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);

  const formatGBP = (v?: number) => `£${Number(v ?? 0).toFixed(2)}`;

  // useEffect(() => {
  //   const fetchGoals = async () => {
  //     try {
  //       setLoading(true);
  //       const token = await getAuthToken("user");
  //       if (!token) {
  //         console.warn("User not found in storage");
  //         setLoading(false);
  //         return;
  //       }

  //       const response = await fetch(`${base_url}${endpoint}`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       const data = await response.json();
  //       console.log("Parsed response data:", data);

  //       if (response?.status === 201 && Array.isArray(data?.data?.data)) {
  //         const activeGoals = data.data.data.filter(
  //           (goal: any) => goal.status === "active"
  //         );
  //         setGoals(activeGoals);
  //       } else {
  //         console.log("No valid goals data");
  //         setGoals([]);
  //       }
  //     } catch (error: any) {
  //       console.error("Error fetching goals:", error.message);
  //       setGoals([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (isFocused) fetchGoals();
  // }, [isFocused]);

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.container}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/splash_icon.png")}
            style={styles.headerLeftIcon}
          />
          <Text style={styles.headerText}>BuckUp</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/notifications/notification")}
          >
            <MaterialIcons name="notifications-none" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, styles.walletIcon]}
            onPress={() => router.push("/wallet/wallet")}
          >
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
        
        {/* Savings Card */}
<View style={styles.savingsCard}>
  {!walletData ? ( // <--- show loading until data is fetched
    <Text style={{ color: "#fff" }}>Loading wallet data...</Text>
  ) : (
    <>
      <View style={styles.savingsRow}>
        <View>
          <Text style={styles.cardLabel}>Today&apos;s Saving</Text>
          <Text style={styles.cardAmount}>
            {formatGBP(walletData?.totalSaveAmount)}
          </Text>
          <Text style={styles.cardQuote}>
            “Your habits are creating financial freedom.”
          </Text>
        </View>
        <Text style={styles.streak}>
          🔥 {walletData?.calculated?.streakDays ?? 0} Days
        </Text>
      </View>

      {/* Streak activity row */}
      <View style={styles.habitRow}>
        {walletData?.calculated?.streakActivity?.length ? (
          walletData.calculated.streakActivity.map((activity) => (
            <View
              key={activity.date}
              style={{ alignItems: "center", marginRight: 8 }}
            >
              <Text style={{ fontSize: 18 }}>
                {activity.sacrificed ? "✅" : "❌"}
              </Text>
              <Text style={{ fontSize: 12, color: "#555" }}>
                {activity.day}
              </Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "#fff" }}>No streak data yet</Text>
        )}
      </View>
    </>
  )}
</View>

        {/* Active Goals Title */}
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
        {/* Challenges Section */}
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

        {/* Impact Card */}
        <View style={styles.impactCard}>
          <View style={styles.impactTop}>
            <View>
              <Text style={styles.impactAmount}>£1,605</Text>
              <Text style={styles.impactLabel}>Potential yearly savings</Text>
            </View>
            <View>
              <Text style={styles.impactPercent}>68%</Text>
              <Text style={styles.impactLabel}>Success rate</Text>
            </View>
          </View>
          <View style={styles.impactList}>
            <Text>✅ Avoided 18 sugary drinks</Text>
            <Text>✅ Added 5,000+ steps weekly</Text>
            <Text>✅ Reduced caffeine by 20%</Text>
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
