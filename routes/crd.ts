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

// crd.post("/", requireAuth, createCard);
crd.post("/", createCard);

crd.delete("/:id", deleteCard);

// crd.patch("/:id", requireAuth, updateCard);
crd.patch("/:id", updateCard);

crd.patch("/add/:id", addBalance);

crd.post("/in", tapIn);

crd.post("/out", tapOut);

crd.get("/checkToken", requireAuth, getCards);

export default crd;
