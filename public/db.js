let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  const db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = (event) => {
  // log error here
  console.log("Woops! " + event.target.errorCode);
};

const storeData = record => {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    pendingStore.add(record);
}