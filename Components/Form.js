import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from "react-native";
import { verticalScale } from "react-native-size-matters";
import CustomButton from "./UI/CustomButton";
import { triggerHapticByValue } from "../Services/HepticService";
import { ScrollView } from "react-native-gesture-handler";

const ACCENT = "#e9add5";
const OVERLAY_PADDING_TOP = verticalScale(80);
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Form = ({
  visible,
  heading,
  message,
  buttonText,
  onClose,
  handleAdd,
  setHeading,
  setMessage,
}) => {
  // shouldRender stays true through the exit animation, only goes false after it finishes
  const [shouldRender, setShouldRender] = useState(false); // This being false will return the function early

  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  /*
  This useEffect hook is dependent on the visible variable so when its false
  the exit animation is triggered other wise the enter animation is triggeres
  */
  useEffect(() => {
    if (visible) {
      // 1. Mount the component
      setShouldRender(true);
      // 2. Reset values to starting position before animating in
      translateY.setValue(-SCREEN_HEIGHT);
      overlayOpacity.setValue(0);
      // 3. Animate in
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 18,
          stiffness: 320,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out first, then unmount once done
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setShouldRender(false);
        /**
         * In case the animation was interupted early due to
         *                  - the Form is sliding away
         *                  - its Called again so the slide away animation is interupted
         *
         * In this edge case dont set the shouldRender to false so the form does renders
         */
      });
    }
  }, [visible]);

  /* 
  This triggers onCLose which changes the visible variable 
  that triggers the exist animation due to useEffects dependence on 
  visible variable
  */
  const handleBack = () => {
    onClose();
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBack,
    );
    return () => backHandler.remove();
  }, [visible]);

  if (!shouldRender) return null;

  const colorSelectionPallet = [
    "#FFE4E1",
    "#E6F7FF",
    "#F0FFF0",
    "#FFF5E1",
    "#F3E8FF",
    "#E0FFFF",
    "#FFF0F5",
  ];

  // KeyboardAvoidingView must be the outermost absolutely positioned element —
  // nesting it inside an absolute View breaks it because absolute elements are
  // outside the normal layout flow so the parent cant resize around them
  return (
    <KeyboardAvoidingView
      style={styles.overlayWrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableOpacity
        style={styles.touchableExpand}
        onPress={handleBack}
        activeOpacity={1}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <View style={styles.scrollArea} pointerEvents="box-none">
            <Animated.View
              style={[styles.formMain, { transform: [{ translateY }] }]}
              onStartShouldSetResponder={() => true}
            >
              {/* Header row */}
              <View style={styles.header}>
                <View style={styles.headerPill} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleBack}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Inputs */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Heading (Optional)"
                  placeholderTextColor="rgba(80, 30, 60, 0.45)"
                  style={[styles.input, styles.headingInput]}
                  value={heading}
                  onChangeText={setHeading}
                  returnKeyType="next"
                />
                <TextInput
                  placeholder="Message (Required)"
                  placeholderTextColor="rgba(80, 30, 60, 0.45)"
                  style={[styles.input, styles.messageInput]}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  textAlignVertical="top"
                  returnKeyType="done"
                />
              </View>

              {/* Color Button Row */}
              {/* <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {colorSelectionPallet.map((item, i) => {
                  return (
                    <View
                      style={{
                        backgroundColor: item,
                        aspectRatio: 1,
                        height: 30,
                        borderRadius: 50,
                      }}
                    ></View>
                  );
                })}
              </View> */}

              {/* Action button */}
              <View style={styles.buttonRow}>
                <CustomButton
                  title={buttonText}
                  onPress={() => {
                    handleAdd();
                    handleBack();
                    triggerHapticByValue(4);
                  }}
                />
              </View>
            </Animated.View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const _borderRadious = 15;
const styles = StyleSheet.create({
  // KeyboardAvoidingView is absolutely positioned so it covers the full screen
  // and can shrink itself when the keyboard appears
  overlayWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  touchableExpand: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.88)",
  },
  scrollArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: OVERLAY_PADDING_TOP,
    paddingHorizontal: 0,
  },
  formMain: {
    backgroundColor: ACCENT,
    justifyContent: "space-between",

    width: "100%",
    height: verticalScale(350),

    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 28,
    paddingTop: 14,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
    paddingTop: 4,
  },
  headerPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(120, 40, 90, 0.3)",
  },
  closeButton: {
    width: 45,
    aspectRatio: 1,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 25,
    color: "rgba(80, 20, 55, 0.33)",
    fontWeight: "700",
    lineHeight: 18,
  },
  inputContainer: {
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.82)",

    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,

    fontSize: 15,
    color: "#2d1020",

    borderWidth: 1.5,
    borderColor: "rgba(200, 130, 175, 0.5)",
    shadowColor: "rgba(180, 80, 130, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  headingInput: {
    width: "100%",
    height: verticalScale(60),
    fontSize: 26,
    fontWeight: 700,

    borderTopRightRadius: _borderRadious,
    borderTopLeftRadius: _borderRadious,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  messageInput: {
    width: "99.1%",
    minHeight: verticalScale(100),
    maxHeight: verticalScale(130),

    fontSize: 20,
    fontWeight: 400,

    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomRightRadius: _borderRadious,
    borderBottomLeftRadius: _borderRadious,
  },
  buttonRow: {
    width: "100%",
  },
});

const styles2 = StyleSheet.create({});

export default Form;
