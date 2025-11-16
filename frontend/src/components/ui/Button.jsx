import React from "react";

export default function Button({ 
  children, 
  variant = "primary", 
  disabled = false, 
  onClick, 
  type = "button",
  ...props 
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}