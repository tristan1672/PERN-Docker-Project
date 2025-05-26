import sqlite3 from "sqlite3";
sqlite3.verbose(); // Optional: for helpful console output during dev

const DB_PATH = "./src/database/device_state.db";

// Initialize and connect to the SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database:", DB_PATH);
  }
});

// Create the table for EdgeDeviceConfig if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS edge_device_config (
      name TEXT NOT NULL UNIQUE,
      view TEXT,
      eventType TEXT,
      value1 TEXT,
      value2 TEXT,
      backendUrl TEXT,
      topic TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

// EdgeDeviceConfig interface for type safety
export interface EdgeDeviceConfig {
  name: string;
  view: string;
  eventType: string;
  value1: string;
  value2: string;
  backendUrl: string;
  topic: string;
}

export const constructEdgeDeviceConfig = (
  input: Partial<EdgeDeviceConfig>
): EdgeDeviceConfig => {
  const { name, view, eventType, value1, value2, backendUrl, topic } = input;

  const finalValue1 = value1 || "*";
  const finalValue2 = value2 || "*";

  return {
    name: name || "Unnamed Device",
    view: view || "default",
    eventType: eventType || "event",
    value1: finalValue1,
    value2: finalValue2,
    backendUrl: backendUrl || "",
    topic:
      topic ||
      `scene.${eventType || "event"}.updated.${finalValue1}.${finalValue2}`,
  };
};

// Insert or update an EdgeDeviceConfig entry
export const upsertDeviceConfig = (config: EdgeDeviceConfig): void => {
  const sql = `
    INSERT INTO edge_device_config (name, view, eventType, value1, value2, backendUrl, topic)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET
      name = excluded.name,
      view = excluded.view,
      eventType = excluded.eventType,
      value1 = excluded.value1,
      value2 = excluded.value2,
      backendUrl = excluded.backendUrl,
      topic = excluded.topic,
      updated_at = CURRENT_TIMESTAMP;
  `;

  db.run(
    sql,
    [
      config.name,
      config.view,
      config.eventType,
      config.value1,
      config.value2,
      config.backendUrl,
      config.topic,
    ],
    (err) => {
      if (err) {
        console.error("Failed to upsert device config:", err.message);
      }
    }
  );
};

// Retrieve a device config by Name
export const getDeviceConfigByName = (
  name: string,
  callback: (config: EdgeDeviceConfig | null) => void
): void => {
  const sql = `SELECT * FROM edge_device_config WHERE name = ?`;
  db.get(sql, [name], (err, row) => {
    if (err) {
      console.error("Failed to fetch device config:", err.message);
      callback(null);
    } else {
      callback(row ? (row as EdgeDeviceConfig) : null);
    }
  });
};

// Optionally: get all device configs
export const getAllDeviceConfigs = (
  callback: (configs: EdgeDeviceConfig[]) => void
): void => {
  db.all(`SELECT * FROM edge_device_config`, [], (err, rows) => {
    if (err) {
      console.error("Failed to fetch all device configs:", err.message);
      callback([]);
    } else {
      callback(rows as EdgeDeviceConfig[]);
    }
  });
};

export default db;
