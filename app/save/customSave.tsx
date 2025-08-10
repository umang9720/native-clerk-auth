import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/utils/authToken";
import { base_url } from "@/config/url";

// Get device width for responsive sizing
const { width } = Dimensions.get("window");

type Goal = {
  id: string;
  goalName: string;
};

export default function SmartSavings() {
  const router = useRouter();
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [noteName, setNoteName] = useState("");
  const [noteAmount, setNoteAmount] = useState("");
  const [note, setNote] = useState("");

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

        const result = await response.json();
        const goalsData: Goal[] = result?.data?.data || [];
        setGoals(goalsData);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const handleSave = async () => {
    if (!selectedGoalId) {
      alert("Please select a goal to save to.");
      return;
    }

    const amount = parseFloat(noteAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const token = await getAuthToken("user");
    await createSave(token, selectedGoalId, noteName, note, amount);
  };

  const createSave = async (
    token: string | null,
    goalId: string,
    noteName: string,
    note: string,
    noteAmount: number
  ) => {
    try {
      const response = await fetch(`${base_url}/create/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId,
          title: noteName,
          description: note,
          amount: noteAmount,
        }),
      });
      const result = await response.json();
      alert("Save created successfully!");
      setNoteName("");
      setNote("");
      setNoteAmount("");
      setSelectedGoalId(null);
    } catch (error) {
      console.error("Error creating save:", error);
    }
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <TouchableOpacity
      style={[
        styles.goalOption,
        selectedGoalId === item.id && styles.goalActive,
      ]}
      onPress={() => setSelectedGoalId(item.id)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", }}>
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
            selectedGoalId === item.id
              ? "radio-button-on"
              : "radio-button-off"
          }
          size={20}
          color={selectedGoalId === item.id ? "#fff" : "#6B7280"}
          style={{ marginLeft: "70%" }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push("/(tabs)/save")}>
              <Ionicons name="close" size={28} />
            </TouchableOpacity>
            <Text style={styles.title}>Custom Save</Text>
          </View>

          {/* Inputs */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="What did you sacrifice today?"
              value={noteName}
              onChangeText={setNoteName}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={noteAmount}
              onChangeText={setNoteAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.noteInput}
              placeholder="Note"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>

          {/* Goals */}
          <Text style={styles.applyTitle}>Apply to Goal</Text>
          <FlatList
            data={goals}
            keyExtractor={(item) => item.id}
            renderItem={renderGoal}
             ListEmptyComponent={<Text style={styles.empty}>No goals found.</Text>}
                     contentContainerStyle={{ paddingBottom: 15, backgroundColor:"#FFFFFF", marginTop:10, alignSelf:"center", width:360, borderRadius:8,
                        paddingTop:15,
                      }}
            scrollEnabled={false}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.customSaveBtn} onPress={handleSave}>
            <Text style={styles.customSaveText}>Add Savings</Text>
          </TouchableOpacity>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#121417",
  },
  inputWrapper: {
    width: 360,
    height: 310,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 8,
  },
  input: {
    width: 320,
    height: 56,
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    padding: 15,
  },
   noteInput: {
    width: 320,
    height: 126,
    backgroundColor: "#F0F2F5",
    borderRadius: 12,
    paddingTop: 15,
    paddingLeft:15,
    paddingBottom:80,
    fontSize: 16,
  },
  applyTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 16,
    marginTop: 16,
  },
  goalItem: {
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
  },
  goalText: { fontWeight: "500", color: "#374151" },
  empty: {
    marginTop: 20,
    fontStyle: "italic",
    color: "gray",
    textAlign: "center",
  },
  goalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    width: 330,
  },
  goalActive: {
    backgroundColor: "#065F46",
  },
  goalTextActive: { color: "#fff" },
  customSaveBtn: {
    backgroundColor: "#065F46",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  customSaveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
