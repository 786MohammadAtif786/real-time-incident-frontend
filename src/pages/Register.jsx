
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);

    if (image) {
      formData.append("profilePic", image);
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/register`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Registered successfully 🚀");
      navigate("/login");

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded w-[350px]"
      >
        <h2 className="text-center font-bold text-lg mb-4">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
        />

          <label className="block mb-2 font-medium text-gray-700">

              Profile Picture

            </label>

        <input
          type="file"
          accept="image/*"
          className="w-full mb-3"
          onChange={handleImage}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
          />
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;