import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  InteractionManager,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getAuthToken } from "@/utils/authToken";
import { base_url } from "@/config/url";
import { fetchActiveGoals } from "@/utils/activeGoals";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

const DepositScreen = () => {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  useEffect(() => {
    const fetchAndSet = async () => {
      const { activeGoals, selectedGoal, selectedGoalId } =
        await fetchActiveGoals();

      setGoals(activeGoals);
      setSelectedGoal(selectedGoal);
      setSelectedGoalId(selectedGoalId);

      console.log("✅ Selected Goal:", selectedGoal);
      console.log("✅ Selected Goal ID:", selectedGoalId);
    };

    fetchAndSet();
  }, []);

  // console.log("Selected goal:", selectedGoal);
  // console.log("Selected goal ID:", selectedGoalId);

  const handleDeposit = async () => {
    try {
      const token = await getAuthToken("user");

      const res = await fetch(`${base_url}/money/deposit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId: selectedGoalId,
          type: "deposit",
          title,
          amount: parseFloat(amount),
          description: note,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Deposit success", json);
        // Show toast or navigate back
        Toast.show({
          type: "success",
          text1: "Successfully Deposited",
          visibilityTime: 1000, // ⏱ Show for 1 second
        });

        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            router.push("/(tabs)");
          }, 1200);
        });
      } else {
        console.warn("Deposit failed:", json?.message || "Unknown error");
        Toast.show({
          type: "error",
          text1: "Unsuccessfully Deposited",
          visibilityTime: 1000, // ⏱ Show for 1 second
        });

        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            router.push("/(tabs)");
          }, 1200);
        });
      }
    } catch (error) {
      console.error("Error in deposit:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = await getAuthToken("user");

      const res = await fetch(`${base_url}/money/withdraw`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId: selectedGoalId,
          title,
          type: "withdraw",
          amount: parseFloat(amount),
          description: note,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        console.log("Withdraw success", json);
        Toast.show({
          type: "success",
          text1: "Successfully Withdrawn",
          visibilityTime: 1000, // ⏱ Show for 1 second
        });

        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            router.push("/(tabs)");
          }, 1200);
        });
      } else {
        console.warn("Withdraw failed:", json?.message || "Unknown error");
        Toast.show({
          type: "error",
          text1: "Unsuccessfully Withdrawn",
          visibilityTime: 1000, // ⏱ Show for 1 second
        });

        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            router.push("/(tabs)");
          }, 1200);
        });
      }
    } catch (error) {
      console.error("Error in withdraw:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Deposit</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.goalTitle}>New York Trip</Text>
        <Text style={styles.goalProgress}>£300 at £800</Text>

        {/* Switch Tabs */}
        <View style={styles.switchTabs}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              mode === "deposit" && styles.tabActiveGreen,
            ]}
            onPress={() => setMode("deposit")}
          >
            <Text
              style={[
                styles.tabText,
                mode === "deposit" && styles.tabTextActiveGreen,
              ]}
            >
              + Add Money
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              mode === "withdraw" && styles.tabActiveRed,
            ]}
            onPress={() => setMode("withdraw")}
          >
            <Text
              style={[
                styles.tabText,
                mode === "withdraw" && styles.tabTextActiveRed,
              ]}
            >
              - Withdraw Money
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput
          placeholder={
            mode === "deposit"
              ? "Title e.g. Hustle Pay, Spare Cash, Bonus Income"
              : "Title e.g. Emergency, Party"
          }
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Amount Ex: £40"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />

        <TextInput
          placeholder={
            mode === "deposit" ? "Note e.g. Took additional job" : "Note"
          }
          style={[styles.input, { height: 80 }]}
          multiline
          value={note}
          onChangeText={setNote}
        />

        {/* Account Section */}
        <View style={styles.accountBox}>
          <View>
            <Text style={styles.accountLabel}>Account</Text>
            <Text style={styles.accountValue}>Atlas Prime ****8415</Text>
          </View>
          <TouchableOpacity onPress={() => console.log("Change account")}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity
        style={[
          styles.bottomButton,
          { backgroundColor: mode === "deposit" ? "#10B981" : "#EF4444" },
        ]}
        onPress={() => {
          if (mode === "deposit") {
            handleDeposit();
          } else {
            handleWithdraw();
          }
        }}
      >
        <Text style={styles.bottomButtonText}>
          {mode === "deposit" ? "Deposit" : "Withdraw"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DepositScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#121417",
  },
  content: {
    padding: 20,
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  goalProgress: {
    textAlign: "center",
    marginBottom: 16,
    color: "#6B7280",
  },
  switchTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    padding: 4,
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
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    marginBottom: 12,
  },
  accountBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  accountLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  accountValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  bottomButton: {
    margin: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
function setGoals(activeGoals: any) {
  throw new Error("Function not implemented.");
}
