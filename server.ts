import dotenv from "dotenv";
dotenv.config();

import express from "express";
import crdRoutes from "./routes/crd";
import stnRoutes from "./routes/stn";
import frRoutes from "./routes/fr";
import userRoutes from "./routes/user";
import statusRoute from "./routes/status";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";

// express app
const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/cards", crdRoutes);
app.use("/api/stations", stnRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fr", frRoutes);
app.use("/api/status", statusRoute);

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
