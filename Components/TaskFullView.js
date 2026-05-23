import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export default function InfoPopup({
  visible,
  onClose,
  infoData,
  handleUpdate,
}) {
  return (
    // This is used for that scroll animation cant explain in words how it functions but it works,
    // I will have to switch to more modern version for
    // Future projects
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Outer container that holds both layers */}
      <View style={styles.overlay}>
        {/* Using absoluteFill so it covers the remaining backGround of the infopop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* This stores the main area that I see */}
        <ScrollView
          style={styles.popupContainer}
          bounces={true}
          showsVerticalScrollIndicator={false}
        >
          {/* Heading , Date and Edit */}
          <View style={styles.handle}>
            {/* Headding: using  scroll view due to a big I was facing when the heading size was very big */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width: "45%" }}
            >
              <Text style={styles.title}>
                {infoData?.headding || "Information"}
              </Text>
            </ScrollView>
            <Text>{infoData?.date?.split("T")[0] ?? ""}</Text>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.6}
              onPress={handleUpdate}
            >
              <Text
                style={{ fontSize: 20, fontWeight: 800, color: "#9b7598f7" }}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.body}>
            {infoData?.message || "More details go here..."}
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    paddingTop: verticalScale(300),
  },
  popupContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "100%",
  },
  handle: {
    width: "100%",
    backgroundColor: "#ffcdf2",

    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    alignSelf: "center",
    marginBottom: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: verticalScale(70),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,

    textAlign: "left",
  },
  body: {
    fontSize: 16,
    color: "#444",
    paddingHorizontal: 6,
    textAlign: "justify",
  },
  editButton: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffcdcd",
    borderTopEndRadius: 15,
    paddingHorizontal: scale(10),
    marginLeft: scale(8),
  },
});
