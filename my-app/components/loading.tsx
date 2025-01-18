const LoadingComponent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-200">
      <div className="relative">
        {/* Animated dollar bills stack */}
        <div className="flex items-center">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="w-24 h-12 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 animate-bounce shadow-lg"
              style={{
                animationDelay: `${i * 0.2}s`,
                marginTop: "-1.5rem",
                zIndex: 3 - i,
                transform: `rotate(${1 * 2}deg)`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white border-2 border-emerald-200 rounded-lg">
                <span className="font-bold text-3xl">$</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <h2
            className="text-2xl font-bold text-purple-700 animate-pulse"
            dir="rtl"
          >
            در حال بارگذاری ...
          </h2>
          <p className="text-purple-600 mt-2">لطفاً چند لحظه صبر کنید</p>
        </div>
      </div>
    </div>
  );
};
export default LoadingComponent;
