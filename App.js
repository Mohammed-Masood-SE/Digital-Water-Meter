import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import GraphScreen from "./screens/GraphScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="graph" component={GraphScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
