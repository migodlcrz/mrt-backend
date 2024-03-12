import Card from "../models/crdModel";
import Fare from "../models/frModel";
import Station from "../models/stnModel";
import Status from "../models/statusModel";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { calculatePath } from "./pathController";

//GET all cards
export const getCards = async (req: Request, res: Response) => {
  const cards = await Card.find({}).sort({ createdAt: -1 });

  if (!cards) {
    res.status(400).json({ error: "No cards found" });
  }

  res.status(200).json(cards);
};

//GET one card
export const getCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Card does not exist." });
    }

    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).json({ error: "Card does not exist." });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ error: "INTERNAL ERROR" });
  }
};

//fetch data form mobile
export const getCardsMobile = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;
    if (!uid || !Array.isArray(uid) || uid.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or empty uidArray in the request body." });
    }
    const cards = await Card.find({ uid: { $in: uid } });

    if (cards.length === 0) {
      return res.status(404).json({ error: "No matching cards found." });
    }

    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//CREATE a card
export const createCard = async (req: Request, res: Response) => {
  try {
    const { uid, balance, isTap, mounted, in: inValue, history } = req.body;
    const existingCard = await Card.findOne({ uid });

    if (existingCard) {
      return res
        .status(400)
        .json({ error: "Card with the same uid already exists." });
    }

    const card = await Card.create({
      uid,
      balance,
      mounted,
      in: inValue,
      history,
    });

    res.status(200).json(card);
  } catch (error) {
    res.status(400).json("INTERNAL ERROR");
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

//TAPIN card
export const tapIn = async (req: Request, res: Response) => {
  try {
    const { enteredUID, stationStart } = req.body;
    const id = "65cb78bfe51a352d5ae51dd1";

    const cards = await Card.find({}).sort({ createdAt: -1 });
    const stations = await Station.find({}).sort({ createdAt: -1 });
    const fare = await Fare.find({}).sort({ createdAt: -1 });
    const status = await Status.findById(id);

    const matchingCard = cards.find((card) => card.uid === Number(enteredUID));
    const matchingStation = stations.find(
      (station) => station.name === String(stationStart)
    );

    if (status?.isDeployed === false) {
      return res
        .status(400)
        .json({ error: "Cannot tap in. Maintenance mode." });
    }

    if (!matchingCard) {
      return res.status(400).json({ error: "No matching card." });
    }

    if (!matchingStation) {
      return res.status(400).json({ error: "No matching station." });
    }

    if (matchingCard && fare) {
      if (matchingCard.balance < fare[0].minimumAmount) {
        return res.status(400).json({ error: "Insufficient balance." });
      }
    }

    if (matchingCard.isTap === true) {
      return res.status(400).json({ error: "Already tapped in!" });
    }

    const updatedCard = await Card.findOneAndUpdate(
      {
        _id: matchingCard._id,
        isTap: false,
      },
      {
        $set: {
          isTap: true,
          in: matchingStation._id,
        },
      },
      { new: true }
    );

    if (!updatedCard) {
      return res
        .status(400)
        .json({ error: "Card not found or already tapped!" });
    }
    return res.status(200).json({ message: "Card tapped successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

export const tapOut = async (req: Request, res: Response) => {
  try {
    const { enteredUID, stationEnd } = req.body;
    const id = "65cb78bfe51a352d5ae51dd1";

    const cards = await Card.find({}).sort({ createdAt: -1 });
    const stations = await Station.find({}).sort({ createdAt: -1 });
    const fare = await Fare.find({}).sort({ createdAt: -1 });
    const status = await Status.findById(id);

    if (!status?.isDeployed) {
      return res
        .status(400)
        .json({ error: "Cannot tap out. Maintenance mode." });
    }

    const matchingCard = cards.find((card) => card.uid === Number(enteredUID));
    const matchingStation = stations.find(
      (station) => station.name === String(stationEnd)
    );

    if (!matchingCard) {
      return res.status(400).json({ error: "No matching card." });
    }

    if (!matchingCard.isTap) {
      return res.status(400).json({ error: "Not tapped in" });
    }

    const stationStartId = new mongoose.Types.ObjectId(matchingCard.in);

    const stationStart = stations.find((station) =>
      station._id.equals(stationStartId)
    );

    if (!stationStart) {
      return res.status(400).json({ error: "Station start not found" });
    }

    if (!matchingStation) {
      return res.status(400).json({ error: "Station end not found" });
    }

    const result = await calculatePath(stationStart, matchingStation);

    if (result.error) {
      res.status(400).json({ error: "No path found" });
    }

    if (result.distance === 0) {
      await Card.findOneAndUpdate(
        {
          _id: matchingCard._id,
          isTap: true,
        },
        {
          $set: {
            isTap: false,
            in: null,
            balance: matchingCard.balance - fare[0].minimumAmount,
          },
          $push: {
            history: {
              in: stationStart.name,
              out: matchingStation.name,
              fare: Math.round(
                result.distance * fare[0].perKM + fare[0].minimumAmount
              ),
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({
        distance: result.distance,
        path: result.path,
        totalFare: fare[0].minimumAmount,
        initialBalance: matchingCard.balance,
        newBalance: matchingCard.balance - fare[0].minimumAmount,
        start: stationStart.name,
        end: stationEnd.name,
      });
    }

    if (result.distance && fare) {
      if (
        matchingCard.balance <
        Math.round(result.distance * fare[0].perKM + fare[0].minimumAmount)
      ) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
    }

    if (result.distance && fare) {
      if (
        matchingCard.balance <
        Math.round(result.distance * fare[0].perKM + fare[0].minimumAmount)
      ) {
        return res.status(400).json({ error: "Insufficient balance" });
      } else {
        await Card.findOneAndUpdate(
          {
            _id: matchingCard._id,
            isTap: true,
          },
          {
            $set: {
              isTap: false,
              in: null,
              balance:
                matchingCard.balance -
                Math.round(
                  result.distance * fare[0].perKM + fare[0].minimumAmount
                ),
            },
            $push: {
              history: {
                in: stationStart.name,
                out: matchingStation.name,
                fare: Math.round(
                  result.distance * fare[0].perKM + fare[0].minimumAmount
                ),
              },
            },
          },
          { new: true }
        );

        return res.status(200).json({
          distance: result.distance,
          path: result.path,
          totalFare: result.distance * fare[0].perKM + fare[0].minimumAmount,
          initialBalance: matchingCard.balance,
          newBalance:
            matchingCard.balance -
            (result.distance * fare[0].perKM + fare[0].minimumAmount),
          start: stationStart.name,
          end: stationEnd.name,
        });
      }
    }
  } catch (error) {
    console.error("Error during tapOut:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const findFromUID = async (req: Request, res: Response) => {
  try {
    const { enteredUID } = req.body;
    const cards = await Card.findOne({ uid: enteredUID });
    if (cards) {
      res.status(200).json(cards);
    } else {
      res.status(400).json({ eror: "No card found." });
    }
  } catch (error) {
    res.status(400).json({ error: "Internal Error" });
  }
};
