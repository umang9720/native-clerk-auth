import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { withLayoutContext } from "expo-router";

const Drawer = createDrawerNavigator();
const DrawerLayout = withLayoutContext(Drawer.Navigator);

export default function DrawerWrapper() {
  return (
    <DrawerLayout
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItem
            label="Back"
            onPress={() => props.navigation.goBack()}
            icon={({ color, size }) => (
              <MaterialIcons name="arrow-back" color={color} size={size} />
            )}
          />
          <DrawerItem
            label="Saving Suggestions"
            onPress={() => props.navigation.navigate("suggestions")}
            icon={({ color, size }) => (
              <FontAwesome name="lightbulb-o" color={color} size={size} />
            )}
          />
          <DrawerItem
            label="History"
            onPress={() => props.navigation.navigate("history")}
            icon={({ color, size }) => (
              <FontAwesome name="history" color={color} size={size} />
            )}
          />
          <DrawerItem
            label="Insights"
            onPress={() => props.navigation.navigate("insights")}
            icon={({ color, size }) => (
              <MaterialIcons name="insights" color={color} size={size} />
            )}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen name="index" options={{ title: "Smart Savings" }} />
    </DrawerLayout>
  );
}
