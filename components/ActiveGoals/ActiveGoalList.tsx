import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { goalImageMap } from "./goalsMap";

const { width, height } = Dimensions.get("window");
const wp = (percentage: number) => (width * percentage) / 100;
const hp = (percentage: number) => (height * percentage) / 100;

export const ActiveGoalsList = ({ goals = [] }: { goals: any[] }) => {
  if (!goals.length) return null;

  const reversedGoals = [...goals].reverse();

  return (
    <>
      {reversedGoals.map((goal, idx) => {
        const imageKey = goal.goalImage as keyof typeof goalImageMap;
        const emoji = goalImageMap[imageKey] || "🎯";

        return (
          <View key={idx} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalEmoji}>{emoji}</Text>
              <Text style={styles.goalTitle}>
                {goal.goalName || "Untitled Goal"}
              </Text>
            </View>

            <Text style={styles.goalTarget}>
              Days Left: {goal.daysLeft ?? "-"}
            </Text>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      goal.goalAmount
                        ? Math.min(
                            ((goal.savedAmount ?? 0) / goal.goalAmount) * 100,
                            100
                          )
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>

            <View style={styles.cardAmount}>
              <Text style={styles.goalTarget}>
                Target: £{(goal.goalAmount ?? 0).toFixed(2)}
              </Text>
              <Text style={styles.goalStat}>
                Saved: £{(goal.savedAmount ?? 0).toFixed(2)}
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: hp(2),
    width: wp(90),
    alignSelf: "center",
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1.5),
  },
  goalEmoji: {
    fontSize: wp(6),
    marginRight: wp(3),
  },
  goalTitle: {
    fontSize: wp(4.2),
    fontWeight: "600",
    color: "#1F2937",
  },
  goalTarget: {
    fontSize: wp(3.5),
    color: "#6B7280",
    marginBottom: hp(1),
  },
  goalStat: {
    fontSize: wp(3.2),
    color: "#6B7280",
  },
  progressBarContainer: {
    width: "100%",
    height: hp(1),
    backgroundColor: "#E5E7EB",
    borderRadius: wp(1),
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: wp(1),
    backgroundColor: "#FB923C",
  },
  cardAmount: {
    marginTop: hp(1.2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});




   {/* <Text style={styles.goalStat}>
              Progress:{" "}
              {goal.goalAmount
                ? Math.round(((goal.savedAmount ?? 0) / goal.goalAmount) * 100)
                : 0}
              %
            </Text> */}