import { useState, useRef, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
const API = import.meta.env.VITE_API_URL;

function Navbar({
  search,
  setSearch,
}) {

  const { user, setUser } =
    useAuth();

  const location =
    useLocation();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [dropdown, setDropdown] =
    useState(false);

  const dropdownRef =
    useRef(null);

  const handleLogout =
    async () => {

      await fetch(
        `${API}/logout`,
        {
          method: "POST",
          credentials:
            "include",
        }
      );

      setUser(null);

      setDropdown(false);
    };

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target
          )
        ) {

          setDropdown(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  return (

    <nav className="bg-gradient-to-r from-slate-950 to-slate-900 text-white px-4 sm:px-6 py-3 shadow-lg sticky top-0 z-50 border-b border-slate-800">

      <div className="flex items-center justify-between gap-5">

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold tracking-wide whitespace-nowrap"
          >

            Real Time Incidents

          </Link>

          {location.pathname ===
            "/" && (

            <div className="hidden md:block relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

                🔍

              </span>

              <input
                type="text"
                value={
                  search || ""
                }
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search incidents..."
                className="w-[320px] bg-slate-800 border border-slate-700 rounded-2xl py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder:text-gray-400"
              />

            </div>

          )}

        </div>

        <div className="hidden md:flex items-center gap-5">

          {user ? (

            <div
              className="relative"
              ref={dropdownRef}
            >

              <div
                onClick={() =>
                  setDropdown(
                    !dropdown
                  )
                }
                className="flex items-center gap-3 cursor-pointer select-none group"
              >

                <span className="text-sm font-medium group-hover:text-blue-400 transition-all duration-300">

                  {user.name}

                </span>

                <img
                  src={
                    typeof user?.profilePic ===
                    "string"

                      ? user
                          ?.profilePic

                      : user
                          ?.profilePic
                          ?.url ||

                        "https://i.pravatar.cc/150"
                  }
                  alt="profile"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white group-hover:scale-105 transition-all duration-300"
                />

              </div>

              <div
                className={`absolute right-0 mt-3 w-72 bg-white text-black rounded-3xl shadow-2xl overflow-hidden border border-gray-100 z-50 transition-all duration-300 origin-top-right

                ${
                  dropdown
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }
                `}
              >

                <div className="px-5 py-5 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100">

                  <div className="flex items-center gap-4">

                    <img
                      src={
                        typeof user?.profilePic ===
                        "string"

                          ? user
                              ?.profilePic

                          : user
                              ?.profilePic
                              ?.url ||

                            "https://i.pravatar.cc/150"
                      }
                      alt="profile"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                    />

                    <div className="flex flex-col">

                      <h3 className="font-bold text-gray-800 text-lg">

                        {user.name}

                      </h3>

                      <p className="text-sm text-gray-500 break-all">

                        {user.email}

                      </p>

                    </div>

                  </div>

                </div>

                <div className="p-2">

                  <Link
                    to="/create-incident"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    onClick={() =>
                      setDropdown(
                        false
                      )
                    }
                  >

                    🚨 Create Incident

                  </Link>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    onClick={() =>
                      setDropdown(
                        false
                      )
                    }
                  >

                    📊 Dashboard

                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    onClick={() =>
                      setDropdown(
                        false
                      )
                    }
                  >

                    ⚙️ Settings

                  </Link>

                  <button
                    onClick={
                      handleLogout
                    }
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-600 text-red-500 transition-all duration-200"
                  >

                    🚪 Logout

                  </button>

                </div>

              </div>

            </div>

          ) : (

            <div className="flex items-center gap-4">

              <Link
                to="/login"
                className="hover:text-blue-400 transition-all duration-300"
              >

                Login

              </Link>

              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg"
              >

                Signup

              </Link>

            </div>

          )}

        </div>

        <button
          className="md:hidden text-3xl"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >

          ☰

        </button>

      </div>

      {menuOpen && (

        <div className="mt-5 flex flex-col gap-4 md:hidden bg-slate-900 rounded-3xl p-5 border border-slate-700 shadow-xl">

          {location.pathname ===
            "/" && (

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">

                🔍

              </span>

              <input
                type="text"
                value={
                  search || ""
                }
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search incidents..."
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          )}

          {user ? (

            <>
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">

                <img
                  src={
                    typeof user?.profilePic ===
                    "string"

                      ? user
                          ?.profilePic

                      : user
                          ?.profilePic
                          ?.url ||

                        "https://i.pravatar.cc/150"
                  }
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                />

                <div>

                  <p className="font-bold text-lg">

                    {user.name}

                  </p>

                  <p className="text-sm text-gray-300">

                    {user.email}

                  </p>

                </div>

              </div>

              <Link
                to="/create-incident"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="hover:text-blue-400 transition-all"
              >

                🚨 Create Incident

              </Link>

              <Link
                to="/dashboard"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="hover:text-blue-400 transition-all"
              >

                📊 Dashboard

              </Link>

              <Link
                to="/settings"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="hover:text-blue-400 transition-all"
              >

                ⚙️ Settings

              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-2xl transition-all"
              >

                🚪 Logout

              </button>

            </>

          ) : (

            <>
              <Link
                to="/login"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
              >

                Login

              </Link>

              <Link
                to="/signup"
                onClick={() =>
                  setMenuOpen(
                    false
                  )
                }
                className="bg-blue-500 hover:bg-blue-600 px-4 py-3 rounded-2xl text-center transition-all"
              >

                Signup

              </Link>

            </>

          )}

        </div>

      )}

    </nav>
  );
}

export default Navbar;