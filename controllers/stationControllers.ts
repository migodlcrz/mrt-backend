import Station from "../models/stationModel";
import { Request, Response } from "express";
import mongoose, { mongo } from "mongoose";

export const getStations = async (req: Request, res: Response) => {
  const stations = await Station.find({}).sort({ createdAt: -1 });
  res.status(200).json(stations);
};

export const getStation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ error: "Invalid ID input." });
  }

  const station = await Station.findById(id);

  if (!station) {
    res.status(404).json({ error: "Station does not exist" });
  }

  res.status(200).json(station);
};

export const createStation = async (req: Request, res: Response) => {
  const { uid, name, long, lat } = req.body;

  try {
    const station = await Station.create({
      uid,
      name,
      long,
      lat,
    });

    res.status(200).json(station);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const updateStation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID input." });
  }

  const station = await Station.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!station) {
    return res.status(404).json({ error: "Station does not exist." });
  }

  res.status(200).json(station);
};

export const deleteStation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID input." });
  }

  const station = await Station.findOneAndDelete({ _id: id });

  if (!station) {
    return res.status(404).send({ error: "User not found." });
  }

  res.status(200).json(station);
};
