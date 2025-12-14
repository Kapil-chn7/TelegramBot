import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { configDotenv } from "dotenv";
import { client } from "./client/redis-client.js";

import { createRedisEntry } from "./utility/CommonUtil.js";

configDotenv();

// Init Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN);

// Setup AWS S3 v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

// Cache for album photos (webhook compatible)
const albumCache = new Map();

//triggering

export async function getAllUserMessages(msg) {
  try {
    const userId = msg.from.id;

    // Redis key for this user
    const redisKey = `user:${userId}`;

    // Check if user exists
    const exists = await client.exists(redisKey);

    if (!exists) {
      createRedisEntry(client);
    }

    if (!msg.message) {
      return "Error";
    }
    const text = msg.caption || msg.text || null;

    if (text != null) {
      //we got text
      let textArray = JSON.parse(await client.hGet(redisKey, "text"));
      textArray.push("Hello world!");
      await client.hSet(redisKey, "text", JSON.stringify(textArray));
    } else if (msg.photo && msg.photo.length > 0) {
      //we got image
    } else {
      console.log("We are not handling it ");
      return "Error";
    }
  } catch (e) {
    console.log("Something went wrong in getAllUserMessages " + e);
  }
}

export async function processTelegramUpdate(update) {
  console.log("Staring process telegram update");

  const userId = msg.from.id;

  // Redis key for this user
  const redisKey = `user:${userId}`;

  // Check if user exists
  const exists = await client.exists(redisKey);

  if (!exists) {
    console.log(`⚠️ User ${userId} does NOT exist in Redis — creating entry`);

    // Default structure
    const defaultValue = {
      text: "",
      images: [],
    };

    await client.hSet(redisKey, defaultValue);
    await client.expire(redisKey, 300);
  }
  if (!update.message) return;

  const msg = update.message;
  const chatId = msg.chat.id;
  const text = msg.caption || msg.text || null;
  const imageLinks = [];

  // ---- TEXT ONLY ----
  if (!msg.photo) {
    if (!text) return bot.sendMessage(chatId, "Send text or images.");

    //await axios.post(process.env.BACKEND_URL, { text });
    return bot.sendMessage(chatId, "📤 Text sent to backend.");
  }

  try {
    await bot.sendMessage(chatId, "📁 Uploading media...");

    let photos = [];

    // Album support (webhook-safe)
    if (msg.media_group_id) {
      const groupId = msg.media_group_id;

      // Store message segment
      const entries = albumCache.get(groupId) || [];
      entries.push(msg);
      albumCache.set(groupId, entries);

      // Wait 500ms to ensure Telegram finishes sending album parts
      await new Promise((res) => setTimeout(res, 500));

      photos = albumCache.get(groupId)?.map((m) => m.photo) || [];

      // Cleanup cache once album handled
      albumCache.delete(groupId);
    } else {
      // Single photo
      photos = [msg.photo];
    }

    for (const resolutions of photos) {
      const fileId = resolutions[resolutions.length - 1].file_id;
      const fileUrl = await bot.getFileLink(fileId);
      console.log("file id is ", fileId, " ", fileUrl);

      //const fileData = (await axios.get(fileUrl, { responseType: "arraybuffer" })).data;

      const key = `telegram/${Date.now()}_${chatId}.jpg`;

      // Upload using AWS SDK v3
      // await s3.send(
      //   new PutObjectCommand({
      //     Bucket: process.env.S3_BUCKET,
      //     Key: key,
      //     Body: fileData,
      //     ContentType: "image/jpeg",
      //   })
      // );

      //imageLinks.push(`https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`);
    }

    // Send to backend
    // await axios.post(process.env.BACKEND_URL, {
    //   text: text || "",
    //   images: imageLinks,
    // });

    return bot.sendMessage(chatId, `✅ Uploaded ${imageLinks.length} file(s).`);
  } catch (err) {
    console.error(err);
    await bot.sendMessage(chatId, "⚠️ Error while processing images.");
    throw err;
  }
}
