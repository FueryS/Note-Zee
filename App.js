import React, { useState, useEffect } from "react";

import CustomButton from "./Components/UI/CustomButton.js";
import Form from "./Components/Form.tsx";
import TaskFullView from "./Components/TaskFullView.js";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

import { NoteManager } from "./Services/NoteManager.js";
import { SafeAreaView } from "react-native-safe-area-context";
import { verticalScale } from "react-native-size-matters";

export default function App() {
  // a.  Handelling UI

  const [showForm, setShowForm] = useState(false);
  const [showPop, setShowPop] = useState(false);

  const [popMessage, setPopMessage] = useState({});

  const onTap = (id) => {
    setShowPop(true);
    const i = index.indexOf(id);
    setPopMessage(notes[i]);
  };

  const onSaveNote = () => {
    if (updatingFlag) {
      performUpdate(popMessage.id);
      console.log("Update was perfromed");
    } else handleAdd();
  };

  // b. API functions
  const [notes, setNotes] = useState([]);
  const [heading, setHeading] = useState();
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState([]);
  const [updatingFlag, setUpdatingFlag] = useState(false);

  // 0. Initialize DB and Load Notes on Start
  useEffect(() => {
    const setup = async () => {
      await NoteManager.initialize();
      loadNotes();
    };
    setup();
  }, []);

  const loadNotes = async () => {
    const data = await NoteManager.getNotes();
    const ids = data.map((element) => element.id);
    setIndex(ids);
    setNotes(data);
  };

  // 2. Handle Adding
  const handleAdd = async () => {
    if (!message) return Alert.alert("Error", "Message is required");
    await NoteManager.addNote(heading, message);
    setHeading("");
    setMessage("");
    loadNotes(); // Refresh list
  };

  // 3. Handle Deleting
  const handleDelete = async (id) => {
    await NoteManager.deleteNote(id);
    loadNotes(); // Refresh list
  };

  // 4. Handle Update
  const handleUpdate = async () => {
    setHeading(popMessage.headding);
    setMessage(popMessage.message);

    console.log("entered HandleUpdate");
    console.log(popMessage.id);

    setUpdatingFlag(true);
    setShowPop(false);
    setShowForm(true);
  };

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
          onClose={() => setShowForm(false)}
          handleAdd={onSaveNote}
          setHeading={setHeading}
          setMessage={setMessage}
        />
        <CustomButton
          title="Add Note"
          onPress={() => {
            setShowForm(true);
            setUpdatingFlag(false);
          }}
        />
        {/* Input Section */}

        {/* List Section */}
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteItem} onPress={onTap}>
              <Pressable
                style={styles.popUpButton}
                onPress={() => {
                  onTap(item.id);
                }}
              >
                <Text style={styles.noteHeading}>{item.headding}</Text>
                <Text>
                  {item.message.slice(0, 70)}
                  {item.message.length > 70 ? "........" : ""}
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
      <TaskFullView
        visible={showPop}
        onClose={() => {
          setShowPop(false);
        }}
        infoData={popMessage}
        handleUpdate={handleUpdate}
      />
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
