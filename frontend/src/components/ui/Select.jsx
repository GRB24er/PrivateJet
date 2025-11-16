import React from "react";

export default function Select({ className = "", children, ...props }) {
  const cls = `input ${className}`.trim();
  return (
    <select className={cls} {...props}>
      {children}
    </select>
  );
}
