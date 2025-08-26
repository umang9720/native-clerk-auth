import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuthToken } from "@/utils/authToken";
import { useCallback, useEffect, useState } from "react";
import { base_url } from "@/config/url";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import isThisWeek from "dayjs/plugin/isSameOrAfter";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

interface WalletResponse {
  data: {
    code: number;
    data: {
      __v: number;
      _id: string;
      calculated: object;
      isBankConnected: boolean;
      totalSaveAmount: number;
      totalTargetAmount: number;
      userId: string;
    };
    message: string;
  };
}
export default function wallet() {
  const [loading, setLoading] = useState(false);

  const [walletData, setWalletData] = useState<
    WalletResponse["data"]["data"] | null
  >(null);
  const [groupedSaves, setGroupedSaves] = useState([]);

  useEffect(
    useCallback(() => {
      const fetchSaving = async () => {
        try {
          const token = await getAuthToken("user");

          const response = await fetch(`${base_url}/money/all`, {
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
    }, [])
  );

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

  //for fetching wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = await getAuthToken("user");
        const response = await fetch(`${base_url}/wallet/user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const json = await response.json();
        console.log("Parsed response data:", json);

        // Save only the nested "data" object
        setWalletData(json.data.data);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <View style={styles.layout}>
        {/* wallet card */}
        <View style={styles.walletCard}>
          <Text style={styles.walletText}>Total Wallet Balance</Text>
          <Text style={styles.walletAmt}>
            £ {walletData?.totalSaveAmount ?? 0}
          </Text>
          <Text style={styles.walletText}>Bank-Level Security Enabled</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() =>
                router.push({
                  pathname: "/previewGoal/deposit",
                  // params: { id: selectedGoal.id },
                })
              }
            >
              <Text style={styles.walletText}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quicksaveBtn}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/save",
                  // params: { id: selectedGoal.id },
                })
              }
            >
              <Text>Quick Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.saveTitle}>Bank connection Comming soon</Text>

        <Text style={styles.saveTitle}>Saving History</Text>
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
const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
  layout: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 0, // 🔹 remove bottom padding so list sits right under "Saving History"
  },
  walletCard: {
    width: screenWidth - 40, // 🔹 responsive: full width minus padding
    minHeight: 160,
    borderRadius: 12,
    backgroundColor: "#12211B",
    padding: 20,
    justifyContent: "space-around",
  },
  walletText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#fff",
  },
  walletAmt: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  withdrawBtn: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#3BA365",
  },
  quicksaveBtn: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
    backgroundColor: "#FFF",
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
    marginTop: 5, // 🔹 reduced so it hugs "Saving History"
    marginBottom: 8,
    color: "#555",
  },
  listContent: {
    paddingHorizontal: screenWidth < 375 ? 15 : 20,
    paddingVertical: 10,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
  saveTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#121417",
    marginTop: 20,
  },
});
