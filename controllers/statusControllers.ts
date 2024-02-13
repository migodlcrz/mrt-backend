import { errorMonitor } from "events";
import Status from "../models/statusModel";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createStatus = async (req: Request, res: Response) => {
  const { isDeployed } = req.body;

  try {
    const status = await Status.create({
      isDeployed,
    });

    return res.status(200).json(status);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID input." });
  }

  const { isDeployed } = req.body;

  const status = await Status.findOneAndUpdate(
    { _id: id },
    { isDeployed: isDeployed }
  );

  if (!status) {
    return res.status(404).json({ error: "Status edit not allowed." });
  }

  res.status(200).json(status);
};
