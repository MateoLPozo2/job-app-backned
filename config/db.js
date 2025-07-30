// config/db.js
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; 
    console.log("[DEBUG] MONGO_URI:", uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;