import Card from "../models/crdModel";
import Fare from "../models/frModel";
import Station from "../models/stnModel";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { calculatePath } from "./pathController";

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

//fetch data form mobile
export const getCardsMobile = async (req: Request, res: Response) => {
  const { uid } = req.body;

  console.log(uid);

  if (!uid || !Array.isArray(uid) || uid.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or empty uidArray in the request body." });
  }

  try {
    const cards = await Card.find({ uid: { $in: uid } });

    if (cards.length === 0) {
      return res.status(404).json({ error: "No matching cards found." });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//CREATE a card
export const createCard = async (req: Request, res: Response) => {
  const { uid, balance, isTap, mounted, in: inValue, history } = req.body;

  try {
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

//TAPOUT card
// export const tapOut = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "Card does not exist." });
//   }

//   const { balance, history } = req.body;

//   try {
//     const updatedCard = await Card.findByIdAndUpdate(
//       id,
//       {
//         $set: { balance },
//         $push: { history },
//       },
//       { new: true } // To return the updated document
//     );

//     if (!updatedCard) {
//       return res.status(404).json({ error: "Card does not exist." });
//     }

//     res.status(200).json(updatedCard);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

//TAPIN card
export const tapIn = async (req: Request, res: Response) => {
  const { enteredUID, stationStart } = req.body;

  try {
    const cards = await Card.find({}).sort({ createdAt: -1 });
    const stations = await Station.find({}).sort({ createdAt: -1 });
    const fare = await Fare.find({}).sort({ createdAt: -1 });

    const matchingCard = cards.find((card) => card.uid === Number(enteredUID));
    const matchingStation = stations.find(
      (station) => station.name === String(stationStart)
    );

    if (!matchingCard) {
      console.log("Not matching card");
      return res.status(400).json({ error: "No matching card." });
    }

    if (!matchingStation) {
      console.log("Not matching station");
      return res.status(400).json({ error: "No matching station." });
    }

    if (matchingCard && fare) {
      if (matchingCard.balance < fare[0].minimumAmount) {
        console.log("Insufficient balance");
        return res.status(400).json({ error: "Insufficient balance." });
      }
    }

    if (matchingCard.isTap === true) {
      console.log("Already tapped in!");
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
      console.log("Card not found or already tapped!");
      return res
        .status(400)
        .json({ error: "Card not found or already tapped!" });
    }

    console.log("Card tapped successfully:", updatedCard);
    return res.status(200).json({ message: "Card tapped successfully!" });
  } catch (error) {
    console.error("Error during tapIn:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const tapOut = async (req: Request, res: Response) => {
  try {
    const { enteredUID, stationEnd } = req.body;
    const cards = await Card.find({}).sort({ createdAt: -1 });
    const stations = await Station.find({}).sort({ createdAt: -1 });
    const fare = await Fare.find({}).sort({ createdAt: -1 });

    const matchingCard = cards.find((card) => card.uid === Number(enteredUID));
    const matchingStation = stations.find(
      (station) => station.name === String(stationEnd)
    );

    if (!matchingCard) {
      console.log("No matching card");
      return res.status(400).json({ error: "No matching card." });
    }

    if (!matchingCard.isTap) {
      console.log("Not tapped in");
      return res.status(400).json({ error: "Not tapped in" });
    }

    // Convert matchingCard.in to a valid ObjectId if needed
    const stationStartId = new mongoose.Types.ObjectId(matchingCard.in);

    const stationStart = stations.find((station) =>
      station._id.equals(stationStartId)
    );

    console.log("START", stationStart);
    console.log("END", matchingStation);

    if (!stationStart) {
      // Handle the case where stationStart is undefined
      console.log("Station start not found");
      return res.status(400).json({ error: "Station start not found" });
    }

    if (!matchingStation) {
      console.log("Station end not found");
      return res.status(400).json({ error: "Station end not found" });
    }

    const result = await calculatePath(stationStart, matchingStation);

    console.log("RESULT", result.path);
    console.log("DISTANCE", result.distance);
    console.log("ERROR", result.error);

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
