import { createClient } from "redis";

const client = createClient({});

// Handle errors
client.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

// Connect only once
await client.connect();
export { client };
