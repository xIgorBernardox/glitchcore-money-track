import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./types/navigationTypes";
import loginScreen from "./screens/login";
import registerScreen from "./screens/register";
import primaryListScreen from "./screens/primaryList";
import secondaryListScreen from "./screens/secondaryList";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={loginScreen}
          options={{
            title: "Login", 
            headerStyle:{
              backgroundColor: "#202020",
              elevation: 0,          
              shadowOpacity: 0,       
              borderBottomWidth: 0,
            }, 
            headerTintColor: "#adff2f",
            headerTitleStyle: {
              fontSize: 24, 
              fontWeight: 'bold',
              letterSpacing: 2
              },
            }
          } 
        />
        <Stack.Screen
          name="register"
          component={registerScreen}
          options={{ 
            title: "Login", 
            headerStyle:{
              backgroundColor: "#202020",
              elevation: 0,          
              shadowOpacity: 0,       
              borderBottomWidth: 0 
            }, 
            headerTintColor: "#adff2f",
            headerTitleStyle: {
              fontSize: 24, 
              fontWeight: 'bold',
              letterSpacing: 2
              },
            }
          } 
        />
        <Stack.Screen
          name="Minhas Listas"
          component={primaryListScreen}
          options={{ 
            title: "", 
            headerStyle:{
              backgroundColor: "#202020",
              elevation: 0,          
              shadowOpacity: 0,       
              borderBottomWidth: 0 
            }, 
            headerTintColor: "#adff2f",
            headerTitleStyle: {
              fontSize: 24, 
              fontWeight: 'bold',
              letterSpacing: 2
              },
            }
          } 
        />
        <Stack.Screen
          name="secondaryList"
          component={secondaryListScreen}
          options={{ 
            title: "Minhas Listas", 
            headerStyle:{
              backgroundColor: "#202020",
              elevation: 0,          
              shadowOpacity: 0,       
              borderBottomWidth: 0 
            }, 
            headerTintColor: "#adff2f",
            headerTitleStyle: {
              fontSize: 24, 
              fontWeight: 'bold',
              letterSpacing: 2
              },
            }
          } 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}