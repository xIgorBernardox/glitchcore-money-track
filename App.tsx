import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initializeDatabase } from "./database/initializeDatabase";
import loginScreen from "./screens/login";
import primaryListScreen from "./screens/primaryList";
import registerScreen from "./screens/register";
import secondaryListScreen from "./screens/secondaryList";
import viewTableSqLite from "./screens/viewTableSqLite";
import { RootStackParamList } from "./types/navigationTypes";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    async function load() {
      await initializeDatabase();
    }
    load();
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={loginScreen}
            options={{
              title: "Login",
              headerStyle: {
                backgroundColor: "#202020",
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: "#adff2f",
              headerTitleStyle: {
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 2,
              },
            }}
          />
          <Stack.Screen
            name="register"
            component={registerScreen}
            options={{
              title: "Login",
              headerStyle: {
                backgroundColor: "#202020",
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: "#adff2f",
              headerTitleStyle: {
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 2,
              },
            }}
          />
          <Stack.Screen
            name="myLists"
            component={primaryListScreen}
            options={{
              title: "Minhas Listas",
              headerStyle: {
                backgroundColor: "#202020",
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: "#adff2f",
              headerTitleStyle: {
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 2,
              },
            }}
          />
          <Stack.Screen
            name="secondaryList"
            component={secondaryListScreen}
            options={{
              title: "Minhas Listas",
              headerStyle: {
                backgroundColor: "#202020",
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: "#adff2f",
              headerTitleStyle: {
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 2,
              },
            }}
          />

          <Stack.Screen
            name="tabelas"
            component={viewTableSqLite}
            options={{
              title: "Minhas Listas",
              headerStyle: {
                backgroundColor: "#202020",
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: "#adff2f",
              headerTitleStyle: {
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 2,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
