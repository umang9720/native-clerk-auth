import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { goalImageMap } from "@/components/ActiveGoals/goalsMap";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";

interface GoalTransaction {
  id: string;
  title: string;
  type: string;
  timestamp: number;
  amount: number;
  date: string;
  // Add any other properties you expect
}

const PreviewGoal = () => {
  const { goal } = useLocalSearchParams();
  //goal data fetched from active goal list
  const selectedGoal = goal ? JSON.parse(goal as string) : null;
  // console.log("GoalId", selectedGoal.id);
  // console.log("GoalData", selectedGoal);

  const imageKey = selectedGoal?.goalImage as keyof typeof goalImageMap;
  const emoji = goalImageMap[imageKey] || "🎯";
  const [transactions, setTransactions] = useState<GoalTransaction[]>([]);

  useEffect(() => {
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
      // console.log("GoalTransactions", data.data.data);  //console the transaction data of the goal
      setTransactions(data.data.data || []);
    };

    fetchGoalTransactions();
  }, [selectedGoal?.id]); // dependency array

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Goal Preview</Text>
      </View>

      {selectedGoal ? (
        <View style={styles.goalDetails}>
          <Text style={styles.goalText}>
            {emoji} {selectedGoal.goalName}
          </Text>
          <Text style={styles.goalText}>
            Target: £{selectedGoal.goalAmount.toFixed(2)}
          </Text>
          <Text style={styles.goalText}>
            Saved: £{selectedGoal.savedAmount.toFixed(2)}
          </Text>
          <Text style={styles.goalText}>
            Days Left: {selectedGoal.daysLeft ?? "-"}
          </Text>
          <Text style={styles.goalText}>
            Progress:{" "}
            {Math.round(
              (selectedGoal.savedAmount / selectedGoal.goalAmount) * 100
            )}
            %
          </Text>
          <Text style={styles.goalText}></Text>
          <Text style={styles.transactionTitle}>Transactions:</Text>
          {transactions.length > 0 ? (
            <ScrollView style={styles.transactionContainer}>
              {transactions.map((item, index) => (
                <View key={index} style={styles.transactionItem}>
                  <Text style={styles.transactionText}>Type: {item.title}</Text>
                  <Text style={styles.transactionText}>Type: {item.type}</Text>
                  <Text style={styles.transactionText}>
                    Amount: £{item.amount}
                  </Text>
                  <Text style={styles.transactionText}>
                    {new Date(item.timestamp).toLocaleDateString("en-GB")}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.goalText}>No transactions found.</Text>
          )}
        </View>
      ) : (
        <Text style={{ padding: 20 }}>No goal data available.</Text>
      )}
    </SafeAreaView>
  );
};

export default PreviewGoal;

const styles = StyleSheet.create({
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
    marginBottom: 8,
  },
  transactionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  transactionItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  transactionText: {
    fontSize: 14,
    color: "#333",
  },
});
