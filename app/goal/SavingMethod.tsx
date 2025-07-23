import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";

const SavingMethod = () => {
  const { goalId } = useLocalSearchParams();
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [roundUpAmount, setRoundUpAmount] = useState("£1");
  const [showRoundUpOptions, setShowRoundUpOptions] = useState(false);
  const [dailyPocketAmount, setDailyPocketAmount] = useState(1.5);

  const methods = [
    {
      key: "Sacrifice",
      title: "Sacrifice & Save",
      description: "Skip Coffee, save 5 pounds",
      icon: "wallet-outline",
    },
    {
      key: "RoundUp",
      title: "Round-Up",
      description: "Round up purchases to the nearest pound and save the difference",
      icon: "cash-outline",
    },
    {
      key: "DailyPocket",
      title: "Daily Pocket Change",
      description: "Automatic small saving toward specific goal",
      icon: "calendar-outline",
    },
  ];

  const roundUpOptions = [
    "£1 (e.g. £3.75 → £4.00 save £0.25)",
    "£5 (e.g. £3.75 → £4.00, saving £0.25)",
    "£10 (e.g. £3.75 → £4.00, saving £0.25)",
  ];

  const toggleMethod = (method: string) => {
    setSelectedMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  };

  const handleContinue = async () => {
    const token = await getAuthToken("user");

    // Validation
    if (selectedMethods.includes("DailyPocket") && dailyPocketAmount === 0) {
      Alert.alert("Error", "Daily Pocket Change cannot be 0.");
      return;
    }

    const savingMethod = selectedMethods.map((method) => {
      if (method === "Sacrifice") {
        return { method};
      } else if (method === "RoundUp") {
        return { method, amount: parseInt(roundUpAmount.replace("£", "")) };
      } else if (method === "DailyPocket") {
        return { method, amount: dailyPocketAmount };
      }
    });

    const response = await fetch(`${base_url}/update/goal`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goalId,
        savingMethod,
      }),
    });

    if (response.ok) {
      router.push("/bank/ConnectBankPage");
    } else {
      console.log("Failed to update goal. Status:", response.status);
      const error = await response.json();
      console.log("Error body:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Saving Method</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.heading}>How do you want to save?</Text>

        {methods.map((method) => (
          <View key={method.key}>
            <TouchableOpacity
              style={[
                styles.card,
                selectedMethods.includes(method.key) && styles.cardSelected,
              ]}
              onPress={() => toggleMethod(method.key)}
            >
              <Ionicons
                name={method.icon as any}
                size={24}
                color={selectedMethods.includes(method.key) ? "#10B981" : "#6B7280"}
                style={{ marginRight: 10 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{method.title}</Text>
                <Text style={styles.cardDescription}>{method.description}</Text>
              </View>

              {selectedMethods.includes(method.key) && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>

            {/* Show Round-Up Dropdown */}
            {method.key === "RoundUp" &&
              selectedMethods.includes("RoundUp") && (
                <TouchableOpacity
                  style={styles.dropdownBox}
                  onPress={() => setShowRoundUpOptions(true)}
                >
                  <Text>{roundUpAmount}</Text>
                  <Ionicons name="chevron-down" size={20} />
                </TouchableOpacity>
              )}

            {/* Show Daily Pocket Slider */}
            {method.key === "DailyPocket" &&
              selectedMethods.includes("DailyPocket") && (
                <View style={styles.sliderWrapper}>
                  <Text>£0</Text>
                  <Slider
                    style={{ flex: 1, marginHorizontal: 10 }}
                    minimumValue={0}
                    maximumValue={10}
                    step={0.5}
                    value={dailyPocketAmount}
                    onValueChange={setDailyPocketAmount}
                    minimumTrackTintColor="#10B981"
                    maximumTrackTintColor="#E5E7EB"
                    thumbTintColor="#10B981"
                  />
                  <Text>£10</Text>
                  <Text style={{ marginTop: 5, textAlign: "center" }}>
                    Selected: £{dailyPocketAmount.toFixed(2)}
                  </Text>
                </View>
              )}
          </View>
        ))}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Round Up Modal */}
      <Modal visible={showRoundUpOptions} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowRoundUpOptions(false)}
        >
          <View style={styles.modalBox}>
            <FlatList
              data={roundUpOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setRoundUpAmount(item.split(" ")[0]);
                    setShowRoundUpOptions(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SavingMethod;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
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
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  cardSelected: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginHorizontal: 2,
    backgroundColor: "#fff",
  },
  sliderWrapper: {
    marginVertical: 12,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: "#10B981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
