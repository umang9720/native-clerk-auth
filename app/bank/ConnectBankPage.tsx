import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

interface BankOption {
  id: string;
  name: string;
  type: string;
  color: string;
  textColor: string;
  selected?: boolean;
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

const ConnectBankPage: React.FC = () => {
  const features: FeatureItem[] = [
    {
      id: "1",
      title: "Spending Analysis",
      description:
        "Review your spending patterns and identify areas for improvement",
      iconColor: "#3B82F6",
      iconBg: "#EFF6FF",
    },
    {
      id: "2",
      title: "Health Impact",
      description:
        "Discover how spending changes can improve your financial health",
      iconColor: "#10B981",
      iconBg: "#ECFDF5",
    },
    {
      id: "3",
      title: "Smart Recommendations",
      description:
        "Get personalized suggestions for achieving your financial goals",
      iconColor: "#F59E0B",
      iconBg: "#FFFBEB",
    },
  ];

  const bankOptions: BankOption[] = [
    {
      id: "1",
      name: "Bank of America",
      type: "Checking & Savings",
      color: "#E53E3E",
      textColor: "#FFFFFF",
      selected: true,
    },
    {
      id: "2",
      name: "Chase",
      type: "Checking & Credit Card",
      color: "#1A365D",
      textColor: "#FFFFFF",
    },
    {
      id: "3",
      name: "Wells Fargo",
      type: "Checking & Savings",
      color: "#E53E3E",
      textColor: "#FFFFFF",
    },
  ];

  const FeatureIcon: React.FC<{ color: string; bgColor: string }> = ({
    color,
    bgColor,
  }) => (
    <View style={[styles.featureIcon, { backgroundColor: bgColor }]}>
      <View style={[styles.iconInner, { backgroundColor: color }]} />
    </View>
  );

  const BankIcon: React.FC<{
    color: string;
    textColor: string;
    name: string;
  }> = ({ color, textColor, name }) => (
    <View style={[styles.bankIcon, { backgroundColor: color }]}>
      <Text style={[styles.bankIconText, { color: textColor }]}>
        {name
          .split(" ")
          .map((word) => word.charAt(0))
          .join("")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connect Bank</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Find Savings Opportunities</Text>
          <Text style={styles.subtitle}>
            Connect your bank to uncover potential health benefits and savings
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <FeatureIcon color={feature.iconColor} bgColor={feature.iconBg} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bank Selection */}
        <View style={styles.bankSection}>
          <Text style={styles.sectionTitle}>Select Your Bank</Text>

          {bankOptions.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankOption,
                bank.selected && styles.bankOptionSelected,
              ]}
            >
              <BankIcon
                color={bank.color}
                textColor={bank.textColor}
                name={bank.name}
              />
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{bank.name}</Text>
                <Text style={styles.bankType}>{bank.type}</Text>
              </View>
              {bank.selected && <View style={styles.selectedIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Link */}
        <TouchableOpacity style={styles.searchLink}>
          <Text style={styles.searchLinkText}>
            Can&apos;t find your bank? Search here
          </Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.connectButton}      onPress={() => router.push("/(tabs)")}>
            <Text style={styles.connectButtonText}>Connect Securely</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton}      onPress={() => router.push("/(tabs)")}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Your data is encrypted with bank-level security. We can only view
            your transaction history and cannot move money or make purchases.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectBankPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  bankSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  bankOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  bankOptionSelected: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankIconText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  bankType: {
    fontSize: 14,
    color: "#6B7280",
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981",
  },
  searchLink: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  searchLinkText: {
    fontSize: 14,
    color: "#3B82F6",
    textAlign: "center",
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});
