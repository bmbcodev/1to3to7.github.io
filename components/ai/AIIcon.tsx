export function AIIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      {/* Brain hemispheres */}
      <path
        d="M12 2C7.58 2 4 5.58 4 10c0 2.21.9 4.21 2.34 5.66L12 22l5.66-6.34A7.94 7.94 0 0020 10c0-4.42-3.58-8-8-8z"
        fill="url(#ai-grad)"
        opacity="0.2"
        stroke="url(#ai-grad)"
        strokeWidth="1.5"
      />
      {/* Neural connections */}
      <circle cx="9" cy="9" r="1.5" fill="url(#ai-grad)" opacity="0.9" />
      <circle cx="15" cy="9" r="1.5" fill="url(#ai-grad)" opacity="0.9" />
      <circle cx="12" cy="14" r="1.5" fill="url(#ai-grad)" opacity="0.9" />
      <circle cx="7" cy="14" r="1.2" fill="url(#ai-grad)" opacity="0.6" />
      <circle cx="17" cy="14" r="1.2" fill="url(#ai-grad)" opacity="0.6" />
      {/* Connection lines */}
      <path d="M9 9l3 5" stroke="url(#ai-grad)" strokeWidth="1" opacity="0.7" />
      <path d="M15 9l-3 5" stroke="url(#ai-grad)" strokeWidth="1" opacity="0.7" />
      <path d="M9 9l-2 5" stroke="url(#ai-grad)" strokeWidth="0.8" opacity="0.5" />
      <path d="M15 9l2 5" stroke="url(#ai-grad)" strokeWidth="0.8" opacity="0.5" />
      {/* Sparkles */}
      <path d="M19 3l-.5 1.5L17 5l1.5.5.5 1.5.5-1.5L21 5l-1.5-.5z" fill="#fbbf24" opacity="0.8" />
      <path d="M4 5l-.3 1L2 6.5l1.7.2.3 1 .3-1L6 6.5 4.3 6z" fill="#a855f7" opacity="0.8" />
    </svg>
  );
}
