import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { base_url } from "@/config/url";
import { getAuthToken } from "@/utils/authToken";

const SavingMethod = () => {
    const { goalId } = useLocalSearchParams();
    const [selectedMethod, setSelectedMethod] = useState("Sacrifice");

    const methods = [
        {
            key: "Sacrifice",
            title: "Sacrifice & Save",
            description: "Skip Coffee, save 5 pounds",
            icon: "wallet-outline",
        },
        {
            key: "RoundUp",
            title: "Round-Up",
            description:
                "Round up purchases to the nearest pound and save the difference",
            icon: "cash-outline",
        },
        {
            key: "DailyPocket",
            title: "Daily Pocket Change",
            description: "Automatic small saving toward specific goal",
            icon: "calendar-outline",
        },
    ];

    const handleContinue = async () => {
        const token = await getAuthToken();
        // Save method to backend or state
        console.log("Saving method:", selectedMethod, "for goal:", goalId);
        const response = await fetch(`${base_url}/update/goal`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                goalId: goalId,
                savingMethod: [
                    { method: selectedMethod },
                ]
            }),
        });
        //  const data = await response.json();
      if (response.ok) {
//   console.log("Goal updated successfully");
router.push("/bank/ConnectBankPage")
} else {
  console.log("Failed to update goal. Status:", response);
  const error = await response.json();
  console.log("Error body:", error);
}


        // router.push('/NextScreen') // if needed
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} />
                </TouchableOpacity>
                <Text style={styles.title}>Saving Method</Text>
            </View>
            <View style={styles.container}>
                {methods.map((method) => (
                    <TouchableOpacity
                        key={method.key}
                        style={[
                            styles.card,
                            selectedMethod === method.key && styles.cardSelected,
                        ]}
                        onPress={() => setSelectedMethod(method.key)}
                    >
                        <Ionicons
                            name={method.icon as any}
                            size={24}
                            color={selectedMethod === method.key ? "#10B981" : "#6B7280"}
                            style={{ marginRight: 10 }}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{method.title}</Text>
                            <Text style={styles.cardDescription}>{method.description}</Text>
                        </View>
                        {selectedMethod === method.key && (
                            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        )}
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SavingMethod;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        padding: 20,
        backgroundColor: "#fff",
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
    card: {
        flexDirection: "row",
        padding: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 10,
        marginBottom: 12,
        alignItems: "center",
        backgroundColor: "#F9FAFB",
    },
    cardSelected: {
        backgroundColor: "#ECFDF5",
        borderColor: "#10B981",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    cardDescription: {
        fontSize: 12,
        color: "#6B7280",
    },
    continueButton: {
        marginTop: 30,
        backgroundColor: "#10B981",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    continueText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
