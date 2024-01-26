import express from "express";
import {
  getCard,
  getCards,
  createCard,
  deleteCard,
  updateCard,
} from "../controllers/cardControllers";
import requireAuth from "../middleware/requireAuth";

const crd = express.Router();

crd.get("/tap", getCards);

crd.get("/tap/:id", getCard);

crd.get("/", requireAuth, getCards);

crd.get("/:id", requireAuth, getCard);

crd.post("/", requireAuth, createCard);

crd.delete("/:id", requireAuth, deleteCard);

crd.patch("/:id", requireAuth, updateCard);

export default crd;
