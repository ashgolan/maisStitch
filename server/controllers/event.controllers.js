import { Event } from "../models/event.model.js";

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    if (!events) throw Error("events not found");
    res.send(events);
  } catch (e) {
    res.send(e.message);
  }
};
export const createEvent = async (req, res) => {
  try {
    const { title, start, end } = req.body;
    const newEvent = new Event({ title, start, end });
    const savedEvent = await newEvent.save();
    res.status(201).send(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete({ _id: eventId });
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).send(deletedEvent);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
