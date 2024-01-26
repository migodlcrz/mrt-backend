import mongoose, { Schema, Document } from "mongoose";

interface Fare extends Document {
  minimumAmount: number;
  perKM: number;
}

const fareSchema: Schema = new Schema(
  {
    minimumAmount: {
      type: Number,
      required: true,
    },
    perKM: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Fare>("Fare", fareSchema);
