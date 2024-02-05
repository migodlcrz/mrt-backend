import Card from "../models/crdModel";
import { Request, Response } from "express";
import mongoose from "mongoose";

//TAP IN card
export const tapIn = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  const card = await Card.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!card) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  res.status(200).json(card);
};

//GET all cards
export const getCards = async (req: Request, res: Response) => {
  const cards = await Card.find({}).sort({ createdAt: -1 });

  res.status(200).json(cards);
};

//GET one card
export const getCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  const card = await Card.findById(id);

  if (!card) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  res.status(200).json(card);
};

//CREATE a card
export const createCard = async (req: Request, res: Response) => {
  const { uid, balance, isTap, in: inValue, out: outValue } = req.body;

  try {
    const card = await Card.create({
      uid,
      balance,
      in: inValue,
      out: outValue,
    });
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error });
  }
};

//UPDATE a card
export const updateCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  const card = await Card.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!card) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  res.status(200).json(card);
};

//DELETE a card
export const deleteCard = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid card ID." });
  }

  const card = await Card.findOneAndDelete({ _id: id });

  if (!card) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  res.status(200).json(card);
};

//ADD balance to card
export const addBalance = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  const { balance } = req.body;

  if (balance < 1) {
    return res.status(404).json({ error: "Balance cannot be negative." });
  }

  const card = await Card.findById(id);

  if (!card) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  if (card.balance + balance > 10000) {
    return res.status(404).json({ error: "Balance cannot exceed 10000." });
  }

  card.balance += balance;

  await card.save();

  res.status(200).json(card);
};
