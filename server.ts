import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cardRoutes from "./routes/cards";
import stationRoutes from "./routes/stations";
import fareRoutes from "./routes/fare";
import userRoutes from "./routes/user";
import mongoose from "mongoose";

// express app
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/cards", cardRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/fare", fareRoutes);
app.use("/api/users", userRoutes);

// connect to db
const mongoUri = process.env.MONGO;
if (!mongoUri) {
  console.error(
    "MongoDB connection string is missing in the environment variables."
  );
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log(
        `Database and server is running on http://localhost:${process.env.PORT}/`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
