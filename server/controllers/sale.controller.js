import { Sale } from "../models/sale.model.js";

export const getAllSales = async (req, res) => {
  try {
    const sale = await Sale.find();
    if (!sale) throw Error("sale not found");
    res.send(sale);
  } catch (e) {
    res.send(e.message);
  }
};
export const getSale = async (req, res) => {
  const id = req.params.id;
  try {
    const sale = await Sale.findById({ _id: id });
    if (!sale) throw Error("sale not found");
    res.send(sale);
  } catch (e) {
    res.send(e.message);
  }
};
export const createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    if (!sale) throw Error("bad data was inserted!");
    res.send(sale);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!sale) throw Error("bad data was inserted!");
    res.send(sale);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!sale) throw Error("bad data was inserted!");
    res.send(sale);
  } catch (e) {
    res.send(e.message);
  }
};
