import Fare from "../models/fareModel";
import { Request, Response } from "express";
import mongoose, { mongo } from "mongoose";

export const getFares = async (req: Request, res: Response) => {
  const fare = await Fare.find({}).sort({ createdAt: -1 });
  res.status(200).json(fare);
};

export const getFare = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("The provided ID was not valid.");
  }

  const fare = await Fare.findById(id);

  if (!fare) {
    return res.status(404).json({ error: "No Fare exists." });
  }

  res.status(200).json(fare);
};

export const createFare = async (req: Request, res: Response) => {
  const { minimumAmount, perKM } = req.body;

  try {
    const fare = await Fare.create({
      minimumAmount,
      perKM,
    });

    res.status(200).json(fare);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateFare = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("The provided ID was not valid.");
  }

  const fare = await Fare.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!fare) {
    return res.status(404).json({ error: "Fare does not exist." });
  }
  res.status(200).json(fare);
};
