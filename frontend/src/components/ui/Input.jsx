import React from "react";

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="form-label">
      {children}
    </label>
  );
}

export default function Input({ 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  ...props 
}) {
  return (
    <input
      type={type}
      className="input form-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      {...props}
    />
  );
}