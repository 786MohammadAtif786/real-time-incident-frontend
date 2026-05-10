import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;

function Login() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [isBlocked, setIsBlocked] =
    useState(false);

  const [timeLeft, setTimeLeft] =
    useState(
      Number(
        localStorage.getItem(
          "blockTime"
        )
      ) || 0
    );

  const { fetchUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      setIsBlocked(true);

    }

  }, []);

  useEffect(() => {

    let interval;

    if (
      isBlocked &&
      timeLeft > 0
    ) {

      interval = setInterval(() => {

        setTimeLeft((prev) => {

          const updated =
            prev - 1;

          localStorage.setItem(
            "blockTime",
            updated
          );

          return updated;
        });

      }, 1000);
    }

    if (timeLeft <= 0) {

      setIsBlocked(false);

      localStorage.removeItem(
        "blockTime"
      );
    }

    return () =>
      clearInterval(interval);

  }, [isBlocked, timeLeft]);

  const formatTime = (seconds) => {

    const mins = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${mins}:${
      secs < 10
        ? "0" + secs
        : secs
    }`;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (isBlocked) return;

    if (!form.email.trim()) {

      toast.error(
        "Email is required"
      );

      return;
    }

    if (!form.password.trim()) {

      toast.error(
        "Password is required"
      );

      return;
    }

    setLoading(true);

    try {

      const res = await fetch(
        `${API}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(form),
        }
      );

      const data =
        await res.json();

      console.log(data);

      if (res.ok) {

        toast.success(
          "Login Successfully"
        );

        setIsBlocked(false);

        setTimeLeft(0);

        localStorage.removeItem(
          "blockTime"
        );

        navigate("/");

        fetchUser();

      } else {

        toast.error(
          data.message
        );

        if (
          data.remainingTime
        ) {

          setIsBlocked(true);

          setTimeLeft(
            data.remainingTime
          );

          localStorage.setItem(
            "blockTime",
            data.remainingTime
          );
        }
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-xl rounded-2xl w-[320px]"
      >

        <h2 className="mb-5 text-center text-3xl font-bold">

          Login

        </h2>

        <input
          type="email"
          placeholder="test@gmail.com"
          value={form.email}
          disabled={isBlocked}
          className={`w-full mb-4 p-3 border rounded-lg outline-none
          
          ${
            isBlocked
              ? "bg-gray-200 cursor-not-allowed"
              : ""
          }
          `}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="**********"
          value={form.password}
          disabled={isBlocked}
          className={`w-full mb-4 p-3 border rounded-lg outline-none
          
          ${
            isBlocked
              ? "bg-gray-200 cursor-not-allowed"
              : ""
          }
          `}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          disabled={
            loading || isBlocked
          }
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-3 text-white transition-all duration-300
          
          ${
            loading || isBlocked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }
          `}
        >

          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

              Logging...
            </>
          ) : isBlocked ? (

            `Try again in ${formatTime(timeLeft)}`

          ) : (

            "Login"

          )}

        </button>

      </form>

    </div>
  );
}

export default Login;