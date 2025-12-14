export async function createRedisEntry(client) {
  try {
    console.log(`⚠️ User ${userId} does NOT exist in Redis — creating entry`);
    await client.hSet(redisKey, {
      text: JSON.stringify([]),
      images: JSON.stringify([]),
    });
    await client.expire(redisKey, 300);
  } catch (e) {
    console.log("Error happened during redis entry creation " + e);
  }
}
