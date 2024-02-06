import express from "express";

import {
  getFares,
  createFare,
  getFare,
  updateFare,
} from "../controllers/frControllers";
const fr = express.Router();

fr.get("/tap", getFares);
fr.get("/:id", getFare);
fr.post("/", createFare);
fr.patch("/:id", updateFare);

export default fr;
