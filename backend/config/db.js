const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/coinpulse");
    await mongoose.connect("mongodb+srv://ramveermeena2003_db_user:is8Y3pQg4AIewPHy@cluster0.nq1zxpo.mongodb.net/?appName=Cluster0/coinpulse");
    

    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;