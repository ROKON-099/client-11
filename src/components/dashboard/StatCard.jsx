const StatCard = ({ icon, title, value }) => {
  return (
    <div className="
      relative overflow-hidden rounded-2xl
      bg-gradient-to-br from-red-500 via-pink-500 to-rose-600
      text-white p-6 shadow-lg
      hover:shadow-2xl hover:scale-[1.02]
      transition-all duration-300
    ">
      {/* Soft glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="
          flex items-center justify-center
          w-14 h-14 rounded-xl
          bg-white/20 text-3xl
        ">
          {icon}
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-medium opacity-90">
            {title}
          </p>
          <p className="text-3xl font-extrabold tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
