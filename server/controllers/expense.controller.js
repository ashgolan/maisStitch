import { Expense } from "../models/expenses.model.js";

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    if (!expenses) throw Error("expenses not found");
    res.send(expenses);
  } catch (e) {
    res.send(e.message);
  }
};
export const getExpense = async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await Expense.findById({ _id: id });
    if (!expense) throw Error("expense not found");
    res.send(expense);
  } catch (e) {
    res.send(e.message);
  }
};
export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    if (!expense) throw Error("bad data was inserted!");
    res.send(expense);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!expense) throw Error("bad data was inserted!");
    res.send(expense);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!expense) throw Error("bad data was inserted!");
    res.send(expense);
  } catch (e) {
    res.send(e.message);
  }
};
