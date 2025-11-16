import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can send this to a logging service if you want
    console.error("[FE ERROR]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-xl" style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: "var(--muted)" }}>
            {String(this.state.error || "Unknown error")}
          </p>
          <button className="btn" onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
