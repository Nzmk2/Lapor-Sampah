import React, { useEffect, useState } from "react";

function Alert({ message, type }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const alertClass = `alert alert-${type}`;
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "⚠";

  return (
    <div className={alertClass}>
      <span className="alert-icon">{icon}</span>
      <span className="alert-message">{message}</span>
    </div>
  );
}

export default Alert;