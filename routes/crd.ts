import express from "express";
import {
  getCard,
  getCards,
  createCard,
  deleteCard,
  updateCard,
  tapIn,
} from "../controllers/crdControllers";
import requireAuth from "../middleware/requireAuth";

const crd = express.Router();

crd.get("/", getCards);

crd.get("/one/:id", getCard);

crd.post("/", requireAuth, createCard);

crd.delete("/:id", requireAuth, deleteCard);

crd.patch("/:id", requireAuth, updateCard);

crd.patch("/in/:id", tapIn);

export default crd;
