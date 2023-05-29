let store;

if (process.env.NODE_ENV === "production") {
  store = new Map();
} else {
  // If the store does not exist, initialize it
  if (!global.store) {
    global.store = new Map();
  }
  store = global.store;
}

export { store };
