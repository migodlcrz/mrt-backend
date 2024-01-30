import mongoose, { Schema, Document } from "mongoose";

interface Station extends Document {
  name: string;
  long: number;
  lat: number;
  connection: number[];
}

const stationSchema: Schema = new Schema(
  {
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
    connection: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Station>("Station", stationSchema);
