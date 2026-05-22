import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

const CustomButton = ({
  title,
  onPress,
  breadth = "100%",
  BGC = "#FAACBF",
  FS = 16,
}) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: BGC,
      paddingVertical: 12,
      paddingHorizontal: 0,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,

      width: breadth,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: FS,
      fontWeight: "600",
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, {}]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
