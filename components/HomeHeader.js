import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Divider } from "@rneui/base";

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <View>
        <Image style={styles.image} source={require("../images/2.png")} />
      </View>
      <Divider width={1} orientation="vertical" />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    color: "#FFFFFF",
  },
  container: {
    alignContent: "center",
    alignItems: "center",
  },
  image: {
    height: 100,
    width: 200,
    marginTop: 10,
  },
});
