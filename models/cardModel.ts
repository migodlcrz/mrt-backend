import mongoose, { Schema, Document } from "mongoose";

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
  },
  { timestamps: true }
);

export default mongoose.model<Card>("Card", cardSchema);
