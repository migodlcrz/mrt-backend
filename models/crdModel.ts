import mongoose, { Schema, Document } from "mongoose";
import moment from "moment";

interface Card extends Document {
  uid: number;
  balance: number;
}

const cardSchema: Schema = new Schema(
  {
    uid: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    isTap: {
      type: Boolean,
      default: false,
      required: true,
    },
    in: {
      type: String,
    },
    history: [
      {
        in: {
          type: String,
        },
        out: {
          type: String,
        },
        fare: {
          type: Number,
        },
        date: {
          type: Date,
          default: moment().format("YYYY-MM-DD"),
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<Card>("Card", cardSchema);
