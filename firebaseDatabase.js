import { ref, set, get, child, remove } from "firebase/database";
import { database, getCurrentUser } from "./firebase";

export const saveSearch = async (input, response) => {
  try {
    const user = await getCurrentUser();
    const userId = user.uid;
    const searchId = Date.now().toString();
    await set(ref(database, `searches/${userId}/${searchId}`), {
      id: searchId,
      input,
      response,
    });
  } catch (error) {
    console.error("Error saving search:", error);
  }
};

export const fetchSearchHistory = async (setHistory) => {
  try {
    const user = await getCurrentUser();
    const userId = user.uid;
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `searches/${userId}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      const historyArray = Object.keys(data).map((key) => data[key]);
      setHistory(historyArray);
    } else {
      setHistory([]);
    }
  } catch (error) {
    console.error("Error fetching search history:", error);
    setHistory([]);
  }
};

export const deleteSearch = async (id) => {
  try {
    const user = await getCurrentUser();
    const userId = user.uid;
    await remove(ref(database, `searches/${userId}/${id}`));
  } catch (error) {
    console.error("Error deleting search:", error);
  }
};