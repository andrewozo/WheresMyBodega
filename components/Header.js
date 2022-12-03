import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../images/2.png")} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    color: "#FFFFFF",
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  image: {
    width: 400,
    height: 200,
  },
});
