import React, { useState, useEffect } from "react";
import axios from "axios";
import NotesModel from "../components/NotesModel";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState();
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Login");
        return;
      }
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";

      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredNotes = search
        ? data.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.description.toLowerCase().includes(search.toLowerCase()),
          )
        : data;
      setNotes(filteredNotes);
      console.log(data);
    } catch (error) {
      setError("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);
  };

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(
        notes.map((note) => (note._id === newNote._id ? newNote : note)),
      );
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setIsModelOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Login");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      setError("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8 bg-gray-500">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <NotesModel
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />
      {/* Create Notes */}
      <button
        onClick={() => setIsModelOpen(true)}
        className="fixed bottom-6 right-6 bg-gray-700 text-white hover:bg-gray-800 flex items-center justify-center text-3xl rounded-full w-14 h-14 cursor-pointer"
      >
        <span className="flex items-center justify-center pb-1 h-full w-full">
          +
        </span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note._id} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-white mb-2">
              {note.title}
            </h3>
            <p className="text-md text-gray-300 mb-4">{note.description}</p>
            <p className="text-sm text-gray-400 mb-4">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-600 text-white hover:bg-yellow-500 rounded-md px-3 py-1 cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-600 text-white hover:bg-red-700 rounded-md px-3 py-1 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
