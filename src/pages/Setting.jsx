import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
  const API = import.meta.env.VITE_API_URL;

export default function Settings() {

  const [tab, setTab] =
    useState("account");
   

  const navigate =
    useNavigate();

  const { fetchUser } =
    useAuth();


  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [file, setFile] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showConfirm,
    setShowConfirm] =
    useState(false);

  useEffect(() => {

    const fetchCurrentUser =
      async () => {

        try {

          const res =
            await axios.get(

              `${API}/me`,

              {
                withCredentials:
                  true,
              }
            );

          setForm({
            name:
              res.data.user.name,

            email:
              res.data.user.email,

            password: "",

            confirmPassword:
              "",
          });

          setPreview(

            typeof res.data.user
              .profilePic ===
            "string"

              ? res.data.user
                  .profilePic

              : res.data.user
                  .profilePic
                  ?.url || ""

          );

        } catch (err) {

          console.log(err);

          toast.error(
            "Failed to load user"
          );
        }
      };

    fetchCurrentUser();

  }, []);

  const handleChange =
    (e) => {

      setForm({
        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  const handleFile =
    (e) => {

      const img =
        e.target.files[0];

      setFile(img);

      if (img) {

        setPreview(
          URL.createObjectURL(
            img
          )
        );
      }
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (
        form.password &&
        form.password !==
          form.confirmPassword
      ) {

        return toast.error(
          "Passwords do not match"
        );
      }

      try {

        setLoading(true);

        const data =
          new FormData();

        if (form.name) {

          data.append(
            "name",
            form.name
          );
        }

        if (form.password) {

          data.append(
            "password",
            form.password
          );
        }

        if (file) {

          data.append(
            "image",
            file
          );
        }

        const res =
          await axios.put(

            `${API}/update-user`,

            data,

            {
              withCredentials:
                true,
            }
          );

        await fetchUser();

        setPreview(

          typeof res.data.user
            .profilePic ===
          "string"

            ? res.data.user
                .profilePic

            : res.data.user
                .profilePic
                ?.url || ""

        );

        toast.success(
          "Profile updated successfully"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Update failed"
        );

      } finally {

        setLoading(false);
      }
    };

  const handleDelete =
    async () => {

      try {

        setLoading(true);

        await axios.delete(

          `${API}/delete`,

          {
            withCredentials:
              true,
          }
        );

        toast.success(
          "Account deleted"
        );

        localStorage.clear();

        window.location.href =
          "/login";

      } catch (err) {

        toast.error(
          "Delete failed"
        );

        console.log(err);

      } finally {

        setLoading(false);

        setShowConfirm(false);
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center">

      <div className="w-full max-w-2xl">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mb-5 text-cyan-700 font-medium hover:underline"
        >

          ← Back

        </button>

        <div className="flex bg-white rounded-2xl shadow mb-6 overflow-hidden">

          <button
            onClick={() =>
              setTab(
                "account"
              )
            }
            className={`flex-1 py-3 font-medium transition-all
            
            ${
              tab ===
              "account"

                ? "bg-[#157A9E] text-white"

                : "text-gray-600"
            }
            `}
          >

            🧑 Account

          </button>

          <button
            onClick={() =>
              setTab(
                "danger"
              )
            }
            className={`flex-1 py-3 font-medium transition-all
            
            ${
              tab ===
              "danger"

                ? "bg-red-500 text-white"

                : "text-gray-600"
            }
            `}
          >

            🚨 Danger Zone

          </button>

        </div>

        {tab ===
          "account" && (

          <form
            onSubmit={
              handleSubmit
            }
            className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl"
          >

            <h2 className="text-2xl font-bold mb-6 text-slate-800">

              Account Settings

            </h2>

            <div className="flex flex-col items-center mb-6">

              <img
                src={
                  preview ||

                  "https://i.pravatar.cc/150"
                }
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg mb-3"
              />

              <input
                type="file"
                onChange={
                  handleFile
                }
                className="text-sm"
              />

            </div>

            <input
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              placeholder="Name"
              className="w-full border border-gray-300 p-3 mb-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <input
              value={form.email}
              disabled
              className="w-full border border-gray-300 p-3 mb-4 rounded-xl bg-gray-100 cursor-not-allowed opacity-80"
            />

            <input
              name="password"
              type="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="New Password"
              className="w-full border border-gray-300 p-3 mb-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <input
              name="confirmPassword"
              type="password"
              value={
                form.confirmPassword
              }
              onChange={
                handleChange
              }
              placeholder="Confirm Password"
              className="w-full border border-gray-300 p-3 mb-6 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button
              disabled={
                loading
              }
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3
              
              ${
                loading

                  ? "bg-cyan-300 cursor-not-allowed"

                  : "bg-[#157A9E] hover:bg-cyan-700"
              }
              `}
            >

              {loading ? (

                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                  Saving...

                </>

              ) : (

                "Save Changes"

              )}

            </button>

          </form>
        )}

        {tab ===
          "danger" && (

          <div className="bg-red-50 border border-red-200 p-6 rounded-3xl shadow">

            <h2 className="text-2xl font-bold text-red-600 mb-3">

              Danger Zone

            </h2>

            <p className="text-gray-600 mb-5">

              Permanently delete your account.

            </p>

            <button
              onClick={() =>
                setShowConfirm(
                  true
                )
              }
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl transition-all"
            >

              Delete Account

            </button>

          </div>
        )}

        {showConfirm && (

          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

            <div className="bg-white p-6 rounded-3xl w-[90%] max-w-sm shadow-2xl">

              <h2 className="text-xl font-bold mb-3 text-red-600">

                Are you sure?

              </h2>

              <p className="text-gray-600 mb-5">

                This action will permanently delete your account.

              </p>

              <div className="flex justify-end gap-3">

                <button
                  onClick={() =>
                    setShowConfirm(
                      false
                    )
                  }
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                >

                  Cancel

                </button>

                <button
                  onClick={
                    handleDelete
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-xl"
                >

                  {loading

                    ? "Deleting..."

                    : "Yes, Delete"}

                </button>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}