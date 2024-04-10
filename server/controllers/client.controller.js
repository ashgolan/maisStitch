import { Client } from "../models/client.model.js";

export const getAllClients = async (req, res) => {
  try {
    const client = await Client.find();
    if (!client) throw Error("client not found");
    res.send(client);
  } catch (e) {
    res.send(e.message);
  }
};
export const getClient = async (req, res) => {
  const id = req.params.id;
  try {
    const client = await Client.findById({ _id: id });
    if (!client) throw Error("client not found");
    res.send(client);
  } catch (e) {
    res.send(e.message);
  }
};
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    if (!client) throw Error("bad data was inserted!");
    res.send(client);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!client) throw Error("bad data was inserted!");
    res.send(client);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!client) throw Error("bad data was inserted!");
    res.send(client);
  } catch (e) {
    res.send(e.message);
  }
};
