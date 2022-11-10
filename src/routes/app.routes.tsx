import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "native-base";
import { PlusCircle, SoccerBall } from "phosphor-react-native";
import { Platform } from "react-native";
import { Details } from "../screens/Details";
import { Find } from "../screens/Find";
import { New } from "../screens/New";
import { Pools } from "../screens/Pools";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const { colors, sizes } = useTheme()

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: "beside-icon",
        tabBarActiveTintColor: colors.yellow[500],
        tabBarInactiveTintColor: colors.gray[300],
        tabBarStyle: {
          position: 'absolute',
          height: sizes[22],
          borderTopWidth: 0,
          backgroundColor: colors.gray[800],
        },
        tabBarItemStyle: {
          position: 'relative',
          top: Platform.OS === 'ios' ? sizes[2] : 0,
        }
      }}
    >
      <Screen
        name="New"
        component={New}
        options={{
          tabBarIcon: ({ color }) => <PlusCircle color={color} size={sizes[6]} />,
          tabBarLabel: 'Novo bolão'
        }}
      />

      <Screen
        name="Pools"
        component={Pools}
        options={{
          tabBarIcon: ({ color }) => <SoccerBall color={color} size={sizes[6]} />,
          tabBarLabel: 'Meus bolões'
        }}
      />

      <Screen
        name="Find"
        component={Find}
        options={{ tabBarButton: () => null }}
      />

      <Screen
        name="Details"
        component={Details}
        options={{ tabBarButton: () => null }}
      />
    </Navigator>
  )
}