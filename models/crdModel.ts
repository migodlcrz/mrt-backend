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
    isTap: {
      type: Boolean,
      default: false,
      required: true,
    },
    in: {
      type: String,
    },
    out: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Card>("Card", cardSchema);
