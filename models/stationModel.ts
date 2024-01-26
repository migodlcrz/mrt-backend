import mongoose, { Schema, Document } from "mongoose";

interface Station extends Document {
  uid: number;
  name: string;
  long: number;
  lat: number;
}

const stationSchema: Schema = new Schema(
  {
    uid: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Station>("Station", stationSchema);
