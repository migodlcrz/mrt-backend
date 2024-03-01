import express from "express";
import { calculatePath } from "../controllers/pathController";

const path = express.Router();

path.post("/", calculatePath);

export default path;
