import mongoose, { Schema, Document } from "mongoose";

interface Card extends Document {
  uid: number;
  balance: number;
  isTap: boolean;
  mounted: boolean;
  in: string;
  history: any[];
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
    mounted: {
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
          default: Date.now,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<Card>("Card", cardSchema);
