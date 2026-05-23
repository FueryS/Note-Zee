import * as SQLite from "expo-sqlite";
// I will be using SQLite for data storage as using the json would cause the read-write overhead

// Open (or create) the database file
const db = SQLite.openDatabaseSync("notes.db");

// Revision notes:
// The opeDatabasesync() creates a data base if dont exist or opens if it already exist
//          we studies this in the 2nd and 3rd Sem DBMS.
//          remember the querries itself r not case sensitive but the names of the entries are
//          We are using an Enum.

export const NoteManager = {
  // INITIALIZE: Create the table if it doesn't exist

  // Call this when the app is opened in an useEffect hook
  //   PRAGMA journal_mode = WAL; will allow multiple process to read the database while one is writing
  initialize: async () => {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY NOT NULL,
        headding TEXT, 
        message TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);
  },

  // CREATE: Insert a single new row
  addNote: async (headding, message) => {
    // toISOString() is used to make it favourable for the sqlite by making it is "lexicographically sortable"
    const date = new Date().toISOString();

    // Gotta remember that you can actually use paranthesis to inset
    // multiple values at the same time I totally forgot

    const heading = headding ? headding : date.split("T")[0]; // If there is no headding just have the date as headding

    const result = await db.runAsync(
      "INSERT INTO notes (headding, message, date) VALUES (?, ?, ?);",
      [heading, message, date],
    );
    return result.lastInsertRowId; // Returns the new ID, past of sqlite engines return statement
  },

  // Get all notes

  // Currently it just returns the whole table which can be a problem if I aim to store 10's of thausands
  // of Notes so remember to mention it in the docs

  getNotes: async () => {
    return await db.getAllAsync("SELECT * FROM notes;");
  },

  // Modify only one specific row
  updateNote: async (id, headding, newMessage) => {
    // console.log("Message is attempted to be updated");
    const date = new Date().toISOString(); // There is no way I spent 3 hours in debugging because I forgot to add const here
    const heading = headding ? headding : date;

    // Please remember the syntax of the querry, its different from INSERT INTO querry
    await db.runAsync(
      "UPDATE notes SET headding = ?, message = ?, date = ? WHERE id = ?;",
      [heading, newMessage, date, id],
    );
    // console.log("Message should be updated");
    return db.getFirstAsync("SELECT * FROM notes WHERE id =?", [id]);
  },

  // DELETE: Remove only one specific row
  deleteNote: async (id) => {
    await db.runAsync("DELETE FROM notes WHERE id = ?;", [id]);
  },
};
