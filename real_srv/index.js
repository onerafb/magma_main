import express from "express";
import { config } from "dotenv";
import { connectDB } from "./utils/db.js";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user_route.js";
import authRouter from "./routes/auth_route.js";
import listingRouter from "./routes/listing_route.js";
//!init
config({
  path: "./.env",
});
const app = express();
const __dirname = path.resolve();

//!middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
//!Calls
connectDB();
app.use(express.static(path.join(__dirname, "/real_cln/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "real_cln", "dist", "index.html"));
});

//! route
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
//!error middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
//!listen
app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
