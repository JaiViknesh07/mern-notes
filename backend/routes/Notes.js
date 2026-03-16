import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/Auth.js";

const router = express.Router();

// Get all Notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id });
    res.json(notes);
  } catch (error) {
    console.log("Get all note error:", error.msg);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a note

router.post("/", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const note = await Note.create({
      title,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (error) {
    console.log("Create note error:", error.msg);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a note

router.get('/:id', protect, async(req, res) => {
    const note = await Note.findById(req.params.id);
    try {
        if(!note){
            res.status(404).json({message: "Note not found"});
        }
    } catch (error) {
        console.log("Get note error:", error.msg);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a Note

router.put('/:id', protect, async(req, res) => {
    const { title, description } = req.body;
    try {
        const note = await Note.findById(req.params.id);
        if(!note){
            res.status(404).json({message: "Note not found"});
        }
        if(note.createdBy.toString !== req.user._id.toString){
            res.status(401).json({message: "Not authorized"});
        }
        note.title = title || note.title;
        note.description = description || note.description;

        const updatedNote = await note.save();
        res.json(updatedNote);

    } catch {
        console.log("Update note error:", error.msg);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete a Note

router.delete('/:id', protect, async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if(!note){
            res.status(404).json({message: "Note not found"});
        }
        if(note.createdBy.toString !== req.user._id.toString){
            res.status(401).json({message: "Not authorized"});
        }
        await note.deleteOne();
        res.json({message: "Note deleted succesfully"});
    } catch (error) {
        console.log("Delete note error:", error.msg);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
