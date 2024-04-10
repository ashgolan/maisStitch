import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  clientName: { type: String, required: true },
  name: { type: String, default: "-" },
});

export const Client = model("Client", clientSchema);
