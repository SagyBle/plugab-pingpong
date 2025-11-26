import { Schema, Types } from "mongoose";
import type { MongoDocument } from "../../mongodbAbstract.backendService";

export interface Match extends MongoDocument {
  tournament: Types.ObjectId;
  player1: Types.ObjectId;
  player2: Types.ObjectId;
  player1Score: number;
  player2Score: number;
  winner: Types.ObjectId | null;
  textNotes: string;
  image: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
}

export const MatchSchema = new Schema<Match>(
  {
    tournament: { type: Schema.Types.ObjectId, ref: "Tournament", required: true },
    player1: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    player2: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    player1Score: { type: Number, default: 0 },
    player2Score: { type: Number, default: 0 },
    winner: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    textNotes: { type: String, default: "" },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true }
);

// Indexes
MatchSchema.index({ tournament: 1 });
MatchSchema.index({ status: 1 });

