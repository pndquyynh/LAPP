import mongoose, { InferSchemaType, Schema } from "mongoose";

export const exercise = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["done", "not done"],
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Exercise = mongoose.model("Exercise", exercise);

export type ExerciseType = InferSchemaType<typeof exercise>;
