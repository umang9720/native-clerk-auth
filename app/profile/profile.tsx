import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";

const { width } = Dimensions.get("window");

interface Interest {
  id: string;
  name: string;
  selected: boolean;
}

const Profile: React.FC = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn]);

  const [currentPage, setCurrentPage] = useState<"settings" | "profile">(
    "settings"
  );
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailReminders, setEmailReminders] = useState(false);
  const [goalAlerts, setGoalAlerts] = useState(false);

  const [profileData, setProfileData] = useState({
    phone: "(+91) 8800889352",
    dateOfBirth: "Select Date of Birth",
    salaryRange: "Select Salary Range",
  });

  const [interests, setInterests] = useState<Interest[]>([
    { id: "1", name: "Travel", selected: true },
    { id: "2", name: "Photography", selected: true },
    { id: "3", name: "Hiking", selected: true },
    { id: "4", name: "Reading", selected: true },
    { id: "5", name: "Cooking", selected: true },
  ]);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.map((interest) =>
        interest.id === id
          ? { ...interest, selected: !interest.selected }
          : interest
      )
    );
  };

  const router = useRouter();

  const CrossIcon = () => (
    <View style={styles.crossIcon}>
      <View style={styles.crossLine1} />
      <View style={styles.crossLine2} />
    </View>
  );

  const ChevronRightIcon = () => (
    <View style={styles.chevronRight}>
      <View style={styles.chevronLine1} />
      <View style={styles.chevronLine2} />
    </View>
  );

  const CalendarIcon = () => (
    <View style={styles.calendarIcon}>
      <View style={styles.calendarTop} />
      <View style={styles.calendarBody} />
      <View style={styles.calendarDate} />
    </View>
  );

  const renderSettingsPage = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <CrossIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
           <Image
        width={100}
        height={100}
        source={{ uri: user?.imageUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.fullName}</Text>
          <Text style={styles.profileEmail}>{user?.emailAddresses[0].emailAddress}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>🌐</Text>
              </View>
              <Text style={styles.menuItemText}>Language</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>English</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>💰</Text>
              </View>
              <Text style={styles.menuItemText}>Currency</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>GBP</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>👛</Text>
              </View>
              <Text style={styles.menuItemText}>Wallet</Text>
            </View>
            <ChevronRightIcon />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>🌙</Text>
              </View>
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#E5E5E5", true: "#4CAF50" }}
              thumbColor={darkMode ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>🔔</Text>
              </View>
              <Text style={styles.menuItemText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#E5E5E5", true: "#4CAF50" }}
              thumbColor={pushNotifications ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>📧</Text>
              </View>
              <Text style={styles.menuItemText}>Email Reminders</Text>
            </View>
            <Switch
              value={emailReminders}
              onValueChange={setEmailReminders}
              trackColor={{ false: "#E5E5E5", true: "#4CAF50" }}
              thumbColor={emailReminders ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>🎯</Text>
              </View>
              <Text style={styles.menuItemText}>Goal Alerts</Text>
            </View>
            <Switch
              value={goalAlerts}
              onValueChange={setGoalAlerts}
              trackColor={{ false: "#E5E5E5", true: "#4CAF50" }}
              thumbColor={goalAlerts ? "#FFFFFF" : "#FFFFFF"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <ChevronRightIcon />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <ChevronRightIcon />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Danger Zone</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}  onPress={async () => await signOut()}>
            <Text style={styles.menuItemText}>Log Out</Text>
            <View style={styles.logoutIcon}>
              <Text style={styles.iconText}>→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteAccount}>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
            <View style={styles.deleteIcon}>
              <Text style={styles.iconText}>🗑</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setCurrentPage("profile")}
      >
        <Text style={styles.floatingButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProfilePage = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage("settings")}>
          <CrossIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.profileImageSection}>
             <Image
        width={100}
        height={100}
        source={{ uri: user?.imageUrl }}
              style={styles.editProfileImage}
            />
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraText}>📷</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={user?.fullName}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={user?.emailAddresses[0].emailAddress}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, email: text }))
              }
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profileData.phone}
              onChangeText={(text) =>
                setProfileData((prev) => ({ ...prev, phone: text }))
              }
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text
                style={[
                  styles.dateText,
                  !profileData.dateOfBirth.startsWith("Select") &&
                    styles.dateTextFilled,
                ]}
              >
                {profileData.dateOfBirth}
              </Text>
              <CalendarIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Salary Range</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Text
                style={[
                  styles.dateText,
                  !profileData.salaryRange.startsWith("Select") &&
                    styles.dateTextFilled,
                ]}
              >
                {profileData.salaryRange}
              </Text>
              <ChevronRightIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>

          <View style={styles.interestsContainer}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestTag,
                  interest.selected && styles.interestTagSelected,
                ]}
                onPress={() => toggleInterest(interest.id)}
              >
                <Text
                  style={[
                    styles.interestText,
                    interest.selected && styles.interestTextSelected,
                  ]}
                >
                  {interest.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentPage === "settings" ? renderSettingsPage() : renderProfilePage()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#2C5F2D",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },
  crossIcon: {
    width: 24,
    height: 24,
    position: "relative",
  },
  crossLine1: {
    position: "absolute",
    width: 16,
    height: 2,
    backgroundColor: "white",
    top: 11,
    left: 4,
    transform: [{ rotate: "45deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: 16,
    height: 2,
    backgroundColor: "white",
    top: 11,
    left: 4,
    transform: [{ rotate: "-45deg" }],
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#2C5F2D",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  profileName: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 5,
  },
  profileEmail: {
    color: "#97BC62",
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  menuItemValue: {
    fontSize: 16,
    color: "#666",
  },
  chevronRight: {
    width: 8,
    height: 8,
    position: "relative",
  },
  chevronLine1: {
    position: "absolute",
    width: 6,
    height: 1,
    backgroundColor: "#999",
    top: 2,
    transform: [{ rotate: "45deg" }],
  },
  chevronLine2: {
    position: "absolute",
    width: 6,
    height: 1,
    backgroundColor: "#999",
    top: 5,
    transform: [{ rotate: "-45deg" }],
  },
  logoutIcon: {
    transform: [{ rotate: "0deg" }],
  },
  deleteAccount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    marginTop: 10,
  },
  deleteAccountText: {
    fontSize: 16,
    color: "#FF4444",
    flex: 1,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Profile page specific styles
  profileImageSection: {
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  editProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: width / 2 - 65,
    backgroundColor: "#4CAF50",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraText: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  dateText: {
    fontSize: 16,
    color: "#999",
  },
  dateTextFilled: {
    color: "#333",
  },
  calendarIcon: {
    width: 20,
    height: 20,
    position: "relative",
  },
  calendarTop: {
    position: "absolute",
    width: 16,
    height: 2,
    backgroundColor: "#4CAF50",
    top: 2,
    left: 2,
  },
  calendarBody: {
    position: "absolute",
    width: 16,
    height: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    top: 4,
    left: 2,
    borderRadius: 2,
  },
  calendarDate: {
    position: "absolute",
    width: 2,
    height: 2,
    backgroundColor: "#4CAF50",
    top: 8,
    left: 6,
    borderRadius: 1,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
  },
  interestTagSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  interestText: {
    fontSize: 14,
    color: "#666",
  },
  interestTextSelected: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 30,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
