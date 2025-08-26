import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { goalImageMap } from "@/components/ActiveGoals/goalsMap";
import { fetchGoals } from "@/utils/fetchgoals";
import { base_url } from "@/config/url";
import { ProgressBar } from "react-native-paper";
import { getAuthToken } from "@/utils/authToken";

const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

const GoalScreen = () => {
  const { goal } = useLocalSearchParams();
  const selectedGoal = goal ? JSON.parse(goal as string) : null;

  const [mode, setMode] = useState<
    "Active Goals" | "Paused Goals" | "Completed Goals"
  >("Active Goals");
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);

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

  // --- Fetch Wallet Data ---
  useEffect(() => {
    const fetchWalletData = async () => {
      const token = await getAuthToken("user");
      try {
        const response = await fetch(`${base_url}/wallet/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        setWalletData(json?.data?.data || null);
      } catch (error) {
        console.error("Error fetching wallet data", error);
      }
    };
    fetchWalletData();
  }, []);

  // --- Filter goals by current tab ---
  const filteredGoals = goals.filter((g) => {
    if (mode === "Active Goals") return g.status === "active";
    if (mode === "Paused Goals") return g.status === "pause";
    if (mode === "Completed Goals") return g.status === "complete";
    return false;
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Header */}
      <View style={styles.container}>
        <Text style={styles.headerText}>Smart Goals</Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => router.push("/goal/suggestion")}
        >
          <Image
            source={require("@/assets/images/Suggestion.png")}
            style={styles.headerLeftIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Total Saved Card */}
      <View style={styles.totalCard}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.amount}>
              £ {walletData?.totalSaveAmount ?? "—"}
            </Text>
            <Text style={styles.cardLabel}>Total saved</Text>
          </View>
          <Image source={require("@/assets/images/Target.png")} />
        </View>
        <View style={styles.progressWrapper}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>Overall Progress</Text>
            <Text style={styles.progressText}>
              £ {walletData?.totalSaveAmount ?? "—"} of{" "}
              {walletData?.totalTargetAmount ?? "—"}
            </Text>
          </View>
          <ProgressBar
            progress={
              walletData?.totalTargetAmount
                ? (walletData.totalSaveAmount ?? 0) /
                  walletData.totalTargetAmount
                : 0
            }
            color="#F97316"
            style={styles.progressWalletBar}
          />
        </View>
      </View>

      {/* Switch Tabs */}
      <View style={styles.switchTabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            mode === "Active Goals" && styles.tabActiveGreen,
          ]}
          onPress={() => setMode("Active Goals")}
        >
          <Text
            style={[
              styles.tabText,
              mode === "Active Goals" && styles.tabTextActiveGreen,
            ]}
          >
            Active Goals
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={[
            styles.tabButton,
            mode === "Paused Goals" && styles.tabActiveRed,
          ]}
          onPress={() => setMode("Paused Goals")}
        >
          <Text
            style={[
              styles.tabText,
              mode === "Paused Goals" && styles.tabTextActiveRed,
            ]}
          >
            Paused Goals
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.tabButton,
            mode === "Completed Goals" && styles.tabActiveGreen,
          ]}
          onPress={() => setMode("Completed Goals")}
        >
          <Text
            style={[
              styles.tabText,
              mode === "Completed Goals" && styles.tabTextActiveGreen,
            ]}
          >
            Completed Goals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Goals List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View>
          {loading ? (
            <Text>Loading...</Text>
          ) : filteredGoals.length === 0 ? (
            <Text>No goals yet</Text>
          ) : (
            filteredGoals.map((goal, index) => {
              const imageKey = goal.goalImage as keyof typeof goalImageMap;
              const emoji = goalImageMap[imageKey] || "🎯";
              const progressPercent = goal.goalAmount
                ? Math.min(
                    ((goal.savedAmount ?? 0) / goal.goalAmount) * 100,
                    100
                  )
                : 0;

              return (
                <TouchableOpacity
                  key={goal.id ?? index}
                  style={styles.goalCard}
                  onPress={() =>
                    router.push({
                      pathname: "/previewGoal/previewGoal",
                      params: { goal: JSON.stringify(goal) },
                    })
                  }
                >
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalEmoji}>{emoji}</Text>
                    <Text style={styles.goalTitle}>
                      {goal.goalName || "Untitled Goal"}
                    </Text>
                  </View>

                  <Text style={styles.goalTarget}>
                    Days Left: {goal.daysLeft ?? "-"}
                  </Text>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progressPercent}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.cardAmount}>
                    <Text style={styles.goalTarget}>
                      Target: £{(goal.goalAmount ?? 0).toFixed(2)}
                    </Text>
                    <Text style={styles.goalStat}>
                      Saved: £{(goal.savedAmount ?? 0).toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
      {/* Floating Goal Create Button */}
      <TouchableOpacity
        style={styles.fabFixed}
        onPress={() => router.push("/goal/createGoal")}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GoalScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  headerLeftIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#DBFFE9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  switchTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    padding: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  tabText: {
    fontWeight: "600",
    color: "#9CA3AF",
  },
  tabActiveGreen: {
    backgroundColor: "#D1FAE5",
  },
  tabActiveRed: {
    backgroundColor: "#FEE2E2",
  },
  tabTextActiveGreen: {
    color: "#10B981",
  },
  tabTextActiveRed: {
    color: "#EF4444",
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: hp(2),
    width: wp(90),
    alignSelf: "center",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  goalEmoji: {
    fontSize: wp(6),
    marginRight: wp(3),
  },
  goalTitle: {
    fontSize: wp(4.2),
    fontWeight: "600",
    color: "#1F2937",
  },
  goalTarget: {
    fontSize: wp(3.5),
    color: "#6B7280",
    marginBottom: hp(1),
  },
  goalStat: {
    fontSize: wp(3.2),
    color: "#6B7280",
  },
  progressBarContainer: {
    width: "100%",
    height: hp(1),
    backgroundColor: "#E5E7EB",
    borderRadius: wp(1),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: wp(1),
    backgroundColor: "#FB923C",
  },
  cardAmount: {
    marginTop: hp(1.2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#F9FAFB",
  },
  totalCard: {
    backgroundColor: "#083623",
    borderRadius: 16,
    padding: 16,
    margin:10,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  cardLabel: {
    fontSize: 16,
    color: "#D1FAE5",
    marginTop: 4,
  },
  progressWrapper: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 8,
    borderRadius: 12,
  },
  progressTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressText: {
    textAlign: "right",
    fontWeight: "600",
    color: "#111827",
  },
  progressWalletBar: {
    height: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  fabIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "600",
  },
  fabFixed: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? "15%" : "12%",
    right: 24,
    backgroundColor: "#389F61",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 10,
  },
});
