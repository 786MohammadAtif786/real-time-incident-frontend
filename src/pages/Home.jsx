
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import socket from "../socket";
const API = import.meta.env.VITE_API_URL;


export default function Home({
  search,
}) {

  const [incidents, setIncidents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  useEffect(() => {

    const fetchIncidents =
      async () => {

        try {

          setLoading(true);

          const response =
            await fetch(`${API}/incidents?page=${page}&limit=${limit}&search=${search}`);
          const data =
            await response.json();
          if (response.ok) {
            setIncidents(data.incidents);

            setTotalPages(data.totalPages);
          }

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);
        }
      };

    fetchIncidents();

  }, [page, search]);

  useEffect(() => {

    socket.on(
      "newIncident",
      (newIncident) => {

        toast.success(
          "🚨 New Incident Added"
        );

        setIncidents((prev) => [

          newIncident,

          ...prev,

        ]);
      }
    );

    socket.on(
      "incidentUpdated",
      (updatedIncident) => {

        toast.info(
          "✏️ Incident Updated"
        );

        setIncidents((prev) =>

          prev.map((item) =>

            item._id ===
              updatedIncident._id

              ? updatedIncident

              : item
          )
        );
      }
    );

    socket.on(
      "incidentDeleted",
      (deletedId) => {

        toast.error(
          "🗑️ Incident Deleted"
        );

        setIncidents((prev) =>

          prev.filter(
            (item) =>
              item._id !==
              deletedId
          )
        );
      }
    );

    return () => {

      socket.off(
        "newIncident"
      );

      socket.off(
        "incidentUpdated"
      );

      socket.off(
        "incidentDeleted"
      );
    };

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <div className="relative">

          <div className="w-24 h-24 rounded-full border-4 border-blue-200"></div>

          <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>

        </div>

        <p className="mt-6 text-xl font-semibold text-slate-700 tracking-wide">

          Loading Incidents...

        </p>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="text-center mb-12">

        <h1 className="text-6xl font-bold text-slate-900">

          Recent Incidents

        </h1>

        <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>

      </div>

      {
        incidents.length ===
        0 && (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold text-gray-500 mb-3">

              No Incidents Found

            </h2>

          </div>

        )
      }


      <div className="max-w-5xl mx-auto flex flex-col gap-6">

        {incidents.map((incident) => (

          <div
            key={incident._id}
            className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >

            <div className="flex flex-col md:flex-row gap-6 p-6">

              <div className="w-full md:w-[180px] h-[220px] md:h-[180px] rounded-2xl overflow-hidden">

                <img
                  src={
                    incident?.image?.url
                  }
                  alt="incident"
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="flex-1">

                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">

                  {incident.title}

                </h2>

                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-5">

                  {
                    incident.description
                  }

                </p>

                <div className="flex flex-wrap gap-4 mb-5">

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold w-fit
              
              ${incident.priority ===
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
                    {
                      incident.priority
                    }

                  </div>

                  <div className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-600 w-fit">

                    Status:
                    {" "}
                    {
                      incident.status
                    }

                  </div>

                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">

                  <p className="text-gray-800 text-sm md:text-base">

                    <span className="font-bold">

                      📍 Location:

                    </span>

                    {" "}

                    {
                      incident
                        .location
                        ?.address ||

                      "Location Not Available"
                    }

                  </p>

                </div>

              </div>

            </div>

            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-wrap gap-4">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg uppercase">

                  {
                    incident.createdBy?.name?.charAt(
                      0
                    ) || "U"
                  }

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">

                    Reported By

                  </p>

                  <p className="font-semibold text-slate-800 text-base">

                    {
                      incident
                        .createdBy
                        ?.name ||

                      "Unknown User"
                    }

                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">

                  Created At

                </p>

                <p className="font-semibold text-slate-800 text-base">

                  {new Date(
                    incident.createdAt
                  ).toLocaleDateString()}

                </p>

                <p className="text-sm text-gray-500">

                  {new Date(
                    incident.createdAt
                  ).toLocaleTimeString()}

                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-4 mt-10">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage(
                (prev) => prev - 1
              )
            }
            className={`px-5 py-2 rounded-xl font-semibold transition-all
            
            ${page === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }
          `}
          >

            Prev

          </button>

          <div className="px-5 py-2 bg-white rounded-xl shadow font-bold text-slate-700">

            Page {page} of{" "}
            {totalPages}

          </div>

          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(
                (prev) => prev + 1
              )
            }
            className={`px-5 py-2 rounded-xl font-semibold transition-all
            
            ${page === totalPages
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }
          `}
          >

            Next

          </button>

        </div>

      )}

    </div>
  );
}
