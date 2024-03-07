import { errorMonitor } from "events";
import Status from "../models/statusModel";
import Card from "../models/crdModel";
import Station from "../models/stnModel";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const getStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  const status = await Status.findById(id);

  if (!status) {
    return res.status(404).json({ error: "Card does not exist." });
  }

  res.status(200).json(status);
};

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
  const { isDeployed } = req.body;

  const cards = await Card.find({}, "isTap");
  const stations = await Station.find({}, "connection");

  if (isDeployed === false) {
    const hasTrueIsTap = cards.some((card) => card.isTap === true);
    if (hasTrueIsTap) {
      return res.status(400).json({
        error: "Cannot go to maintenance if there are tapped cards",
      });
    }
  }

  if (isDeployed === true) {
    const hasStationsWithNoConnection = stations.some(
      (station) => station.connection.length === 0
    );
    if (hasStationsWithNoConnection) {
      return res.status(400).json({
        error: "Cannot proceed if there are stations with no connections",
      });
    }
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID input." });
  }

  const status = await Status.findOneAndUpdate(
    { _id: id },
    { isDeployed: isDeployed }
  );

  if (!status) {
    return res.status(404).json({ error: "Status edit not allowed." });
  }

  res.status(200).json(status);
};
