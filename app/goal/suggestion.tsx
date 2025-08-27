import React, { useState, useEffect } from "react";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GoalSuggestionsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
const [goals, setGoals] = useState<any[]>([]);

  // const endpoint = "/suggestion/all";

  useEffect(() => {
    const fetchGoalSuggestion = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken("user");
        if (!token) {
          console.warn("User not found in storage");
          setLoading(false);
          return;
        }

        const response = await fetch(`${base_url}/suggestion/all`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Parsed response data:", data);

        const suggestions = data?.data?.data;
        if (response.ok && Array.isArray(suggestions)) {
        setGoals([...suggestions].reverse()); 
        } else {
          console.log("No valid suggestions data");
          setGoals([]);
        }
      } catch (error: any) {
        console.error("Error fetching goal suggestions:", error.message);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalSuggestion();
  }, []);

const renderSuggestion = ({ item }: { item: any }) => (

  <View style={styles.suggestionCard}>
    <View style={styles.topRow}>
      <View style={styles.iconCircle}>
        {item.icon?.startsWith("http") ? (
          <Image source={{ uri: item.icon }} style={styles.goalIconImage} />
        ) : (
          <Text style={styles.goalIcon}>{item.icon || "🎯"}</Text>
        )}
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.suggestionTitle}>{item.title}</Text>
        <Text style={styles.durationText}>Duration: {item.durationInDays} Days</Text>
      </View>

      <Text style={styles.amountText}>£{item.amount?.toFixed(2)}</Text>
    </View>

  <View style={styles.footer}>
  <Text style={styles.description}>{item.description}</Text>
  <TouchableOpacity style={styles.addButton}>
    <Text style={styles.addButtonText}>Add Goal</Text>
  </TouchableOpacity>
</View>

  </View>
);


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Goal Suggestions</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : goals.length === 0 ? (
        <Text style={styles.emptyText}>No goal suggestions</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item, index) =>
            item._id?.toString() || index.toString()
          }
          renderItem={renderSuggestion}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default GoalSuggestionsPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
  listContainer: {
    padding: 16,
  },
suggestionCard: {
  backgroundColor: "#FFFFFF",
  padding: 16,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  marginBottom: 16,
},

topRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

iconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "#F3F4F6",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

goalIcon: {
  fontSize: 20,
},

goalIconImage: {
  width: 24,
  height: 24,
  resizeMode: "contain",
},

titleSection: {
  flex: 1,
},

suggestionTitle: {
  fontSize: 16,
  fontWeight: "600",
  color: "#111827",
},

durationText: {
  fontSize: 14,
  color: "#6B7280",
},

amountText: {
  fontSize: 16,
  fontWeight: "700",
  color: "#16A34A",
},

addButtonText: {
  color: "#FFFFFF",
  fontWeight: "600",
  fontSize: 14,
},

  suggestionAmount: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 32,
    color: "#6B7280",
  },
 footer: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 8,
  flexWrap: "wrap",
  gap: 8,
},

description: {
  flex: 1,
  fontSize: 13,
  fontWeight: "400",
  color: "#637587",
  lineHeight: 18,
  paddingRight: 8,
},

addButton: {
  backgroundColor: "#16A34A",
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 6,
  alignSelf: "flex-start",
},

});
