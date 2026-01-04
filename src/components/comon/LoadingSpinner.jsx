const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-red-50/90 via-white/90 to-pink-50/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">

        {/* Glow Ring */}
        <div className="relative w-24 h-24">
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-pink-500 blur-xl opacity-40"></div>

          {/* Static Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-red-200"></div>

          {/* Spinning Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-pulse">🩸</span>
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-red-600 font-semibold text-lg tracking-wide">
            Loading, please wait
          </p>
          <p className="text-sm text-gray-500 animate-pulse">
            Preparing something lifesaving ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
