import mongoose from "mongoose";
import User from "../models/user.model.js";

const removeLegacyUserIndexes = async () => {
  const indexes = await User.collection.indexes();
  const legacyLocationIndex = indexes.find(
    (index) => index.key?.location === "2dsphere"
  );

  if (legacyLocationIndex) {
    await User.collection.dropIndex(legacyLocationIndex.name);
    console.log(`Dropped legacy users index: ${legacyLocationIndex.name}`);
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(mongoUri);
    await removeLegacyUserIndexes();

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("Database Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
