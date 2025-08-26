import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Button,
  InteractionManager,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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
  const insets = useSafeAreaInsets();

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
  const [modalVisible, setModalVisible] = useState(false);

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

  // delete goal
  const deleteGoal = async () => {
    const goalId = selectedGoal?.id;
    if (!goalId) return;

    try {
      const token = await getAuthToken("user");

      const response = await fetch(`${base_url}/goal/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId }),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      // ✅ success condition adjusted for your API
      if (response.ok && (data?.success || data?.data?.code === 1)) {
        Toast.show({
          type: "success",
          text1: data?.data?.message || "Goal deleted successfully",
          visibilityTime: 1500,
        });

        setTimeout(() => {
          router.replace("/(tabs)");
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: data?.data?.message || "Failed to delete goal",
          visibilityTime: 2000,
        });
        console.warn("Delete failed:", data);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error deleting goal",
        text2: error instanceof Error ? error.message : String(error),
        visibilityTime: 2000,
      });
      console.error("Error deleting goal:", error);
    }
  };

  // ✅ Complete Goal
  const completeGoal = async () => {
    const goalId = selectedGoal?.id;
    if (!goalId) return;

    try {
      const token = await getAuthToken("user");

      const response = await fetch(`${base_url}/update/goal`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId,
          status: "complete",
        }),
      });
      console.log(goalId);
      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : { raw: await response.text() }; // fallback for HTML response

      if (response.ok && (data?.success || data?.data?.code === 1)) {
        Toast.show({
          type: "success",
          text1: data?.message || "Goal marked as complete",
          visibilityTime: 1500,
        });

        setTimeout(() => {
          router.push("/(tabs)");
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: data?.message || "Failed to complete goal",
          visibilityTime: 2000,
        });
        console.warn("Complete failed:", data);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error completing goal",
        text2: error instanceof Error ? error.message : String(error),
        visibilityTime: 2000,
      });
      console.error("Error completing goal:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} />
          </TouchableOpacity>
          <Text style={styles.title}>Goal Preview</Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="ellipsis-vertical-sharp" size={24} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <View style={styles.modalAlertCircle}>
              <Ionicons name="alert-circle" size={28} color={"#3BA365"} />
            </View>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              You are going to delete your Goal.
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "rgba(99, 117, 135, 1)",
              }}
            >
              You won't be able to restore your data
            </Text>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCancelBtn}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                deleteGoal();
                setModalVisible(false);
              }}
              style={styles.modalDeleteBtn}
            >
              <Text style={styles.modalBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
                        width: `${
                          selectedGoal.goalAmount
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
          {selectedGoal?.status !== "pause" &&
            selectedGoal?.status !== "complete" && (
              <View
                style={[
                  styles.fixedActions,
                  { paddingBottom: insets.bottom + 16 },
                ]}
              >
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.outlinedBtn}
                    onPress={completeGoal}
                  >
                    <Text>Complete Goal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.outlinedBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/previewGoal/deposit",
                        params: { id: selectedGoal.id },
                      })
                    }
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
            )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  modalView: {
    width: width * 0.9,
    maxWidth: 400,
    alignSelf: "center",
    top: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(227, 224, 197, 1)",
    borderRadius: 20,
    padding: 20,
  },

  modalAlertCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#CDFFDF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#202020",
    justifyContent: "center",
    alignItems: "center",
  },

  modalDeleteBtn: {
    flex: 1,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#3BA365",
    justifyContent: "center",
    alignItems: "center",
  },

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%", // or "100%" if you want full width
    alignSelf: "center",
    gap: 10, // optional spacing between buttons (React Native 0.71+)
  },

  modalHeader: {
    width: 270,
    height: 100,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 40,
  },
});
