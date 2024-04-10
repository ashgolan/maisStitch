import { Schema, model } from "mongoose";
const date = new Date();
const year = date.getFullYear();
const month =
  date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

const saleSchema = new Schema({
  date: { type: String, default: year + "-" + month + "-" + day },
  clientName: { type: String, required: true },
  purpose: { type: String, required: true },
  name: { type: String, required: true },
  strains: { type: String, default: "-" },
  product: { type: String, default: "-" },
  letersOfProduct: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  number: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  colored: { type: Boolean, default: false },
});

export const Sale = model("Sale", saleSchema);
