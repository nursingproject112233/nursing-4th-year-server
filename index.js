import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./utils.js";
import indexRouter from "./routes/index.js";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import { default as connectMongoDBSession } from "connect-mongodb-session";

mongoose.set("strictQuery", false);
const MongoDBStore = connectMongoDBSession(session);
dotenv.config();
var store = new MongoDBStore({
  uri: "mongodb+srv://user:user@cluster0.kctlxex.mongodb.net/?retryWrites=true&w=majority",
  collection: "mySessions",
});
const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
// app.use(cors());
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://test-nursing-sem4.netlify.app",
  ], // Replace with your frontend's URL
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    proxy: true,
    name: "universityNursing",
    secret: "drthrthvfr",
    saveUninitialized: true,
    resave: true,

    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 48,
      sameSite: "none",
    },
    // store: store,
  })
);

app.use("", indexRouter);

(async function init() {
  try {
    await connectToDB();
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.warn(err);
  }
})();
