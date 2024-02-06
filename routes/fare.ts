import express from "express";

import {
  getFares,
  getFare,
  updateFare,
  createFare,
} from "../controllers/fareController";
import requireAuth from "../middleware/requireAuth";

const fare = express.Router();

fare.get("/", getFares);

fare.get("/:id", getFare);

fare.post("/", requireAuth, createFare);

fare.patch("/:id", requireAuth, updateFare);

export default fare;
