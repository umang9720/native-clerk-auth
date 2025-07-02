import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.headerLeft}>
          <Image
            source={require("@/assets/images/splash_icon.png")}
            style={styles.headerLeftIcon}
          />
          <Text style={styles.headerText}>GoodBreach</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications-none" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.walletIcon]}>
            <MaterialIcons
              name="account-balance-wallet"
              size={20}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/profile/profile")}>
            <MaterialIcons name="account-circle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {/* Savings Card */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <View>
              <Text style={styles.cardLabel}>Today&apos;s Saving</Text>
              <Text style={styles.cardAmount}>£13.00</Text>
              <Text style={styles.cardQuote}>
                “Your habits are creating financial freedom.”
              </Text>
            </View>
            <Text style={styles.streak}>🔥 3 Days</Text>
          </View>

          {/* Habit Icons */}
          <View style={styles.habitRow}>
            {"🟢🟢🟢🟢🟢🔴🟢".split("").map((circle, idx) => (
              <Text key={idx} style={{ fontSize: 18 }}>
                {circle}
              </Text>
            ))}
          </View>
        </View>

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>

          <View style={styles.goalsRow}>
            {[
              {
                title: "Spain Trip",
                daysLeft: 47,
                saved: "£200",
                target: "£400",
              },
              {
                title: "Medical Emergency",
                daysLeft: 32,
                saved: "£300",
                target: "£600",
              },
            ].map((goal, idx) => (
              <View key={idx} style={styles.goalCard}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDetail}>
                  Days Left: <Text style={styles.bold}>{goal.daysLeft}</Text>
                </Text>
                <Text style={styles.goalDetail}>
                  Saved: <Text style={styles.bold}>{goal.saved}</Text>
                </Text>
                <Text style={styles.goalDetail}>
                  Target: <Text style={styles.bold}>{goal.target}</Text>
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Active Challenges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <TouchableOpacity
              onPress={() => router.push("/dashboard/activeChallenges")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.challengeRow}>
            {[
              {
                title: "🥗 No takeout Week",
                desc: "Ditch delivery for a week and save more.",
                progress: "3/5",
                save: "£40",
              },
              {
                title: "📉 No takeout Week",
                desc: "Track daily habits & hit your goal.",
                progress: "2/5",
                save: "£20",
              },
            ].map((item, idx) => (
              <View key={idx} style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDesc}>{item.desc}</Text>
                <Text style={styles.challengeProgress}>
                  {item.progress} • Save: {item.save}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Your Impact */}
        <View style={styles.impactCard}>
          <View style={styles.impactTop}>
            <View>
              <Text style={styles.impactAmount}>£1,605</Text>
              <Text style={styles.impactLabel}>Potential yearly savings</Text>
            </View>
            <View>
              <Text style={styles.impactPercent}>68%</Text>
              <Text style={styles.impactLabel}>Success rate</Text>
            </View>
          </View>

          <View style={styles.impactList}>
            <Text>✅ Avoided 18 sugary drinks</Text>
            <Text>✅ Added 5,000+ steps weekly</Text>
            <Text>✅ Reduced caffeine by 20%</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor:"#fff",
  },
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  headerText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  walletIcon: {
    backgroundColor: "#DBFFE9",
  },
  savingsCard: {
    backgroundColor: "#024b2f",
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  savingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLabel: {
    color: "#C0EFC0",
    fontSize: 14,
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardQuote: {
    color: "#C0EFC0",
    fontSize: 12,
    marginTop: 4,
    maxWidth: 200,
  },
  streak: {
    fontSize: 14,
    color: "#FFC107",
    fontWeight: "600",
    marginTop: 6,
  },
  habitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },

  goalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  goalCard: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
  },
  goalTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  goalDetail: {
    fontSize: 14,
    marginVertical: 2,
    color: "#444",
  },
  bold: {
    fontWeight: "600",
  },

  challengeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  challengeCard: {
    flex: 1,
    backgroundColor: "#FFF6ED",
    padding: 14,
    borderRadius: 12,
  },
  challengeTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  challengeDesc: {
    fontSize: 13,
    color: "#444",
  },
  challengeProgress: {
    fontSize: 13,
    color: "#FB923C",
    marginTop: 6,
  },

  impactCard: {
    marginTop: 28,
    backgroundColor: "#E7F8EE",
    borderRadius: 12,
    padding: 16,
  },
  impactTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  impactAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#034a2f",
  },
  impactPercent: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34C759",
  },
  impactLabel: {
    fontSize: 13,
    color: "#444",
  },
  impactList: {
    gap: 8,
  },
});
