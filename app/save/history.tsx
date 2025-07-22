import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isThisWeek from "dayjs/plugin/isSameOrAfter";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

export default function Option1() {
  const [groupedSaves, setGroupedSaves] = useState([]);

  useEffect(() => {
    const fetchSaving = async () => {
      try {
        const token = await getAuthToken("user");

        const response = await fetch(`${base_url}/saves/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        const savesData = result?.data?.data;

        if (Array.isArray(savesData)) {
          const reversed = [...savesData].reverse(); // Latest first
          const grouped = groupByDateCategory(reversed);
          setGroupedSaves(grouped);
        } else {
          console.warn("Unexpected saves format:", savesData);
        }
      } catch (error) {
        console.error("Error fetching savings:", error);
      }
    };

    fetchSaving();
  }, []);

  // 📦 Group saves by categories
  const groupByDateCategory = (data: any[]) => {
    const sections: { title: string; data: any[] }[] = [];

    const categories = {
      Today: (date: dayjs.Dayjs) => dayjs(date).isToday(),
      Yesterday: (date: dayjs.Dayjs) => dayjs(date).isYesterday(),
      "This Week": (date: dayjs.Dayjs) =>
        dayjs(date).isAfter(dayjs().startOf("week")),
      "This Month": (date: dayjs.Dayjs) =>
        dayjs(date).isAfter(dayjs().startOf("month")),
      "This Year": (date: dayjs.Dayjs) =>
        dayjs(date).isAfter(dayjs().startOf("year")),
      Older: () => true,
    };

    const grouped: { [key: string]: any[] } = {};

    data.forEach((item) => {
      const date = dayjs(item.createdAt);
      let matched = false;

      for (const [label, condition] of Object.entries(categories)) {
        if (condition(date)) {
          if (!grouped[label]) grouped[label] = [];
          grouped[label].push(item);
          matched = true;
          break;
        }
      }

      if (!matched) {
        if (!grouped["Older"]) grouped["Older"] = [];
        grouped["Older"].push(item);
      }
    });

    for (const key of Object.keys(grouped)) {
      sections.push({ title: key, data: grouped[key] });
    }

    return sections;
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.saveItem}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>+£{item.amount}</Text>
      </View>
      <Text style={styles.date}>
        {dayjs(item.createdAt).format("MMM D, YYYY")}
      </Text>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/save")}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Saving History</Text>
      </View>
      <SectionList
        sections={groupedSaves}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.empty}>No savings found.</Text>}
      />
    </SafeAreaView>
  );
}

// Get screen width for responsive padding
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#121417",
  },
  listContent: {
    paddingHorizontal: screenWidth < 375 ? 15 : 20,
    paddingVertical: 10,
  },
  saveItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  amount: {
    fontSize: 14,
    color: "#006400",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#555",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});
