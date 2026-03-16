import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if(!user) return;
    const delay = setTimeout(() => {
        navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : '/');
    }, 500);
    return () => clearTimeout(delay);
  },[search, user, navigate]);

  return (
    <div className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to={"/"} className="text-2xl">
          Notes App
        </Link>
        {user && (
          <>
            <div>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="w-full px-4 py-1 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-700"/>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-400 font-semibold text-lg">
                <UserRound />
                <span>{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-700 text-white px-3 py-1 rounded-md hover:bg-red-600 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Navbar;
