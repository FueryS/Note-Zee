import React, { useState, useEffect } from "react";

import CustomButton from "./Components/UI/CustomButton.js";
import Form from "./Components/Form.tsx";
import TaskFullView from "./Components/TaskFullView.js";
import { triggerHapticByValue } from "./Services/HepticService.js";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

import { NoteManager } from "./Services/NoteManager.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";

// Trigger Heptic Note: add sound if you have time

export default function App() {
  // a.  Handelling UI

  const [showForm, setShowForm] = useState(false); // Flag to show the /Components/Form
  const [showPop, setShowPop] = useState(false); // Flag to show the /Components/TaskFullView

  const [popMessage, setPopMessage] = useState({}); // Chache of the popMessage shown in the /Components/TaskFullView

  // This onTap is used to load the value of flatList elements (note list)
  const onTap = (id) => {
    setShowPop(true);
    // Get the index position of this primarry key
    const i = index.indexOf(id);
    // Chache the curretn popMessage so we can use it incase of update
    setPopMessage(notes[i]);
  };

  // State switcher for update and save
  const onSaveNote = () => {
    if (updatingFlag) {
      performUpdate(popMessage.id);
    } else handleAdd();
  };

  // Handles update of the form
  const handleUpdate = async () => {
    // Load the popUpInfos values
    setHeading(popMessage.headding);
    setMessage(popMessage.message);

    triggerHapticByValue(5);
    setUpdatingFlag(true);
    setShowPop(false);
    setShowForm(true);
  };

  // Handles closing of the form
  const handleClose = () => {
    if (updatingFlag) {
      setHeading("");
      setMessage("");
    }
    setShowForm(false);
    triggerHapticByValue(5);
  };

  // b. API functions
  const [notes, setNotes] = useState([]); // Stores the notes : I feel bad about this cuz if theres like a 1000 notes It may cause overflow
  const [heading, setHeading] = useState(); // Stores the current headding which we have typed in the form
  const [message, setMessage] = useState(""); // Stores the curretn message in the form
  const [index, setIndex] = useState([]); // It keeps track of the indexes of each primarry key in notes
  const [updatingFlag, setUpdatingFlag] = useState(false); // Tells UI if the form is in update state or Save state

  // 0. Initialize DB and Load Notes on Start
  useEffect(() => {
    const setup = async () => {
      await NoteManager.initialize();
      loadNotes();
    };
    setup();
  }, []);

  // 1.LoadNotes
  const loadNotes = async () => {
    const data = await NoteManager.getNotes();
    const ids = data.map((element) => element.id);
    setIndex(ids);
    setNotes(data);
  };

  // 2. Handle Adding
  const handleAdd = async () => {
    if (!message) {
      (async () => {
        await triggerHapticByValue(5);
        setTimeout(async () => {
          await triggerHapticByValue(4);
        }, 50);
      })();
      return Alert.alert("Error", "Message is required"); // Alert user about the missing message as it will not be accepted by the database
    }
    await NoteManager.addNote(heading, message);
    setHeading("");
    setMessage("");
    loadNotes(); // Refresh list
  };

  // 3. Handle Deleting
  const handleDelete = async (id) => {
    await NoteManager.deleteNote(id);
    triggerHapticByValue(5);
    loadNotes(); // Refresh list
  };

  // 4. Handle Update

  const performUpdate = async (id) => {
    console.log("update was entered");
    await NoteManager.updateNote(id, heading, message);
    setHeading("");
    setMessage("");
    loadNotes();
    console.log("update was exited");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Note-Zee</Text>

        {/* {Custom section} */}
        <Form
          visible={showForm}
          heading={heading}
          message={message}
          buttonText={updatingFlag ? "Update" : "Save"}
          onClose={handleClose}
          handleAdd={onSaveNote}
          setHeading={setHeading}
          setMessage={setMessage}
        />
        <CustomButton
          title="Add Note"
          onPress={() => {
            setShowForm(true);
            setUpdatingFlag(false);
            triggerHapticByValue(3);
          }}
        />
        <TaskFullView
          visible={showPop}
          onClose={() => {
            setShowPop(false);
            triggerHapticByValue(1);
          }}
          infoData={popMessage}
          handleUpdate={handleUpdate}
        />

        {/* Input Section */}
        {/* Moved this to the Form.tsx in Components */}
        {/* List Section */}
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // Main Container
            <View style={styles.noteItem}>
              {/* Pressable for the infoPopUp; bug: the pressable dont cover the whole view in vertical: fixed: flase */}
              <Pressable
                style={styles.popUpButton}
                onPress={() => {
                  onTap(item.id);
                }}
              >
                <Text style={styles.noteHeading}>{item.headding}</Text>
                <Text>
                  {/* Bug: messages spanning multiple lines due to line break still increases as it dont increase the text count */}
                  {/* Bug is fixed by converting the line breaks into spaces so it can be counted and also properly displayed */}
                  {item.message.replace(/\n+/g, " ").slice(0, 70)}
                  {item.message.replace(/\n+/g, " ").length > 70
                    ? "........"
                    : ""}
                </Text>
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </Pressable>

              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: verticalScale(30),
    paddingHorizontal: 20,
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  noteItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3, // Shadow for Android
  },
  noteHeading: { fontWeight: "bold", fontSize: 16 },
  date: { fontSize: 10, color: "#888", marginTop: 5 },
  deleteText: { color: "red", fontWeight: "bold" },
  popUpButton: {
    flex: 1,
  },
});
