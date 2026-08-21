import { Schema, model, Types, Document } from "mongoose";

export interface IChatMessage extends Document {
  user: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

chatMessageSchema.index({ user: 1, createdAt: -1, _id: -1 });

export const ChatMessage = model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema,
);
