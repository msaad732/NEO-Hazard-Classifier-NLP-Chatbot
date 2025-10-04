export function LoadingMeteor() {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 animate-spin">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 4 L20 12 L16 10 L12 12 Z"
              fill="#00FFFF"
              className="drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
            />
            <path
              d="M16 10 L18 20 L16 18 L14 20 Z"
              fill="#FFD700"
              className="drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
            />
            <circle
              cx="16"
              cy="16"
              r="2"
              fill="#FF00FF"
              className="drop-shadow-[0_0_6px_rgba(255,0,255,0.8)]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
