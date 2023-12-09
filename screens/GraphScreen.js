import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../Config";

const GraphScreen = () => {
  const navigation = useNavigation();

  const [dataPoints, setDataPoints] = useState([{ x: 0, y: 0 }]);
  const [data, setData] = useState({
    labels: dataPoints.map((point) => String(point.x)),
    datasets: [
      {
        data: dataPoints.map((point) => point.y),
      },
    ],
  });

  useEffect(() => {
    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
    }

    async function handleBackButton() {
      await ScreenOrientation.unlockAsync();
      navigation.goBack();
      return false;
    }

    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );
    changeScreenOrientation();

    return () => {
      backHandlerListener.remove();
    };
  }, [navigation]);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        const apiUrl = `${API.url}:${API.port}/arduinoId/${storedUserId}`;
        const response = await axios.get(apiUrl);
        const apiUrl2 = `${API.url}:${API.port}/waterUsage/currentMonth/${response.data.arduinoId}`;
        const response2 = await axios.get(apiUrl2);

        const formattedData = response2.data.waterUsagePerDay.map((item) => {
          const date = new Date(item.day);
          return {
            x: date.getDate(), // Extract day of the month
            y: item.totalUsage,
          };
        });

        setDataPoints(formattedData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    setData({
      labels: dataPoints.map((point) => String(point.x)),
      datasets: [
        {
          data: dataPoints.map((point) => point.y),
        },
      ],
    });
  }, [dataPoints]);

  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "3",
      stroke: "#92bde8",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.ylabel}>Gallons Used</Text>
      <Text style={styles.xlabel}>Day Of The Month</Text>

      <LineChart
        data={data}
        width={700}
        height={300}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={chartConfig}
        bezier={false}
        style={styles.graphStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    paddingTop: 60,
  },
  graphStyle: {
    borderRadius: 16,
  },
  ylabel: {
    position: "absolute",
    left: 10,
    transform: [{ rotate: "-90deg" }],
    fontSize: 15,
    fontWeight: "bold",
    zIndex: 1,
  },
  xlabel: {
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    bottom: 30,
    zIndex: 1,
  },
});

export default GraphScreen;
