/* eslint-disable indent */
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// // eslint-disable-next-line import/no-named-default
// import { default as connectMongoDBSession } from "connect-mongodb-session";
// import indexRouter from "./routes/index.js";
// import { connectToDB } from "./utils.js";

// mongoose.set("strictQuery", false);
// const MongoDBStore = connectMongoDBSession(session);
// dotenv.config();
// const store = new MongoDBStore({
//     uri: "mongodb+srv://user:user@cluster0.kctlxex.mongodb.net/?retryWrites=true&w=majority",
//     collection: "mySessions"
// });
// const app = express();
// const port = process.env.PORT || 8000;
// app.use(bodyParser.json());
// // app.use(cors());
// const corsOptions = {
//     origin: [
//         "http://localhost:8000",
//         "http://localhost:3000",
//         "https://test-nursing-sem4.netlify.app"
//     ], // Replace with your frontend's URL
//     optionsSuccessStatus: 200,
//     credentials: true
// };

// app.use(cors(corsOptions));

// app.use(cookieParser());
// app.set("trust proxy", 1);
// app.use(
//     session({
//         proxy: true,
//         name: "universityNursing",
//         secret: "drthrthvfr",
//         saveUninitialized: true,
//         resave: true,

//         cookie: {
//             httpOnly: true,
//             secure: true,
//             maxAge: 1000 * 60 * 60 * 48,
//             sameSite: "none"
//         }
//     // store: store,
//     })
// );

// app.use("/", indexRouter);

// (async function init() {
//     try {
//         await connectToDB();
//         app.listen(port, () => console.log(`Server is listening on port ${port}`));
//     } catch (err) {
//         console.warn(err);
//     }
// }());

/* eslint-disable spaced-comment */
/* eslint-disable no-multiple-empty-lines */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import { connectToDB } from "./utils.js";
import indexRouter from "./routes/index.js";

mongoose.set("strictQuery", false);

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
app.use(bodyParser.json());
// app.use(cors());
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], // Replace with your frontend's URL
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(
  session({
    secret: "drthrthvfr",
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: true, // Set to true if using https, else set to false
      httpOnly: true, // Prevents client-side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24 // one day
    },
  })
);

//Changed the session process...
app.use("/", indexRouter);

(async function init() {
  try {
    await connectToDB();
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (err) {
    console.warn(err);
  }
}());
