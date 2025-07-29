import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { goalImageMap } from "@/components/ActiveGoals/goalsMap";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";


interface GoalTransaction {
  id: string;
  title: string;
  type: string;
  timestamp: number;
  amount: number;
  date: string;
  // Add any other properties you expect
}
interface SavingMethod {
  id: string;
  method: string;
  amount?: number;
}

const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

const methodIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Sacrifice: "wallet-outline",
  RoundUp: "cash-outline",
  DailyPocket: "calendar-outline",
  // fallback: use "help-circle-outline"
};

const groupTransactionsByDate = (transactions: GoalTransaction[]) => {
  return transactions.reduce(
    (acc: Record<string, GoalTransaction[]>, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString("en-GB");
      if (!acc[date]) acc[date] = [];
      acc[date].push(transaction);
      return acc;
    },
    {}
  );
};

const PreviewGoal = () => {
  const { goal } = useLocalSearchParams();
  //goal data fetched from active goal list
  const selectedGoal = goal ? JSON.parse(goal as string) : null;
  // console.log("GoalId", selectedGoal.id);
  // console.log("GoalData", selectedGoal);
  const methods = selectedGoal?.savingMethod
    ?.map((item: { method: any }) => item.method)
    .join("\n ");
  // console.log("Methods:", methods); // This will print the methods of goal

  const imageKey = selectedGoal?.goalImage as keyof typeof goalImageMap;
  const emoji = goalImageMap[imageKey] || "🎯";
  const [transactions, setTransactions] = useState<GoalTransaction[]>([]);

useFocusEffect(
  useCallback(() => {
    const fetchGoalTransactions = async () => {
      const goalId = selectedGoal?.id;
      if (!goalId) return;

      const token = await getAuthToken("user");
      const response = await fetch(`${base_url}/money/all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId }),
      });

      const data = await response.json();
      setTransactions(data.data.data || []);
    };

    fetchGoalTransactions();
  }, [selectedGoal?.id])
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Goal Preview</Text>
      </View>

      {selectedGoal ? (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.goalDetails}>
              {/* Goal Info */}
              <View style={styles.goalDetailsCard}>
                <Text style={styles.goalText}>
                  {emoji} {selectedGoal.goalName}
                </Text>
                <Text>
                  <Text style={styles.labelText}>Days Left: </Text>
                  <Text style={styles.valueText}>
                    {selectedGoal?.daysLeft ?? "-"}
                  </Text>
                </Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${selectedGoal.goalAmount
                            ? Math.min(
                              ((selectedGoal.savedAmount ?? 0) /
                                selectedGoal.goalAmount) *
                              100,
                              100
                            )
                            : 0
                          }%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.goalDetailsAmount}>
                  <Text>
                    <Text style={styles.labelText}>Saved: </Text>
                    <Text style={styles.valueText}>
                      £{selectedGoal.savedAmount.toFixed(2)}
                    </Text>
                  </Text>
                  <Text>
                    <Text style={styles.labelText}>Goal: </Text>
                    <Text style={styles.valueText}>
                      £{selectedGoal.goalAmount.toFixed(2)}
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Saving Methods */}
              <Text style={styles.transactionTitle}>
                Selected Saving Methods
              </Text>
              {(selectedGoal?.savingMethod as SavingMethod[])?.map(
                (item, index) => (
                  <View key={index} style={styles.goalMethodRow}>
                    <Ionicons
                      name={methodIcons[item.method] || "help-circle-outline"}
                      size={18}
                      color="#3BA365"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.goalMethodText}>{item.method}</Text>
                  </View>
                )
              )}

              {/* Transaction History */}
              <Text style={styles.transactionTitle}>Saving History</Text>
              {transactions.length > 0 ? (
                transactions.map((item, index) => (
                  <View key={index} style={styles.transactionItem}>
                    <View style={styles.transactionLeftSide}>
                      <Text style={styles.transactionText}>{item.title}</Text>
                      <Text style={styles.labelText}>
                        {new Date(item.timestamp).toLocaleDateString("en-GB")}
                      </Text>
                    </View>
                    <Text style={styles.transactionAmount}>£{item.amount}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.goalText}>No Saving History found.</Text>
              )}
            </View>
          </ScrollView>

          {/* Fixed bottom actions */}
          <View style={styles.fixedActions}>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.outlinedBtn}>
                <Text>Complete Goal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlinedBtn}
                onPress={() => router.push({
                  pathname: "/previewGoal/deposit",
                  params: { id: selectedGoal.id }
                })}

              >
                <Text>Deposit</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.greenBtn}
              onPress={() => router.push("/(tabs)/save")}
            >
              <Text style={styles.greenBtnText}>Add Savings</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={{ padding: 20 }}>No goal data available.</Text>
      )}
    </SafeAreaView>
  );
};
{
  /* <Text style={styles.labelText}>Time:
                   {new Date(item.timestamp).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text> */
}
export default PreviewGoal;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 180, // enough space so scroll doesn't hide behind fixed buttons
  },
  fixedActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#121417",
  },
  goalDetails: {
    padding: 20,
  },
  goalText: {
    fontSize: 16,
    color: "#121417",
    fontWeight: "600",
    marginBottom: 8,
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 20,
  },
  transactionItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionText: {
    fontSize: 14,
    color: "#121417",
    fontWeight: "500",
  },
  goalDetailsCard: {
    backgroundColor: "#fff",
    height: 130,
    borderRadius: 8,
    justifyContent: "space-between",
    padding: 10,
  },
  goalDetailsAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 14,
    color: "#637587",
    fontWeight: "400",
    fontStyle: "normal",
  },
  valueText: {
    fontSize: 14,
    color: "#121417",
    fontWeight: "400",
    fontStyle: "normal",
  },
  progressBarContainer: {
    width: "100%",
    height: hp(1),
    backgroundColor: "#CDFFDF",
    borderRadius: wp(1),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: wp(1),
    backgroundColor: "#3BA365",
  },
  goalMethodContainer: {
    marginTop: 15,
  },
  goalMethod: {
    height: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: 20,
  },
  transactionLeftSide: {
    gap: 5,
  },
  transactionAmount: {
    fontSize: 16,
    color: "#3BA365",
    fontWeight: "600",
    fontStyle: "normal",
  },
  goalMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  goalMethodText: {
    fontSize: 14,
    color: "#121417",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  outlinedBtn: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  greenBtn: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  greenBtnText: { color: "white", fontWeight: "bold" },
});
