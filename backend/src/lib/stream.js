import { StreamChat } from "stream-chat";
import "dotenv/config";

// Environment Variables
const apiKey = process.env.GETSTREAM_KEY;
const apiSecret = process.env.GETSTREAM_PASS;

// Basic check
if (!apiKey || !apiSecret) {
  console.error("Missing Stream API credentials.");
  process.exit(1);
}

// Initialize Stream client
const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  if (!userData) {
    throw new Error("Missing required user data");
  }

  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("❌ Error upserting Stream user:", error.message);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
