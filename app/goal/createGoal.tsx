import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuthToken } from "@/utils/authToken";
import { base_url } from "@/config/url";

const { width } = Dimensions.get("window");
const cardSize = width * 0.25;

const CreateGoal = () => {
  const [selectedType, setSelectedType] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [durationInDate, setDurationInDate] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const goalTypes = [
    { type: "trip", emoji: "🧳", label: "Trip", image: "trip.jpg" },
    { type: "laptop", emoji: "💻", label: "Laptop", image: "laptop.jpg" },
    { type: "college fee", emoji: "🎓", label: "College Fee", image: "college.jpg" },
    { type: "game", emoji: "🎮", label: "Game", image: "game.jpg" },
    { type: "future savings", emoji: "💰", label: "Future Savings", image: "future.jpg" },
    { type: "emergency funds", emoji: "🛡️", label: "Emergency Funds", image: "emergency.jpg" },
    { type: "electronics", emoji: "📱", label: "Electronics", image: "electronics.jpg" },
    { type: "accessories", emoji: "👜", label: "Accessories", image: "accessories.jpg" },
  ];

  const getFutureDate = (days: string): string => {
    const today = new Date();
    const dayCount = parseInt(days, 10);
    const futureDate = new Date(today.setDate(today.getDate() + dayCount));
    const dayStr = futureDate.getDate().toString().padStart(2, "0");
    const monthStr = (futureDate.getMonth() + 1).toString().padStart(2, "0");
    const year = futureDate.getFullYear();
    return `${dayStr}-${monthStr}-${year}`;
  };

  const handleCreateGoal = async () => {
    if (!goalName || !goalAmount || !durationInDate || !selectedType) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const selectedGoal = goalTypes.find((g) => g.type === selectedType);
    const goalImage = selectedGoal?.image || "default.jpg";
    const token = await getAuthToken();

    const response = await fetch(`${base_url}/create/goal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goalImage,
        goalName,
        goalAmount: parseFloat(goalAmount),
        durationInDate: getFutureDate(durationInDate),
        reward: {
          name: "Laptop Bag",
          description: "Get a stylish laptop bag on goal completion.",
          imageUrl: "laptop-bag.jpg",
        },
      }),
    });

    const data = await response.json();
    if (response.status === 201 && data?.data?.id) {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push({ pathname: "/goal/SavingMethod", params: { goalId: data.data.id } });
      }, 3000);
    } else {
      Alert.alert("Error", "Failed to create goal");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Goal</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.goalRow}>
          {goalTypes.map((goal) => (
            <TouchableOpacity
              key={goal.type}
              style={[
                styles.goalTypeButton,
                selectedType === goal.type && styles.goalTypeSelected,
              ]}
              onPress={() => setSelectedType(goal.type)}
            >
              <Text style={styles.goalTypeEmoji}>{goal.emoji}</Text>
              <Text style={styles.goalTypeLabel}>{goal.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <Text>Goal Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Europe Trip"
            value={goalName}
            onChangeText={setGoalName}
          />
          <Text>Goal Amount (£)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 200"
            value={goalAmount}
            onChangeText={setGoalAmount}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.durationButtons}>
          {["5", "15", "30"].map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.durationButton,
                durationInDate === day && styles.durationButtonSelected,
              ]}
              onPress={() => setDurationInDate(day)}
            >
              <Text
                style={[
                  styles.durationText,
                  durationInDate === day && styles.durationTextSelected,
                ]}
              >
                {day} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {goalAmount && durationInDate && (
          <View style={styles.greenBox}>
            <Text style={styles.greenBoxText}>
              Daily Savings Amount{" "}
              <Text style={styles.greenBoxHighlight}>
                £{(parseFloat(goalAmount) / parseInt(durationInDate)).toFixed(2)}
              </Text>{" "}
              to reach £{goalAmount} in {durationInDate} days.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.createButton} onPress={handleCreateGoal}>
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>

      {showSuccessModal && (
        <View style={styles.successOverlay}>
          <View style={styles.successPopup}>
            <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            <Text style={styles.successTitle}>You did it!</Text>
            <Text style={styles.successSubtitle}>You&apos;ve created your goal.</Text>
            <Text style={{ marginTop: 10 }}>Redirecting in 3 sec...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateGoal;

// ...Styles remain unchanged but include `successOverlay` and `successPopup` as provided earlier


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: "#F0F2F5",
  },
  goalRow: {
    paddingTop: 10,
  },
  goalTypeButton: {
    width: cardSize,
    height: cardSize + 10,
    marginRight: 12,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#fff",
  },

  goalTypeSelected: {
    backgroundColor: "#CDFFDF",
    borderWidth: 2,
    borderColor: "083623",
  },
  goalTypeEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  goalTypeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1825",
    textAlign: "center",
  },
  inputContainer: {
    width: 340,
    height: 200,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#FFEAE9",
    borderRadius: 10,
    width: width * 0.8,
    padding: 12,
    marginTop: 15,
  },
  durationContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  durationButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-around",
  },
  durationButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  durationButtonSelected: {
    backgroundColor: "#083623",
  },
  durationText: {
    color: "#1F2937",
    fontWeight: "500",
  },
  durationTextSelected: {
    color: "#fff",
  },

  greenBox: {
    backgroundColor: "#D1FAE5",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  greenBoxText: {
    color: "#065F46",
  },
  greenBoxHighlight: {
    fontWeight: "700",
  },

  rewardsSection: {
    marginTop: 24,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  rewardTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  rewardDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  rewardImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginLeft: 10,
  },

  createButton: {
    backgroundColor: "#10B981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  successOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},
successPopup: {
  backgroundColor: "#fff",
  padding: 30,
  borderRadius: 12,
  alignItems: "center",
  width: "80%",
},
successTitle: {
  fontSize: 22,
  fontWeight: "bold",
  marginTop: 10,
},
successSubtitle: {
  fontSize: 16,
  color: "#6B7280",
  marginTop: 5,
  textAlign: "center",
},

});

