import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
  const API = import.meta.env.VITE_API_URL;

export default function CreateIncident() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Open");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] =
    useState({
      latitude: "",
      longitude: "",
      address: "",

    });

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        try {

          const response = await fetch(

            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`

          );

          const data = await response.json();

          setLocation({

            latitude,

            longitude,

            address:
              data.display_name,

          });

        } catch (error) {

          console.log(error);

        }

      },

      (error) => {

        console.log(error);

      }

    );

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append(
        "title",
        title
      );

      formData.append(
        "description",
        description
      );

      formData.append(
        "priority",
        priority
      );

      formData.append(
        "status",
        status
      );

      formData.append(
        "latitude",
        location.latitude
      );

      formData.append(
        "longitude",
        location.longitude
      );

      formData.append(
        "address",
        location.address
      );

      formData.append(
        "image",
        image
      );

      const response = await fetch(

        `${API}/create-incident`,

        {
          method: "POST",

          credentials: "include",

          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {

        toast.success(
          "Incident Created Successfully"
        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8"
      >

        <h1 className="text-4xl font-bold text-center mb-8">

          Create Incident

        </h1>

        <div className="mb-5">

          <label className="block mb-2 font-semibold">

            Title

          </label>

          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full border p-3 rounded-lg outline-none"
          />

        </div>

        <div className="mb-5">

          <label className="block mb-2 font-semibold">

            Description

          </label>

          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full border p-3 rounded-lg outline-none h-28"
          />

        </div>

        <div className="mb-5">

          <label className="block mb-2 font-semibold">

            Priority

          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            className="w-full border p-3 rounded-lg outline-none"
          >

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>

          </select>

        </div>

        <div className="mb-5">

          <label className="block mb-2 font-semibold">

            Status

          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full border p-3 rounded-lg outline-none"
          >

            <option value="Open">
              Open
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>

          </select>

        </div>

        <div className="mb-6">

          <label className="block mb-2 font-semibold">

            Upload Image

          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            className="w-full"
          />

        </div>

        <div className="mb-6 bg-gray-100 p-3 rounded-lg">

          <p className="font-semibold mb-1">

            Current Location

          </p>

          <p className="text-gray-600 text-sm">

            {location.address}

          </p>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg text-lg hover:bg-gray-800 flex items-center justify-center gap-3"
        >

          {
            loading ? (
              <>

                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                Creating...

              </>
            ) : (

              "Create Incident"

            )
          }

        </button>

      </form>

    </div>
  );
}