import express from "express";

import { createStatus, updateStatus } from "../controllers/statusControllers";
import requireAuth from "../middleware/requireAuth";

const status = express.Router();

status.post("/", createStatus);

status.patch("/:id", updateStatus);

export default status;
