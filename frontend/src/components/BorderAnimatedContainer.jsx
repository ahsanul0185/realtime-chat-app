import React from "react";

const BorderAnimatedContainer = ({ children, className }) => {
  return (
    <div
      className={`w-full h-full [background:linear-gradient(45deg,#172033,--theme(--color-slate-800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),--theme(--color-slate-600/.48)_80%,--theme(--color-indigo-500)_86%,--theme(--color-indigo-300)_90%,--theme(--color-indigo-500)_94%,--theme(--color-slate-600/.48))_border-box] rounded-2xl border border-transparent  animated-border-card ${className}`}
    >
      {children}
    </div>
  );
};

export default BorderAnimatedContainer;
