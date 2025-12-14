// dev-server.js
import express from "express";
import { getAllUserMessages } from "./bot.js";

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    //
    await getAllUserMessages(req.body);
    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(200).send("Error");
  }
});
app.get("/", (req, res) => {
  res.send("Webhook server is running 🚀");
});

app.listen(3000, () => console.log("🚀 Local server running on port 3000"));
