import express from "express";

import {
  createStatus,
  getStatus,
  updateStatus,
} from "../controllers/statusControllers";
import requireAuth from "../middleware/requireAuth";

const status = express.Router();

status.get("/:id", getStatus);

status.post("/", createStatus);

status.patch("/:id", updateStatus);

export default status;
