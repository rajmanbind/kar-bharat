import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkerSkill = mongoose.model("Worker-skill", skillSchema);

export default WorkerSkill;
