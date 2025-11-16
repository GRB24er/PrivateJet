import React from "react";

export function Card(props) {
  return <div className="card" {...props} />;
}
export function CardHeader(props) {
  return <div className="card-header" {...props} />;
}
export function CardTitle(props) {
  return <h3 className="card-title" {...props} />;
}
export function CardContent(props) {
  return <div className="card-content" {...props} />;
}
