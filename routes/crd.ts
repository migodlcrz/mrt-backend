import express from "express";
import {
  getCard,
  getCards,
  createCard,
  deleteCard,
  updateCard,
  tapIn,
  tapOut,
  addBalance,
  getCardsMobile,
} from "../controllers/crdControllers";
import requireAuth from "../middleware/requireAuth";

const crd = express.Router();

crd.get("/", getCards);

crd.get("/one/:id", getCard);

crd.post("/mobile/get", getCardsMobile);

crd.post("/", requireAuth, createCard);

crd.delete("/:id", requireAuth, deleteCard);

crd.patch("/:id", requireAuth, updateCard);

crd.patch("/add/:id", addBalance);

crd.patch("/in/:id", tapIn);

crd.patch("/out/:id", tapOut);

crd.get("/checkToken", requireAuth, getCards);

export default crd;
