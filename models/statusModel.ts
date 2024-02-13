import mongoose, { Schema, Document, mongo } from "mongoose";

interface Status extends Document {
  isDeployed: boolean;
}

const statusSchema: Schema = new Schema({
  isDeployed: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<Status>("Status", statusSchema);
