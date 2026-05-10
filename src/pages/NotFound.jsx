import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">

      <h1 className="text-5xl font-bold text-red-500 mb-4">
        404
      </h1>

      <p className="text-lg mb-4">
        Page Not Found 🚫
      </p>

      <Link
        to="/"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;