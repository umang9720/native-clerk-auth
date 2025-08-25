# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform
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
  const [activeGoals, setActiveGoals] = useState<any[]>([]);
  const [completedGoals, setCompletedGoals] = useState<any[]>([]);
  const [pausedGoals, setPausedGoals] = useState<any[]>([]);
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

        // --- Fetch Wallet Data ---
        const fetchWalletData = async () => {
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
        await fetchWalletData();

        // --- Fetch All Goals ---
        const response = await fetch(`${base_url}/goals/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const allGoals = Array.isArray(data?.data?.data) ? data.data.data.reverse() : [];

        // --- Filter by Status ---
        setActiveGoals(allGoals.filter((g: any) => g.status === "active"));
        setCompletedGoals(allGoals.filter((g: any) => g.status === "complete"));
        setPausedGoals(allGoals.filter((g: any) => g.status === "pause"));

      } catch (error) {
        console.error("Error fetching goals:", error);
        setActiveGoals([]);
        setCompletedGoals([]);
        setPausedGoals([]);
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
              <Text style={styles.progressText}>
                £ {walletData?.totalSaveAmount ?? "—"} of {walletData?.totalTargetAmount ?? "—"}
              </Text>
            </View>
            <ProgressBar
              progress={0.13}
              color="#F97316"
              style={styles.progressBar}
            />
          </View>
        </View>

        {/* Active Goals */}
        <Text style={[styles.tabText, styles.activeTab]}>Active Goals</Text>
        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
        ) : activeGoals.length > 0 ? (
          <ActiveGoalsList goals={activeGoals} />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No active goals found</Text>
        )}

        {/* Paused Goals */}
        <Text style={[styles.tabText, styles.activeTab]}>Paused Goals</Text>
        {pausedGoals.length > 0 ? (
          <ActiveGoalsList goals={pausedGoals} />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No paused goals found</Text>
        )}

        {/* Completed Goals */}
        <Text style={[styles.tabText, styles.activeTab]}>Completed Goals</Text>
        {completedGoals.length > 0 ? (
          <ActiveGoalsList goals={completedGoals} />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>No completed goals found</Text>
        )}
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fabFixed}
        onPress={() => router.push("/goal/createGoal")}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
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
