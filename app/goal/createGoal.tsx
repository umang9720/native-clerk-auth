import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";

const { width } = Dimensions.get("window");
const cardSize = width * 0.25; // roughly 25% of screen width

const CreateGoal = () => {
  const [selectedType, setSelectedType] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [durationInDate, setDurationInDate] = useState("");

  const endpoint = "/create/goal";

  const goalTypes = [
    { type: "trip", emoji: "🧳", label: "Trip", image: "trip.jpg" },
    { type: "laptop", emoji: "💻", label: "Laptop", image: "laptop.jpg" },
    {
      type: "college fee",
      emoji: "🎓",
      label: "College Fee",
      image: "college-fee.jpg",
    },
    { type: "game", emoji: "🎮", label: "Game", image: "game.jpg" },
    {
      type: "future savings",
      emoji: "💰",
      label: "Future Savings",
      image: "future.jpg",
    },
    {
      type: "emergency funds",
      emoji: "🛡️",
      label: "Emergency Funds",
      image: "emergency.jpg",
    },
    {
      type: "electronics",
      emoji: "📱",
      label: "Electronics",
      image: "electronics.jpg",
    },
    {
      type: "accessories",
      emoji: "👜",
      label: "Accessories",
      image: "accessories.jpg",
    },
  ];

const getFutureDate = (days: string): string => {
  const today = new Date();
  const dayCount = parseInt(days, 10);
  const futureDate = new Date(today.setDate(today.getDate() + dayCount));

  const day = futureDate.getDate().toString().padStart(2, "0");
  const month = (futureDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const year = futureDate.getFullYear();

  return `${day}-${month}-${year}`;
};

// console.log(getFutureDate)
  const handleCreateGoal = async () => {
    if (!goalName || !goalAmount || !durationInDate || !selectedType) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const selectedGoal = goalTypes.find((g) => g.type === selectedType);
    const goalImage = selectedGoal?.image || "default.jpg";
    const token = await getAuthToken();

    const response = await fetch(`${base_url}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  goalImage,
  goalName,
  goalAmount: parseFloat(goalAmount),
  durationInDate: getFutureDate(durationInDate), // returns "dd/mm/yyyy"
  reward: {
    name: "Laptop Bag",
    description: "Get a stylish laptop bag on goal completion.",
    imageUrl: "laptop-bag.jpg",
  },
}),
    });
    console.log(goalName);
    console.log(goalAmount);
    console.log(durationInDate);
    console.log(goalImage);

    const data = await response.json();
    console.log("Response status:", response.status); //for checking response status
    console.log("Response body:", data); //for checking response body
    if (response.status === 201) {
      Alert.alert("Success", "Goal created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", "Failed to create goal");
      console.log("❌ Goal creation failed:", response);
      console.log("❌ Goal creation failed:", data);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>All Challenge</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Goal Images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.goalRow}
        >
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
          <View style={{ marginBottom: 10 }}>
            <Text>Goal Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal Name"
              value={goalName}
              onChangeText={setGoalName}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text>Goal Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal Amount (£)"
              value={goalAmount}
              onChangeText={setGoalAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.durationContainer}>
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
            {/* <TouchableOpacity
      style={[
        styles.durationButton,
        durationInDate === "custom" && styles.durationButtonSelected,
      ]}
      onPress={() => {
        // You may integrate a date picker modal here
        const customDays = 40; // Replace with real calculation
        setDurationDay(customDays.toString());
      }}
    >
      <Text
        style={[
          styles.durationText,
          durationInDate === "custom" && styles.durationTextSelected,
        ]}
      >
        Custom Date
      </Text>
    </TouchableOpacity> */}
          </View>

          {/* Daily Amount Info */}
          {goalAmount && durationInDate && (
            <View style={styles.greenBox}>
              <Text style={styles.greenBoxText}>
                Daily Savings Amount{" "}
                <Text style={styles.greenBoxHighlight}>
                  £
                  {(parseFloat(goalAmount) / parseInt(durationInDate)).toFixed(
                    2
                  )}
                </Text>{" "}
                to reach{" "}
                <Text style={styles.greenBoxHighlight}>£{goalAmount}</Text> in{" "}
                {durationInDate} days.
              </Text>
            </View>
          )}
        </View>

        {/* Reward Partner */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Reward Partner (Optional)</Text>
          <TouchableOpacity style={styles.rewardCard}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardTitle}>Booking.com</Text>
              <Text style={styles.rewardDescription}>
                10% off on your first booking.
              </Text>
            </View>
            <Image
              source={require("@/assets/images/hotel.png")}
              style={styles.rewardImage}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rewardCard}>
            <Ionicons name="ellipse-outline" size={20} color="#9CA3AF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardTitle}>Travel Bag</Text>
              <Text style={styles.rewardDescription}>
                10€ off Travel Bag of American.
              </Text>
            </View>
            <Image
              source={require("@/assets/images/bag.png")}
              style={styles.rewardImage}
            />
          </TouchableOpacity>
        </View>

        {/* Create Goal Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGoal}
        >
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateGoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    paddingLeft: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
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
});
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
