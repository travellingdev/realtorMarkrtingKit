import React from 'react';

export default function GradientDecoration() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-1/3 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_60%)]" />
      <div className="absolute bottom-[-20%] left-1/4 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.15),transparent_60%)]" />
    </div>
  );
}


