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

// stn.get("/:id", requireAuth, getStation);
stn.get("/:id", getStation);

// stn.post("/", requireAuth, createStation);
stn.post("/", createStation);

// stn.delete("/:id", requireAuth, deleteStation);
stn.delete("/:id", deleteStation);

// stn.patch("/:id", requireAuth, updateStation);
stn.patch("/:id", updateStation);

export default stn;
