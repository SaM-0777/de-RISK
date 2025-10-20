/* eslint-disable @typescript-eslint/no-unused-vars */
import { redis } from "@/redis";

export async function getCacheValue(key: string) {
  try {
    const data = await redis.get(key);
    return data;
  } catch (error) {
    return null;
  }
}

export async function setCacheValue(
  key: string,
  value: unknown,
  ttl: number = 86400
) {
  try {
    await redis.setex(key, ttl, value);
    return true;
  } catch (error) {
    return false;
  }
}
