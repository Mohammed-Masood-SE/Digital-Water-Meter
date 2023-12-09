import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../Config";

export default function LoginScreen() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedPassword = await AsyncStorage.getItem("password");

      if (storedUserId && storedPassword) {
        navigation.navigate("home");
      }
    } catch (error) {
      console.error("Error checking stored credentials:", error);
    }
  };

  const handleSignIn = () => {
    const postData = async () => {
      try {
        const apiUrl = `${API.url}:${API.port}/login`;
        const data = {
          username: userId,
          pass: password,
        };
        const response = await axios.post(apiUrl, data);
        console.log("Response:", response.data);

        if (
          response.data.message &&
          response.data.message === "Login successful"
        ) {
          saveCredentialsToStorage();
          navigation.navigate("home");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    postData();
  };

  const saveCredentialsToStorage = async () => {
    try {
      await AsyncStorage.setItem("userId", userId);
      await AsyncStorage.setItem("password", password);
    } catch (error) {
      console.error("Error saving credentials to storage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Header}>
        <Image source={require("../assets/Logo.png")} style={styles.image} />
        <Text style={[styles.mainTextColor, styles.HeaderText]}>Log in</Text>
        <Text style={[styles.secondaryTextColor, styles.subText]}>
          Welcome Back! Please enter your details.
        </Text>
      </View>
      <Text style={styles.subText}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setUserId(text)}
        value={userId}
        placeholder="Enter User ID"
      />
      <Text style={styles.subText}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Enter Password"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    paddingTop: 90,
  },
  Header: {
    marginBottom: 60,
  },
  HeaderText: {
    fontSize: 24,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    marginLeft: 3,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
  },
  mainTextColor: {
    color: "black",
  },
  secondaryTextColor: {
    color: "#667085",
  },
  button: {
    backgroundColor: "#92bde8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
});
