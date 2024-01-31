import Station from "../models/stnModel";
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
  const { name, long, lat, connection } = req.body;

  try {
    // Create the station
    const station = await Station.create({
      name,
      long,
      lat,
      connection,
    });

    if (connection && connection.length > 0) {
      await Promise.all(
        connection.map(async (connectedStationId: string) => {
          try {
            const connectedStation = await Station.findById(connectedStationId);

            if (connectedStation) {
              connectedStation.connection.push(station._id);
              await connectedStation.save();
            }
          } catch (error) {
            console.error(
              `Error updating connections for station ${connectedStationId}: ${error}`
            );
          }
        })
      );
    }

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

  const { connections, ...updatedData } = req.body;

  try {
    const station = await Station.findById(id);

    if (!station) {
      return res.status(404).json({ error: "Station does not exist." });
    }

    // Remove this station from connections of other stations
    const stationsToUpdate = await Station.find({
      _id: { $in: station.connection },
    });

    for (const connectedStation of stationsToUpdate) {
      connectedStation.connection = connectedStation.connection.filter(
        (conn) => conn !== id
      );
      await connectedStation.save();
    }

    // Update the station with new data
    station.set(updatedData);
    await station.save();

    // Update connections for the updated station
    const stationsToUpdateUpdated = await Station.find({
      _id: { $in: station.connection },
    });

    for (const connectedStation of stationsToUpdateUpdated) {
      connectedStation.connection.push(station._id);
      await connectedStation.save();
    }

    res.status(200).json(station);
  } catch (error) {
    console.error("Error updating station:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteStation = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID input." });
  }

  try {
    // Find the station to be deleted
    const station = await Station.findOne({ _id: id });

    if (!station) {
      return res.status(404).send({ error: "Station not found." });
    }

    // Remove the connections to the station from other stations
    await Station.updateMany(
      { connection: { $in: [id] } },
      { $pull: { connection: id } }
    );

    // Delete the station
    await Station.deleteOne({ _id: station._id });

    res.status(200).json(station);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};
