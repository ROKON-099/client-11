import { useRouteError, useNavigate } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">🚫</div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">
          Oops!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {error?.status === 404
            ? "The page you are looking for does not exist."
            : "Something went wrong. Please try again."}
        </p>

        {/* Error info (optional for dev) */}
        {error?.status && (
          <p className="text-sm text-gray-400 mb-6">
            Error Code: {error.status}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
