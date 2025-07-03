import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

Dimensions.get("window");

const SmartGoalsScreen = () => {
  const router= useRouter();
  return (
    <SafeAreaView style={styles.safeContainer}>
        {/* Header */}
    <View style={styles.container}>
          <Text style={styles.headerText}>Smart Goals</Text>
          <TouchableOpacity style={styles.headerIcon}
            onPress={() => router.push("/goal/suggestion")}
           >
            <Image
            source={require("@/assets/images/Suggestion.png")}
            style={styles.headerLeftIcon}
          />
          </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>


        {/* Total Saved Card */}
        <View style={styles.totalCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.amount}>£300</Text>
              <Text style={styles.cardLabel}>Total saved</Text>
            </View>
            <Image source={require("@/assets/images/Target.png")} />
          </View>
          <View style={styles.progressWrapper}>
           <View style={styles.progressTextContainer}>
             <Text style={styles.progressText}>Overall Progress</Text>
            <Text style={styles.progressText}>£300 of £2245</Text>
           </View>
            <ProgressBar
              progress={0.13}
              color="#F97316"
              style={styles.progressBar}
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Text style={[styles.tabText, styles.activeTab]}>Active Goals</Text>
          <Text style={styles.tabText}>Pause</Text>
          <Text style={styles.tabText}>Completed Goal</Text>
        </View>

        {/* Goal Cards */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <FontAwesome5 name="plane" size={20} color="#0EA5E9" />
            <Text style={styles.goalTitle}> Spain Trip</Text>
            <View style={styles.goalStatus}>
              <Text style={styles.statusTextGreen}>● On Track</Text>
            </View>
          </View>
          <Text style={styles.daysLeft}>
            Days Left: <Text style={styles.bold}>47</Text>
          </Text>
          <Text>
            Saved: <Text style={styles.bold}>£200</Text>   Target:{" "}
            <Text style={styles.bold}>£400</Text>
          </Text>
          <ProgressBar
            progress={0.5}
            color="#60A5FA"
            style={styles.progressBarGoal}
          />
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <FontAwesome5 name="medkit" size={20} color="#F97316" />
            <Text style={styles.goalTitle}> Medical Emergency</Text>
            <View style={styles.goalStatus}>
              <Text style={styles.statusTextRed}>● Overdue</Text>
            </View>
          </View>
          <Text style={styles.daysLeft}>
            Days Left: <Text style={styles.bold}>32</Text>
          </Text>
          <Text>
            Saved: <Text style={styles.bold}>£300</Text>   Target:{" "}
            <Text style={styles.bold}>£500</Text>
          </Text>
          <ProgressBar
            progress={0.6}
            color="#60A5FA"
            style={styles.progressBarGoal}
          />
        </View>
      

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}  onPress={() => router.push("/goal/createGoal")}>
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SmartGoalsScreen;
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",

  },
  headerLeftIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  scroll: {
    padding: 16,
    paddingBottom: 100,
       backgroundColor: '#F9FAFB',


  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#DBFFE9",
    alignItems: "center",
    justifyContent: "center",
    borderRadius:8,
  },
  totalCard: {
    backgroundColor: "#083623",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  cardLabel: {
    fontSize: 16,
    color: "#D1FAE5",
    marginTop: 4,
  },
  progressWrapper: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 8,
    borderRadius: 12,
  },
  progressTextContainer:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:4,
  },
  progressText: {
    textAlign: "right",
    fontWeight: "600",
    color: "#111827",
  },
  progressBar: {
    height: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabText: {
    fontSize: 14,
    paddingBottom: 8,
    color: "#6B7280",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#10B981",
    color: "#111827",
    fontWeight: "600",
  },
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  goalStatus: {
    marginLeft: "auto",
  },
  statusTextGreen: {
    color: "#10B981",
    fontWeight: "500",
  },
  statusTextRed: {
    color: "#F97316",
    fontWeight: "500",
  },
  daysLeft: {
    marginBottom: 4,
    color: "#374151",
  },
  bold: {
    fontWeight: "700",
    color: "#111827",
  },
  progressBarGoal: {
    height: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: "#389F61",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "600",
  },
});
