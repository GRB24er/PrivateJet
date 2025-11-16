import React from "react";

export default function Badge({ className = "", children, ...props }) {
  const cls = `badge ${className}`.trim();
  return (
    <span className={cls} {...props}>
      {children}
    </span>
  );
}
