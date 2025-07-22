import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ProgressBar from "./components/progressBar";
import MultiSelectButton from "./components/multiSelectButton";
import { base_url } from "@/config/url";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuthToken } from "@/utils/authToken";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");
const TOTAL_STEPS = 6;

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [isStudent, setIsStudent] = useState(false);
  const [email, setEmail] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [spendOn, setSpendOn] = useState<string[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<string[]>([]);
  const [customGoal, setCustomGoal] = useState("");
 

  const handleSelect = (item: string, list: string[], setList: any) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  };

  const next = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const skip = () => next();

  const handleSubmit = async () => {
   const payload = {
  isstudent: isStudent,
  studentId: email,
  ageRange: ageRange,
  lifestyleInterests: lifestyle,
  spendMostOn: spendOn,
  savings_goals: [...savingsGoals, customGoal].filter(Boolean),
  preferences: {
    trackGoalCompletion: false,
    seeHowOthersSave: false,
    shareStreaksChallenges: false,
    pushNotification: false,
    emailReminder: false,
    goalAlerts: false,
  },
};



 try {
      const token = await getAuthToken();
  
  const response = await fetch(`${base_url}/create/user`, {
    method: "PATCH",
    headers: {
        Authorization: `Bearer ${token}`,
      "Content-Type": "form-data",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text(); // 🔍 read server error
    console.error("Backend error:", errorText);
    throw new Error(`Submission failed: ${response.status}`);
  }

  alert("SignUp Complete!");
        router.push("/(tabs)");

} catch (error) {
  console.error("Submit error:", error); // 🛠 log real error
  alert("Something went wrong.");
}


  };

  const getBottomBarConfig = () => {
  switch (step) {
    case 1:
      return {
        show: true,
        continueText: "Start Saving Smarter",
        showSkip: true,
        onPress: next,
      };
    case 2:
    case 3:
    case 4:
      return {
        show: true,
        continueText: "Continue",
        showSkip: true,
        onPress: next,
      };
    case 5:
      return {
        show: true,
        continueText: "Connect via TrueLayer",
        showSkip: true,
        onPress: next,
      };
    case 6:
      return {
        show: true,
        continueText: "Let's Start",
        showSkip: false,
        onPress: handleSubmit,
      };
    default:
      return {
        show: true,
        continueText: "Continue",
        showSkip: true,
        onPress: next,
      };
  }
};

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.page}>
            <Image
              source={require("@/assets/images/signUp.png")}
              style={[styles.loginImage, { width: screenWidth * 0.8, height: screenWidth * 0.8 }]}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              Build the Life You Want, One Micro Goal at a Time.
            </Text>
            <Text style={styles.subTitle}>
              We’ll use smart insights to turn your everyday choices into goals
              that matter — from that trip to Tokyo to funding your first side
              hustle.
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.page}>
            <View style={styles.inputContainer}>
              <Text style={styles.page2Title}>Tell us about yourself</Text>
              <Text style={styles.page2subTitle}>
                This helps us suggest relevant goals and tips.
              </Text>
            </View>
            <View style={styles.page2Container}>
              <View style={styles.page2textWrapper}>
                <Text style={styles.page2Title}>Are you a student?</Text>
                <Text style={styles.studentText}>
                  We&apos;ll suggest student-friendly goals
                </Text>
              </View>
<Switch
  value={isStudent}
  onValueChange={setIsStudent}
  trackColor={{ false: "#E5E5E5", true: "#4CAF50" }}
  thumbColor="#FFFFFF"
/>

            </View>
            {/* <TouchableOpacity onPress={() => setIsStudent(!isStudent)}>
              <Text style={[styles.toggleText, isStudent && { color: "green" }]}>
                {isStudent ? "Yes" : "No"}
              </Text>
            </TouchableOpacity> */}
            {isStudent && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Student Email"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={styles.note}>
                  This will link your account with UNiDAYS.
                </Text>
              </>
            )}
            <View style={styles.ageContainer}>
              <Text style={styles.label}>Age Range</Text>
              <Text style={styles.ageContainerText}>
                Spending habit can vary by age groups
              </Text>
            </View>
            <View style={styles.buttonRow}>
              {["18–25", "26–35", "36–45", "46+"].map((range) => (
                <MultiSelectButton
                  key={range}
                  label={range}
                  selected={ageRange === range}
                  onPress={() => setAgeRange(range)}
                  style={styles.multiSelectHalfWidth}
                />
              ))}
            </View>
 
          </View>
        );

      case 3:
        return (
          <View style={styles.page}>
            <View style={styles.inputContainer}>
              <Text style={styles.page2Title}>Tell us about yourself</Text>
              <Text style={styles.page2subTitle}>
                This helps us suggest relevant goals and tips.
              </Text>
            </View>
            <View style={styles.lifeContainer}>
              <Text style={styles.label}>Lifestyle Interests</Text>
              <Text style={styles.lifeContainerText}> (select up to 3)</Text>
            </View>
            <View style={styles.buttonRow}>
              {["Fitness", "Travel", "Charity", "Shopping", "Food & Dining", "Technology"].map((item) => (
                <MultiSelectButton
                  key={item}
                  label={item}
                  selected={lifestyle.includes(item)}
                  onPress={() => handleSelect(item, lifestyle, setLifestyle)}
                  style={styles.multiSelectHalfWidth}
                />
              ))}
            </View>
            <View style={styles.lifeContainer}>
              <Text style={styles.label}>What do you spend on most?</Text>
            </View>
            <View style={styles.buttonRow}>
              {["Takeout", "Coffee", "RideShare", "Clothes", "Subscriptions", "Groceries"].map((item) => (
                <MultiSelectButton
                  key={item}
                  label={item}
                  selected={spendOn.includes(item)}
                  onPress={() => handleSelect(item, spendOn, setSpendOn)}
                  style={styles.multiSelectHalfWidth}
                />
              ))}
            </View>
            
          </View>
        );

      case 4:
        return (
          <View style={styles.page}>
            <View style={styles.page2textWrapper}>
              <Text style={styles.label}>What would you like to save for?</Text>
              <Text>Choose goals that excite you</Text>
            </View>
            <View style={styles.verticalButtonColumn}>
              {["New Gear", "Trip", "Running Shoes", "Charity", "Calm Yo Crisis Cash"].map((goal) => (
                <MultiSelectButton
                  key={goal}
                  label={goal}
                  selected={savingsGoals.includes(goal)}
                  onPress={() => handleSelect(goal, savingsGoals, setSavingsGoals)}
                  style={styles.multiSelectFullWidth}
                />
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Other goal?"
              value={customGoal}
              onChangeText={setCustomGoal}
            />
            
          </View>
        );

      case 5:
        return (
          <View style={styles.page}>
            <View style={styles.bankContainer}>
              <Text style={styles.bankContainerTitle}>Get real insights by connecting your bank</Text>
              <Text style={styles.bankContainerSubTitle}>
                Track expenses and unlock savings tips based on your real spending.
              </Text>
            </View>
            <View style={styles.bankContainerBox}>
              <Image source={require("@/assets/images/bank1.png")} style={styles.bankImage} resizeMode="contain" />
              <View style={styles.bankTexeWrapper}>
                <Text style={styles.label}>Automatic expense tracking</Text>
                <Text style={styles.bankText}>See where your money goes without manual entry</Text>
              </View>
            </View>
            <View style={styles.bankContainerBox}>
              <Image source={require("@/assets/images/bank2.png")} style={styles.bankImage} resizeMode="contain" />
              <View style={styles.bankTexeWrapper}>
                <Text style={styles.label}>Personalized saving tips</Text>
                <Text style={styles.bankText}>Get suggestions based on your actual spending patterns</Text>
              </View>
            </View>
            
          </View>
        );

      case 6:
        return (
          <View style={styles.page}>
            <Image
              source={require("@/assets/images/Savings-pana 1.png")}
              style={{ width: screenWidth * 0.5, height: screenWidth * 0.5 }}
              resizeMode="contain"
            />
            <Text style={styles.title}>You&apos;re in control!</Text>
            <Text>Here&apos;s what you&apos;ve shared and how we&apos;ll use it</Text>
            {/* <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Let&apos;s Start</Text>
            </TouchableOpacity> */}
          </View>
        );
    }
  };

const { show, continueText, showSkip, onPress } = getBottomBarConfig();

return (
  <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={{ flex: 1 }}>
        <ProgressBar step={step} totalSteps={TOTAL_STEPS} />
        <ScrollView contentContainerStyle={styles.container}>
          {renderStep()}
        </ScrollView>

        {show && (
          <View style={styles.bottomGreenBar}>
            <TouchableOpacity
              style={styles.bottomContinueButton}
              onPress={onPress}
            >
              <Text style={styles.buttonText}>{continueText}</Text>
            </TouchableOpacity>

            {showSkip && (
              <TouchableOpacity onPress={skip}>
                <Text style={styles.skipText}>Skip →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  page: {
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },
  loginImage: {
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  page2Container: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F2F2F5",
    borderRadius: 8,
    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
  },
  page2textWrapper: {
    flex: 1,
  },
  studentText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#637587",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#181619",
    textAlign: "center",
    maxWidth: 300,
  },
  subTitle: {
    fontSize: 12,
    color: "#181619",
    fontWeight: "400",
    textAlign: "center",
    maxWidth: 350,
  },
  button: {
    width: "100%",
    maxWidth: 350,
    height: 55,
    backgroundColor: "#54C381",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 15,
  },
  skipText: {
    marginTop: 10,
    textAlign: "center",
    color: "#999",
    textDecorationLine: "underline",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginTop: 10,
    borderRadius: 8,
    width: "100%",
  },
  note: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  ageContainer: {
    flexDirection: "row",
    marginTop:20,
    marginBottom: 10,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ageContainerText: {
    fontSize: 10,
    fontWeight: "500",
  },
  lifeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  lifeContainerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#637587",
    marginLeft: 10,
  },
  label: {
    fontWeight: "500",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  verticalButtonColumn: {
    width: "100%",
    marginTop: 10,
  },
  multiSelectHalfWidth: {
    width: "48%",
    marginVertical: 5,
  },
  multiSelectFullWidth: {
    width: "100%",
    marginVertical: 5,
  },
  bottomBar: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  bankContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  bankContainerTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  bankContainerSubTitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  bankContainerBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#E2FFF4",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
  },
  bankTexeWrapper: {
    flex: 1,
    paddingLeft: 10,
  },
  bankText: {
    fontSize: 12,
    color: "#3BA365",
    fontWeight: "400",
  },
  bankImage: {
    width: 44,
    height: 44,
  },
 page2Title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#181619",
  },

  page2subTitle: {
    fontSize: 16,
    color: "#181619",
    fontWeight: "400",
    width: 300,
  },
  bottomGreenBar: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#12211B",
  paddingVertical: 20,
  paddingHorizontal: 20,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  alignItems: "center",
},
bottomContinueButton: {
  backgroundColor: "#54C381",
  width: "100%",
  height: 50,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
},


});

export default SignUp;
