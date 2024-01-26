import express from "express";
import { loginUser, createUser } from "../controllers/userControllers";

const user = express.Router();

user.post("/login", loginUser);

user.post("/create", createUser);

export default user;
