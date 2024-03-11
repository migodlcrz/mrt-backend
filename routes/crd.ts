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
  findFromUID,
} from "../controllers/crdControllers";
import requireAuth from "../middleware/requireAuth";

const crd = express.Router();

crd.get("/", getCards);

crd.get("/one/:id", getCard);

crd.post("/mobile/get", getCardsMobile);

crd.post("/", requireAuth, createCard);

crd.delete("/:id", requireAuth, deleteCard);

crd.patch("/:id", requireAuth, updateCard);

crd.patch("/add/:id", requireAuth, addBalance);

crd.post("/in", tapIn);

crd.post("/out", tapOut);

crd.get("/checkToken", getCards);

crd.post("/findID", findFromUID);

export default crd;
