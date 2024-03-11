import express from "express";
import requireAuth from "../middleware/requireAuth";

import {
  getFares,
  createFare,
  getFare,
  updateFare,
} from "../controllers/frControllers";
const fr = express.Router();

fr.get("/tap", getFares);
fr.get("/:id", getFare);
fr.post("/", requireAuth, createFare);
fr.patch("/:id", requireAuth, updateFare);

export default fr;
