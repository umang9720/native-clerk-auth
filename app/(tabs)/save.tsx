import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "@/utils/authToken";
import { base_url } from "@/config/url";
import { useFocusEffect } from "@react-navigation/native";

// ✅ Define goal type
type Goal = {
  id: string;
  goalName: string;
};
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
export default function SmartSavings() {
  const router = useRouter();
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [walletData, setWalletData] = useState<Wallet | null>(null);
  

  const fetchGoals = useCallback(async () => {
    try {
      const token = await getAuthToken("user");
      const response = await fetch(`${base_url}/goals/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      const goalsData: Goal[] = result?.data?.data || [];
      setGoals(goalsData);
      // Auto-select latest goal (optional)
      // if (goalsData.length > 0) {
      //   setSelectedGoalId(goalsData[goalsData.length - 1].id);
      // }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  }, []); // Empty deps if you don’t rely on other state/props

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [fetchGoals])
  );
  // Called once on mount

  const handleSave = async (label: string, desc: string, value: number) => {
    if (!selectedGoalId) {
      alert("Please select a goal to save to.");
      return;
    }

    const token = await getAuthToken("user");
    await createSave(token, selectedGoalId, label, desc, value);
  };

  const createSave = async (
    token: string | null,
    goalId: string,
    label: string,
    desc: string,
    value: number
  ) => {
    try {
      const response = await fetch(`${base_url}/money/sacrifice`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId,
          title: label,
          type: "sacrifice",
          description: desc,
          amount: value,
        }),
      });
      const result = await response.json();
      alert("Save created");
    } catch (error) {
      console.error("Error creating save:", error);
    }
  };

  const renderGoal = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.goalOption,
        selectedGoalId === item.id && styles.goalActive,
      ]}
      onPress={() => setSelectedGoalId(item.id)}
    >
      <View style={styles.goalRow}>
        <Text
          style={[
            styles.goalText,
            selectedGoalId === item.id && styles.goalTextActive,
          ]}
        >
          {item.goalName}
        </Text>
        <Ionicons
          name={
            selectedGoalId === item.id ? "radio-button-on" : "radio-button-off"
          }
          size={20}
          color={selectedGoalId === item.id ? "#fff" : "#6B7280"}
        />
      </View>
    </TouchableOpacity>
  );

  const quickSaves = [
    {
      icon: "coffee",
      label: "Skip Coffee",
      desc: "Made coffee at home",
      value: 4.5,
    },
    {
      icon: "hamburger",
      label: "Bring Lunch",
      desc: "Packed lunch from home",
      value: 9.5,
    },
    {
      icon: "walk",
      label: "Walk Instead",
      desc: "Walked instead of rideshare",
      value: 8.75,
    },
  ];

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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Savings</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={renderGoal}
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.label}>Today's Saving</Text>
                  <Text style={styles.cardAmount}>
                             {formatGBP(walletData?.totalSaveAmount)}
                           </Text>
                </View>
                {/* <View>
                  <Text style={styles.label}>This Week</Text>
                  <Text style={styles.cardAmount}>
                             {formatGBP(walletData?.calculated?.thisWeekSaving)}
                           </Text>
                </View> */}
              </View>
              <Text style={styles.streak}>🔥 3 Days Saving Streak</Text>
              <View style={styles.habits}>
                {"🟢🟢🟢🟢🟢🔴🟢".split("").map((circle, index) => (
                  <Text key={index} style={{ fontSize: 20 }}>
                    {circle}
                  </Text>
                ))}
              </View>
            </View>

            {/* Challenges */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.challengeRow}
            >
              <View style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>🥗 No takeout Week</Text>
                <Text style={styles.challengeDesc}>
                  Ditch delivery for a week and save more.
                </Text>
                <Text style={styles.challengeProgress}>3/5 — Save: £40</Text>
              </View>
              <View style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>
                  📉 Track Your Spending
                </Text>
                <Text style={styles.challengeDesc}>
                  Track habits & hit goals.
                </Text>
                <Text style={styles.challengeProgress}>2/5</Text>
              </View>
            </ScrollView>

            {/* Quick Saves */}
            <View style={styles.saveCard}>
              {quickSaves.map((item, index) => (
                <View key={index} style={styles.saveItem}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={28}
                    color="#059669"
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.saveTitle}>{item.label}</Text>
                    <Text style={styles.saveDesc}>{item.desc}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.saveValue}>
                      £{item.value.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleSave(item.label, item.desc, item.value)
                      }
                    >
                      <Text style={styles.saveBtn}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.customSaveBtn}
              onPress={() => router.push("/save/customSave")}
            >
              <Text style={styles.customSaveText}>＋ Custom Save</Text>
            </TouchableOpacity>

            <Text style={styles.applyTitle}>Apply to Goal</Text>
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>No goals found.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: { fontSize: 20, fontWeight: "600" },
  summaryCard: {
    backgroundColor: "#065F46",
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  label: { color: "#D1FAE5" },
  amount: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  streak: { color: "#FBBF24", marginTop: 8, fontWeight: "500" },
  habits: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  challengeRow: { paddingHorizontal: 16, marginTop: 16 },
  challengeCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 250,
    elevation: 1,
  },
  challengeTitle: { fontWeight: "bold", marginBottom: 4 },
  challengeDesc: { fontSize: 13, color: "#6B7280" },
  challengeProgress: { marginTop: 8, color: "#10B981", fontWeight: "500" },
  saveCard: { paddingHorizontal: 16, marginTop: 16 },
  saveItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  saveTitle: { fontWeight: "600", fontSize: 16 },
  saveDesc: { fontSize: 13, color: "#6B7280" },
  saveValue: { fontWeight: "bold", color: "#111827", fontSize: 15 },
  saveBtn: { color: "#3B82F6", fontWeight: "500" },
  customSaveBtn: {
    backgroundColor: "#065F46",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  customSaveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  applyTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  goalItem: {
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
  },
  empty: {
    marginTop: 20,
    fontStyle: "italic",
    color: "gray",
    textAlign: "center",
  },
  goalOption: {
    borderRadius: 12,
    marginBottom: 8,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "90%", // responsive
    alignSelf: "center",
    backgroundColor: "#fff",
  },

  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  goalText: {
    fontWeight: "500",
    color: "#374151",
    flexShrink: 1, // prevents overflow on long names
  },

  goalTextActive: {
    color: "#fff",
  },
  goalActive: {
    backgroundColor: "#065F46",
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
