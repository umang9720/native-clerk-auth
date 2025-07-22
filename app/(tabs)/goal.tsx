import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
// import { FontAwesome5 } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ActiveGoalsList } from "@/components/ActiveGoals/ActiveGoalList";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/authToken";
import { base_url } from "@/config/url";
import { useIsFocused } from "@react-navigation/native"; // if needed

Dimensions.get("window");

const SmartGoalsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true); 
   const [walletData, setWalletData] = useState<any>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken("user");
        if (!token) {
          console.warn("User token not found");
          setLoading(false);
          return;
        }

        //wallet connection
       const fetchWalletData = async () => {
      const token = await getAuthToken("user");
      if (!token) return;

      try {
        const response = await fetch(`${base_url}/wallet/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        const wallet = json?.data?.data;
        setWalletData(wallet);
        console.log("Wallet data:", wallet);
      } catch (error) {
        console.error("Error fetching wallet data", error);
      }
    };

    fetchWalletData();

        //for displaying active goals of user
        const response = await fetch(`${base_url}/goals/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.status === 201 && Array.isArray(data?.data?.data)) {
          const allGoals = data.data.data;

          // 🟢 Reverse and then filter active goals
          const activeGoals = allGoals
            .reverse()
            .filter((goal: any) => goal.status === "active");

          setGoals(activeGoals);
        } else {
          setGoals([]);
        }
        const activeGoals =
          data?.data?.data?.filter((g: any) => g.status === "active") || [];
        setGoals(activeGoals.reverse()); // Reverse to show latest at top
      } catch (error) {
        console.error("Error fetching goals:", error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchGoals();
    }
  }, [isFocused]);

  const router = useRouter();
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
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Total Saved Card */}
        <View style={styles.totalCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.amount}>£ {walletData?.totalSaveAmount ?? "—"}</Text>
              <Text style={styles.cardLabel}>Total saved</Text>
            </View>
            <Image source={require("@/assets/images/Target.png")} />
          </View>
          <View style={styles.progressWrapper}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>Overall Progress</Text>
              <Text style={styles.progressText}> £ {walletData?.totalSaveAmount ?? "—"} of {walletData?.totalTargetAmount ?? "—"}</Text>
            </View>
            <ProgressBar
              progress={0.13}
              color="#F97316"
              style={styles.progressBar}
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Text style={[styles.tabText, styles.activeTab]}>Active Goals</Text>
          <Text style={styles.tabText}>Pause</Text>
          <Text style={styles.tabText}>Completed Goal</Text>
        </View>

        {/* Goal Cards */}
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : goals.length > 0 ? (
          <ActiveGoalsList goals={goals} />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No active goals
          </Text>
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/goal/createGoal")}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SmartGoalsScreen;
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
  scroll: {
    padding: 16,
    paddingBottom: 100,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  totalCard: {
    backgroundColor: "#083623",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
  progressBar: {
    height: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabText: {
    fontSize: 14,
    paddingBottom: 8,
    color: "#6B7280",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#10B981",
    color: "#111827",
    fontWeight: "600",
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  goalStatus: {
    marginLeft: "auto",
  },
  statusTextGreen: {
    color: "#10B981",
    fontWeight: "500",
  },
  statusTextRed: {
    color: "#F97316",
    fontWeight: "500",
  },
  daysLeft: {
    marginBottom: 4,
    color: "#374151",
  },
  bold: {
    fontWeight: "700",
    color: "#111827",
  },
  progressBarGoal: {
    height: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: "#389F61",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "600",
  },
});
