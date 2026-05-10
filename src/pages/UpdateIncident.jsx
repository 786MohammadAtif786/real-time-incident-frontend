import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;


export default function UpdateIncident() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [loading,
    setLoading] =
    useState(false);

  const [title,
    setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [priority,
    setPriority] =
    useState("Low");

  const [status,
    setStatus] =
    useState("Open");

  const [image,
    setImage] =
    useState(null);

  const [preview,
    setPreview] =
    useState("");

  useEffect(() => {

    const fetchIncident =
      async () => {

        try {

          const response =
            await fetch(`${API}/incident/${id}`,

              {
                credentials:
                  "include",
              }
            );

          const data =
            await response.json();

          if (
            response.status ===
            403
          ) {

            toast.error(
              "You can update only your own incidents"
            );

            navigate("/");

            return;
          }

          if (
            response.status ===
            404
          ) {

            toast.error(
              "Incident not found"
            );

            navigate("/");

            return;
          }

          if (response.ok) {

            const incident =
              data.incident;

            setTitle(
              incident.title
            );

            setDescription(
              incident.description
            );

            setPriority(
              incident.priority
            );

            setStatus(
              incident.status
            );

            setPreview(
              incident.image?.url
            );
          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchIncident();

  }, [id, navigate]);

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const formData =
          new FormData();

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

        if (image) {

          formData.append(
            "image",
            image
          );
        }

        const response =
          await fetch(`${API}/update-incident/${id}`,

            {
              method: "PATCH",

              credentials:
                "include",

              body: formData,
            }
          );

        const data =
          await response.json();

        if (response.ok) {

          toast.success(
            "Incident Updated Successfully"
          );

          navigate("/");

        } else {

          toast.error(
            data.message
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow w-full max-w-xl"
      >

        <h1 className="text-4xl font-bold text-center mb-8">

          Update Incident

        </h1>
        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Title"
          className="w-full border p-3 rounded-lg mb-4 outline-none"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Description"
          className="w-full border p-3 rounded-lg mb-4 h-28 outline-none"
        />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-lg mb-4 outline-none"
        >

          <option>
            Low
          </option>

          <option>
            Medium
          </option>

          <option>
            High
          </option>

        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="w-full border p-3 rounded-lg mb-4 outline-none"
        >

          <option>
            Open
          </option>

          <option>
            In Progress
          </option>

          <option>
            Resolved
          </option>

        </select>

        {
          preview && (

            <img
              src={preview}
              alt="preview"
              className="w-full h-52 object-cover rounded-lg mb-4"
            />
          )
        }

        <input
          type="file"
          onChange={(e) =>
            setImage(
              e.target.files[0]
            )
          }
          className="mb-5"
        />

        <button
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white transition-all
          
          ${
            loading

              ? "bg-gray-400 cursor-not-allowed"

              : "bg-black hover:bg-gray-800"
          }
          `}
        >

          {
            loading
              ? "Updating..."
              : "Update Incident"
          }

        </button>

      </form>

    </div>
  );
}