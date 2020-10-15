let db;
// db request for new budget database
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
  console.log("Woops! " + event.target.errorCode);
};

function storeData(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    pendingStore.add(record);
}

const checkDatabase = () => {
    const transaction = db.transaction(["pending"], "readwrite");
    const pendingStore = transaction.objectStore("pending");
    const getAll = pendingStore.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then(() => {
           
              const transaction = db.transaction(["pending"], "readwrite");
             
              const pendingStore = transaction.objectStore("pending");
      
              pendingStore.clear();
              
            });
        }
      };

    
};

window.addEventListener("online", checkDatabase);