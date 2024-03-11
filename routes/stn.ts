import express from "express";

import {
  getStations,
  getStation,
  createStation,
  deleteStation,
  updateStation,
} from "../controllers/stnControllers";
import requireAuth from "../middleware/requireAuth";

const stn = express.Router();

stn.get("/tap", getStations);

stn.get("/tap/:id", getStation);

stn.get("/", getStations);

stn.get("/:id", requireAuth, getStation);

stn.post("/", requireAuth, createStation);

stn.delete("/:id", requireAuth, deleteStation);

stn.patch("/:id", requireAuth, updateStation);
export default stn;
