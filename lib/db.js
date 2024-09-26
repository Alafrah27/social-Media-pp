import mongoose from "mongoose";
// const mongoURL = process.env.MONGODB;
const mongoURL = process.env.MONGODBURL;
mongoose.connect(mongoURL);
// mongoose.connect(MONGODB);
const db = mongoose.connection;

db.on("connected", () => {
  console.log("conected to mongo sever ");
});

db.on("error", () => {
  console.log("mongo connection error ", error);
});

db.on("disconnected", () => {
  console.log("mongo disconnected ");
});

export default db;
