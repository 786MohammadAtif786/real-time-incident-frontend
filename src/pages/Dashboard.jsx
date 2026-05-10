import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {

  const [incidents,
    setIncidents] =
    useState([]);

  const [deleteLoading,
    setDeleteLoading] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    const fetchMyIncidents =
      async () => {

        try {

          setLoading(true);

          const response =
            await fetch(

              `${API}/my-incidents`,

              {
                credentials:
                  "include",
              }
            );

          const data =
            await response.json();

          if (response.ok) {

            setIncidents(
              data.incidents
            );

          } else {

            toast.error(
              data.message
            );
          }

        } catch (error) {

          console.log(error);

          toast.error(
            "Failed to fetch incidents"
          );

        } finally {

          setLoading(false);
        }
      };

    fetchMyIncidents();

  }, []);

  const handleDelete =
    async (id) => {

      try {

        setDeleteLoading(id);

        const response =
          await fetch(

            `${API}/delete-incident/${id}`,

            {
              method: "DELETE",

              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (response.ok) {

          setIncidents((prev) =>

            prev.filter(

              (item) =>

                item._id !== id
            )
          );

          toast.success(
            "🗑️ Incident Deleted"
          );

        } else {

          toast.error(
            data.message
          );
        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Delete failed"
        );

      } finally {

        setDeleteLoading(null);
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="flex flex-col items-center">

          <div className="relative">

            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>

            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

          </div>

          <p className="mt-5 text-lg font-semibold text-slate-700">

            Loading Your Incidents...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6">

      <div className="text-center mb-10">

        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900">

          My Incidents

        </h1>

        <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>

      </div>

      {
        incidents.length ===
        0 && (

          <div className="text-center py-24">

            <h2 className="text-3xl font-bold text-gray-500 mb-3">

              No Incidents Found

            </h2>

            <p className="text-gray-400 text-lg">

              Create your first incident 🚨

            </p>

          </div>

        )
      }

      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {
          incidents.map((incident) => (

            <div
              key={incident._id}
              className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >

              <div className="flex flex-col md:flex-row gap-5 p-5">

                <div className="w-full md:w-[220px] h-[220px] md:h-[170px] rounded-2xl overflow-hidden flex-shrink-0">

                  <img
                    src={incident?.image?.url}
                    alt="incident"
                    className="w-full h-full object-cover"
                  />

                </div>

                <div className="flex-1 flex flex-col justify-between">

                  <div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">

                      {incident.title}

                    </h2>

                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-5">

                      {incident.description}

                    </p>

                    <div className="flex flex-wrap gap-3 mb-5">

                      <div
                        className={`px-4 py-2 rounded-full text-sm font-semibold
                        
                        ${
                          incident.priority ===
                          "High"

                            ? "bg-red-100 text-red-600"

                            : incident.priority ===
                              "Medium"

                            ? "bg-orange-100 text-orange-600"

                            : "bg-green-100 text-green-600"
                        }
                        `}
                      >

                        Priority:
                        {" "}
                        {incident.priority}

                      </div>

                      <div className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-600">

                        Status:
                        {" "}
                        {incident.status}

                      </div>

                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5">

                      <p className="text-gray-800 text-sm sm:text-base">

                        <span className="font-bold">

                          📍 Location:

                        </span>

                        {" "}

                        {
                          incident
                            ?.location
                            ?.address ||

                          "Location Not Available"
                        }

                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">

                    <Link
                      to={`/update-incident/${incident._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition-all duration-200"
                    >

                      Edit

                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          incident._id
                        )
                      }
                      disabled={
                        deleteLoading ===
                        incident._id
                      }
                      className={`px-5 py-2 rounded-xl text-white transition-all duration-200 flex items-center justify-center gap-2
                      
                      ${
                        deleteLoading ===
                        incident._id

                          ? "bg-red-300 cursor-not-allowed"

                          : "bg-red-500 hover:bg-red-600"
                      }
                      `}
                    >

                      {
                        deleteLoading ===
                        incident._id ? (

                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                            Deleting...
                          </>

                        ) : (

                          "Delete"

                        )
                      }

                    </button>

                  </div>

                </div>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}