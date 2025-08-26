import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";

export default function Notification() {
  const [notificationsData, setNotificationsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotificationsData = async () => {
      try {
        const token = await getAuthToken("user");
        const response = await fetch(`${base_url}/notifications/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log("Parsed response data:", json);

        if (json?.data?.data) {
          const notifications = Array.isArray(json.data.data)
            ? json.data.data
            : Object.values(json.data.data); // handle objects
          setNotificationsData(notifications);
        } else if (Array.isArray(json?.data)) {
          setNotificationsData(json.data);
        } else {
          console.warn("Unexpected response format:", json);
        }
      } catch (error) {
        console.error("Error fetching notifications data:", error);
      }
    };

    fetchNotificationsData();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title ?? "No title"}</Text>
      <Text style={styles.notificationMessage}>{item.message ?? ""}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      {/* Notifications List */}
      <View style={{ flex: 1, padding: 20 }}>
        {notificationsData.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No notifications found.
          </Text>
        ) : (
          <FlatList
            data={notificationsData}
            keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
            renderItem={renderItem}
          />
        )}
      </View>
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
  notificationItem: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#121417",
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555",
  },
});
