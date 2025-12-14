import { Schema, Types } from "mongoose";
import type { MongoDocument } from "../../mongodbAbstract.backendService";

export interface Match extends MongoDocument {
  tournament: Types.ObjectId;
  group: Types.ObjectId | null;
  player1: Types.ObjectId | null;
  player2: Types.ObjectId | null;
  player1Score: number;
  player2Score: number;
  winner: Types.ObjectId | null;
  textNotes: string;
  image: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
  // Knockout-specific fields
  round: number | null;
  roundName: string | null;
  nextMatchId: Types.ObjectId | null;
  bracketPosition: number | null;
}

export const MatchSchema = new Schema<Match>(
  {
    tournament: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    group: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    player1: { type: Schema.Types.ObjectId, ref: "Player", default: null },
    player2: { type: Schema.Types.ObjectId, ref: "Player", default: null },
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
    // Knockout fields
    round: { type: Number, default: null },
    roundName: { type: String, default: null },
    nextMatchId: { type: Schema.Types.ObjectId, ref: "Match", default: null },
    bracketPosition: { type: Number, default: null },
  },
  { timestamps: true }
);

// Indexes
MatchSchema.index({ tournament: 1 });
MatchSchema.index({ group: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ round: 1 });
MatchSchema.index({ nextMatchId: 1 });
