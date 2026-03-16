import React, { useEffect, useState } from "react";
import axios from "axios";

const NotesModel = ({ isOpen, onClose, note, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setDescription(note ? note.description : "");
    setError("");
  }, [note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Login");
        return;
      }
      const payload = { title, description };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (note) {
        const { data } = await axios.put(
          `/api/notes/${note._id}`,
          payload,
          config,
        );
        onSave(data);
      } else {
        const { data } = await axios.post(`/api/notes`, payload, config);
        onSave(data);
      }
      setTitle("");
      setDescription("");
      setError("");
      onClose();
    } catch (error) {
      console.log("Note save error");
      setError("Failed to save note error");
    }
  };

  if(!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {note ? "Edit Note" : "Create Note"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              placeholder="Note Title..."
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-2 bg-gray-700 text-white boreder border-gray-600 focus:ring-2 focus:ring-blue-700 outline-none rounded-md"
              required
            />
            <textarea
              type="text"
              value={description}
              placeholder="Note description..."
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2 py-2 bg-gray-700 text-white boreder border-gray-600 focus:ring-2 focus:ring-blue-700 outline-none rounded-md"
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-2 mt-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 rounded-md cursor-pointer"
            >
              {note ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesModel;
