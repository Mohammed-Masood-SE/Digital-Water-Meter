import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ProgressBarAndroid,
  Text,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API from "../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const maxGallons = 300;
  const [progress, setProgress] = useState(0);
  const [arduinoID, setArduinoID] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const apiUrl = `${API.url}:${API.port}/arduinoId/${storedUserId}`;
        const response = await axios.get(apiUrl);
        setArduinoID(response.data.arduinoId);
        const apiUrl2 = `${API.url}:${API.port}/waterUsage/${response.data.arduinoId}`;
        const response2 = await axios.get(apiUrl2);
        setProgress(response2.data.totalUsage);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getData();
  }, []);

  const getProgressBarColor = () => {
    const red = Math.min(255, Math.round((progress / maxGallons) * 255));
    const blue = Math.min(
      255,
      Math.round(((maxGallons - progress) / maxGallons) * 255)
    );
    return `rgb(${red}, 128, ${blue})`;
  };
  const handleMonthlyChartPress = () => {
    navigation.navigate("graph");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.gallonsText}>Gallons used today: {progress}</Text>
      <View style={styles.progressBarHolder}>
        <TouchableOpacity style={styles.button}>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress / maxGallons}
            color={getProgressBarColor()}
            style={styles.progressBar}
          />
        </TouchableOpacity>
        <Text style={styles.scaleTextMin}>0 gallons</Text>
        <Text style={styles.scaleTextMax}>{maxGallons} gallons</Text>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.monthlyButton}
            onPress={handleMonthlyChartPress}
          >
            <Image
              source={require("../assets/monthly.png")}
              style={styles.image}
            />
            <Text style={styles.buttonText}>Monthly Chart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    paddingTop: 100,
  },
  progressBarHolder: {
    position: "relative",
  },
  button: {
    alignSelf: "center",
  },
  gallonsText: {
    fontSize: 18,
    marginBottom: 10,
  },
  progressBar: {
    width: 350,
    height: 20,
    marginTop: 10,
  },
  scaleTextMin: {
    fontSize: 16,
    marginTop: 5,
  },
  scaleTextMax: {
    fontSize: 16,
    marginTop: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  monthlyButton: {
    // backgroundColor: "#92bde8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    alignItems: "center",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    columnGap: 40,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  card: {
    justifyContent: "center",
  },
});
