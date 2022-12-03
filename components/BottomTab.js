import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Divider } from "@rneui/base";
import { useNavigation } from "@react-navigation/core";

const BottomTab = () => {
  const navigate = useNavigation();
  return (
    <View>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        <TouchableOpacity>
          <Text style={styles.text}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
    paddingTop: 10,
  },
  text: { color: "#004aad", fontWeight: "900" },
});
