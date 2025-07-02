import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function SmartSavings() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Savings</Text>
        <TouchableOpacity  onPress={() => router.push("/save/drawer")}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        style={styles.scroll}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.label}>Today&apos;s Saving</Text>
              <Text style={styles.amount}>£13.00</Text>
            </View>
            <View>
              <Text style={styles.label}>This Week</Text>
              <Text style={styles.amount}>£40.00</Text>
            </View>
          </View>
          <Text style={styles.streak}>🔥 3 Days Saving Streak</Text>

          {/* Habit Circles */}
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
            <Text style={styles.challengeTitle}>📉 No takeout Week</Text>
            <Text style={styles.challengeDesc}>Track habits & hit goals.</Text>
            <Text style={styles.challengeProgress}>2/5</Text>
          </View>
        </ScrollView>

        {/* Quick Saves */}
        <View style={styles.saveCard}>
          {[
            {
              icon: "coffee",
              label: "Skip Coffee",
              desc: "Made Coffee at home",
              value: "£4.50",
            },
            {
              icon: "hamburger",
              label: "Bring Lunch",
              desc: "Packed lunch from home",
              value: "£9.50",
            },
            {
              icon: "walk",
              label: "Walk Instead",
              desc: "Walked instead of rideshare",
              value: "£8.75",
            },
          ].map((item, index) => (
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
                <Text style={styles.saveValue}>{item.value}</Text>
                <TouchableOpacity>
                  <Text style={styles.saveBtn}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Custom Save Button */}
        <TouchableOpacity style={styles.customSaveBtn}>
          <Text style={styles.customSaveText}>＋ Custom Save</Text>
        </TouchableOpacity>

        {/* Apply to Goal */}
        <View style={styles.applyGoal}>
          <Text style={styles.applyTitle}>Apply to Goal</Text>
          {["Vacation", "New Car", "Emergency Fund"].map((goal, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.goalOption, idx === 0 && styles.goalActive]}
            >
              <Text
                style={[styles.goalText, idx === 0 && styles.goalTextActive]}
              >
                {goal}
              </Text>
              {idx === 0 ? (
                <FontAwesome name="check-circle" size={20} color="#fff" />
              ) : (
                <FontAwesome name="circle-thin" size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  scroll: {
    backgroundColor: "#F9FAFB",
  },
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

  applyGoal: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  applyTitle: { fontWeight: "600", fontSize: 16, marginBottom: 8 },
  goalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  goalActive: {
    backgroundColor: "#065F46",
  },
  goalText: { fontWeight: "500", color: "#374151" },
  goalTextActive: { color: "#fff" },
});
