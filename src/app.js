import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js"; //routes

const app = express();
app.use(
  // use help to call specified middleware  //syntax--> app.use(path, callback)
  cors({
    //cross origin Resorce Sharing sequrity mechanism act as middleware prevent unauthorized access to resources
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//request accept practice

app.use(express.json({ limit: "25kb" })); //return object builtin middleware
app.use(express.urlencoded({ extended: true, limit: "25kb" }));
app.use(express.static("public"));
app.use(cookieParser()); //cookie stored at client side

//routes declearation

app.use("/api/v1/users", userRouter);

export { app };
