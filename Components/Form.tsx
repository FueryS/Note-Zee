import { useState, useEffect } from "react";
import { scale, Scale, verticalScale } from "react-native-size-matters";
import CustomButton from "./UI/CustomButton";
import * as Heptics from "expo-haptics";

import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React from "react";
import { triggerHapticByValue } from "../Services/HepticService";

const c = "#e9add5";
const vs = verticalScale(80); // Modify this to change the padding of the black overlay when form pops up
// For future use

// Self note: fix the bug that clicking on the form results in closing of the form : Fixed using the onStartShouldSetResponder
//    onStartShouldSetResponder modifies how the view responds to touches:
//      TouchAbleOpacity: Who wants to handle this touch? , onStartShouldSetResponder = true(yes me) || false (not me)

const Form = ({
  visible,
  heading,
  message,
  buttonText,
  onClose,
  handleAdd,
  setHeading,
  setMessage,
}: {
  visible: boolean;
  heading: string;
  message: string;
  buttonText: string;
  onClose: () => void;
  handleAdd: () => void;
  setHeading: (text: string) => void;
  setMessage: (tex: string) => void;
}) => {
  const handleBack = () => {
    onClose();
    return true;
  };

  // Used to close the form when user preses back on the phone
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack,
    );
    return () => backHandler.remove();
  }, [visible]); // depend on visible so it re-registers correctly

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      onPress={handleBack}
      activeOpacity={1}
    >
      <View style={styles.formMain} onStartShouldSetResponder={() => true}>
        <View
          style={{
            width: "100%",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <CustomButton
            title="X"
            onPress={() => {
              handleBack();
            }}
            breadth="20%"
            BGC={c}
            FS={30}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Heading (Optional)"
            placeholderTextColor="#888"
            style={styles.input}
            value={heading}
            onChangeText={setHeading}
          />
          <TextInput
            placeholder="Message (Required)"
            placeholderTextColor="#888"
            style={[styles.input, { maxHeight: verticalScale(100) }]}
            value={message}
            onChangeText={setMessage}
            multiline={true}
          />
          <CustomButton
            title={buttonText}
            onPress={() => {
              handleAdd();
              handleBack();
              triggerHapticByValue(4);
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: vs,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  formMain: {
    backgroundColor: c,
    width: "85%",
    borderRadius: 12,
    padding: 24,
    paddingTop: 0,
    position: "relative",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default Form;
