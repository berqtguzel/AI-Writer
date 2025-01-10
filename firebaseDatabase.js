import { database } from "./firebase";
import { ref, push, set, onValue, remove } from "firebase/database";

// Veri Yazma İşlevi
export const saveSearch = async (input, response) => {
  const searchRef = ref(database, "searches/");
  const newSearchRef = push(searchRef);

  await set(newSearchRef, {
    input,
    response,
    timestamp: Date.now(),
  });

  console.log("Arama kaydedildi!");
};

// Veri Okuma İşlevi
export const fetchSearchHistory = (callback) => {
  const searchRef = ref(database, "searches/");
  onValue(searchRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const history = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      callback(history);
    } else {
      callback([]);
    }
  });
};

// Veri Silme İşlevi
export const deleteSearch = async (id) => {
  const searchRef = ref(database, `searches/${id}`);
  await remove(searchRef);
  console.log("Arama silindi!");
};