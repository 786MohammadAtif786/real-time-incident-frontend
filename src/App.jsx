import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PublicRoute from "./components/PublicRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import CreateIncident from "./pages/CreateIncident";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { ToastContainer } from "react-toastify";
import UpdateIncident from "./pages/UpdateIncident.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Setting.jsx";


function App() {
   const [search,
    setSearch] =
    useState("");
  return (
    <BrowserRouter>
     <ToastContainer className="top-center" />
     <Navbar
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path="/" element={<Home search={search} />} />

        <Route
        path="/create-incident"
        element={
          <PrivateRoute>

            <CreateIncident />

          </PrivateRoute>
        }
      />
       <Route
        path="/settings"
        element={
          <PrivateRoute>

            <Settings />

          </PrivateRoute>
        }
      />

       <Route
         path="/update-incident/:id"
        element={
          <PrivateRoute>

            <UpdateIncident />

          </PrivateRoute>
        }
      /> 
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>

            <Dashboard />

          </PrivateRoute>
        }
      />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />        
          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;