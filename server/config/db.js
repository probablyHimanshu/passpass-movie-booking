import mongoose from 'mongoose';

const connectDB = async () => {
  let mongoURI = process.env.MONGO_URI;
  if (!mongoURI || mongoURI.includes('your_connection_string_here')) {
    mongoURI = 'mongodb://127.0.0.1:27017/eticket_db';
  }
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
