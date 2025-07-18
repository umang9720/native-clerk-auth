import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";
import { SafeAreaView } from "react-native-safe-area-context";

const GoalPreview = () => {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);

  const history = [
    { id: "1", title: "Skip Coffee", date: "Today", amount: 20 },
    { id: "2", title: "Deposit", date: "Today", amount: 10 },
    { id: "3", title: "Public Transport", date: "Yesterday", amount: 20 },
    { id: "4", title: "Deposit", date: "24-06-2025", amount: 40 },
  ];

  const deleteGoal = () => {
    setModalVisible(false);
    // TODO: Call backend delete API
    alert("Goal deleted");
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = await getAuthToken("user");
        const response = await fetch(`${base_url}/goals/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        const activeGoals = Array.isArray(data?.data?.data)
          ? data.data.data.filter((g: any) => g.status === "active").reverse()
          : [];

        setGoals(activeGoals);
        setSelectedGoal(activeGoals[0] ?? null);
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

//   const getProgressPercent = () => {
//     if (!selectedGoal) return "0%";
//     const { savedAmount = 0, goalAmount = 1 } = selectedGoal;
//     const percent = Math.min((savedAmount / goalAmount) * 100, 100);
//     return `${percent}%`;
//   };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.goalTitle}>
            {selectedGoal ? selectedGoal.goalName : "Loading..."}
          </Text>
          <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
            <Icon name="ellipsis-vertical" size={24} />
          </TouchableOpacity>
          {showOptions && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.optionBox}
            >
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Goal Info */}
        {selectedGoal && (
          <>
            <Text style={styles.onTrack}>✔️ On Track</Text>
            <Text style={styles.daysLeft}>
              Days Left: {selectedGoal.daysLeft ?? "..."}
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, ]}
              />
            </View>

            <Text>Saved: £{selectedGoal.savedAmount ?? 0}</Text>
            <Text>Goal: £{selectedGoal.goalAmount ?? 0}</Text>

            {/* Saving Methods */}
            <Text style={styles.sectionTitle}>Selected Saving Methods</Text>
            <View style={styles.method}>
              <Text>💰 Sacrifice & Save</Text>
            </View>
            <View style={styles.method}>
              <Text>🪙 Daily Pocket Change</Text>
            </View>
          </>
        )}

        {/* History */}
        <Text style={styles.sectionTitle}>Saving History</Text>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text>{item.title}</Text>
              <Text style={{ fontWeight: "bold" }}>£{item.amount}</Text>
            </View>
          )}
        />

        {/* Actions */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlinedBtn}>
            <Text>Complete Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlinedBtn}
            onPress={() => router.push("/previewGoal/deposit")}
          >
            <Text>Deposit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.greenBtn}
          onPress={() => router.push("/previewGoal/withdraw")}
        >
          <Text style={styles.greenBtnText}>Withdraw</Text>
        </TouchableOpacity>

        {/* Delete Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                You are going to delete your Goal.
              </Text>
              <Text style={{ marginVertical: 10, color: "gray" }}>
                You won’t be able to restore your data
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={deleteGoal}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default GoalPreview;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: { fontSize: 22, fontWeight: "bold" },
  onTrack: { color: "green", marginVertical: 5 },
  daysLeft: { fontSize: 16, marginBottom: 10 },
  progressBar: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginVertical: 8,
  },
  progressFill: {
    backgroundColor: "green",
    height: 8,
    borderRadius: 5,
  },
  sectionTitle: { marginTop: 20, fontWeight: "bold", fontSize: 16 },
  method: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    marginVertical: 5,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
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
  optionBox: {
    position: "absolute",
    right: 10,
    top: 40,
    backgroundColor: "white",
    padding: 10,
    elevation: 5,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 6,
  },
});
